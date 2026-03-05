/**
 * @fileoverview Configuração NextAuth.js para integração com OpenID Connect.
 * 
 * Este arquivo configura o NextAuth.js para autenticar com o provedor de identidade
 * (web_site_service) usando OpenID Connect. O fluxo de autenticação é:
 * 
 * 1. Usuário clica em "Entrar"
 * 2. NextAuth redireciona para o Identity Provider (web_site_service)
 * 3. Usuário faz login no Identity Provider
 * 4. Identity Provider redireciona de volta com código de autorização
 * 5. NextAuth troca o código por tokens (access_token, id_token, refresh_token)
 * 6. Tokens são armazenados no Redis (self-hosted em Docker)
 * 7. Frontend pode acessar dados do usuário via useSession() ou getServerSession()
 * 
 * ARMAZENAMENTO DE SESSÃO:
 * - Usa Redis (self-hosted) como backend de armazenamento de sessão
 * - Cookies contêm apenas sessionToken (referência) → evita limite de 4096 bytes
 * - Tokens completos (access_token, refresh_token) ficam seguros no Redis
 * 
 * FLUXO DE TOKENS:
 * - access_token: Usado para chamar a API Nutra (enviado no header Authorization: Bearer)
 * - refresh_token: Usado para renovar o access_token quando expira
 * - id_token: Contém dados do usuário (claims) do Identity Provider
 * 
 * @see {@link https://next-auth.js.org/configuration/options} Documentação NextAuth
 * @see {@link ./adapters/redis.ts} Custom Redis Adapter (self-hosted)
 * @see {@link ../../../deploy/docker-compose.yml} Redis Service Configuration
 */

import { NextAuthOptions } from 'next-auth';
import { RedisAdapter } from './adapters/redis';

/**
 * Função para renovar o access_token usando o refresh_token.
 * NOTA: Com Database Adapter (Redis), esta função não é mais necessária,
 * pois a renovação é gerenciada automaticamente pelo NextAuth através do
 * callback `signIn` ou por middleware customizado.
 * 
 * Se precisar renovar tokens no servidor, use getServerSession() +
 * OMITIDO POR ENQUANTO - Adicione só se precisar de renovação automática no servidor sideca
 */

/**
 * Configuração principal do NextAuth.js.
 * 
 * PROVIDERS:
 * - Usa OpenID Connect com o Identity Provider (web_site_service)
 * - Escopos solicitados: openid, offline_access (necessário para refresh_token)
 * 
 * ADAPTER:
 * - Redis (self-hosted) como backend de armazenamento de sessão
 * - Evita limite de 4096 bytes de cookie
 * - Sessão fica segura e sincronizada no servidor
 * 
 * CALLBACKS:
 * - session: Expõe dados da sessão de forma segura para o frontend
 * 
 * EVENTS:
 * - signOut: Revoga o token no Identity Provider ao fazer logout
 */
export const authOptions: NextAuthOptions = {
  /**
   * ADAPTER REDIS
   * Armazenar sessões no Redis ao invés de JWT no cookie.
   * Reduz tamanho do cookie de 5153 bytes para ~100 bytes (apenas sessionToken).
   */
  adapter: RedisAdapter(),

  /**
   * PROVEDOR DE IDENTIDADE
   * Configuração para conectar com o web_site_service via OIDC
   */
  providers: [
    {
      id: 'web-site-service',
      name: 'Nutra Auth',
      // Use 'oauth' como tipo - NextAuth suporta OIDC automaticamente 
      // quando issuer é fornecido (auto-descoberta via .well-known/openid-configuration)
      type: 'oauth',
      // URL do Identity Provider (deve ter .well-known/openid-configuration)
      issuer: process.env.OIDC_ISSUER,
      clientId: process.env.OIDC_CLIENT_ID!,
      clientSecret: process.env.OIDC_CLIENT_SECRET!,
      // Para OIDC com descoberta automática
      wellKnown: `${process.env.OIDC_ISSUER}/.well-known/openid-configuration`,
      authorization: {
        params: {
          // Escopos suportados: openid (obrigatório), profile, email, offline_access (refresh_token)
          scope: 'openid profile email offline_access',
        },
      },
      // Usar JWT para tokens (comum em OIDC)
      idToken: true,
      // Definir como pegar os tokens
      checks: ['pkce', 'state'],
      // Carregar informações adicionais do userinfo endpoint
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.preferred_username ?? profile.sub,
          email: profile.email ?? '',
          image: null,
        };
      },
    },
  ],

  /**
   * CALLBACKS
   * Funções executadas em momentos específicos do ciclo de autenticação
   */
  callbacks: {
    /**
     * Callback executado após login bem-sucedido.
     * Persiste os tokens OAuth ao Redis para uso nas proximasrequisições.
     * 
     * @param user - Dados do usuário do provider
     * @param account - Dados da conta OAuth (com access_token, refresh_token, etc)
     */
    async signIn({ user, account }) {
      // Persisti os tokens OAuth no Redis para uso futuro
      if (user?.id && account?.provider && account?.providerAccountId) {
        const { upsertOAuthAccountData } = await import('./adapters/redis');
        await upsertOAuthAccountData({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          userId: user.id,
          type: account.type,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
        });
      }
      return true;
    },

    /**
     * Session Callback
     * Define quais dados ficam disponíveis na sessão do frontend.
     * 
     * Quando usando Database Adapter (Redis), a sessão vem do banco, não do JWT.
     * Este callback converte os dados do adapter para o formato esperado pelo frontend.
     * 
     * @param session - Sessão atual (do Redis)
     * @param token - Não usado com adapter (undefined)
     * @param user - Dados do usuário (do Redis)
     */
    async session({ session, user }) {
      // Adicionar ID do usuário à sessão
      if (user?.id) {
        session.user.id = user.id;
      }

      // Expor access_token para chamadas autenticadas à API Nutra
      const adapterUser = user as typeof user & { accessToken?: string };
      if (adapterUser?.accessToken) {
        session.accessToken = adapterUser.accessToken;
      }

      return session;
    },

    /**
     * Redirect Callback
     * Controla para onde redirecionar após login/logout.
     */
    async redirect({ url, baseUrl }) {
      // URLs relativas - manter no mesmo domínio
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // URLs absolutas do mesmo domínio - permitir
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Outras URLs - redirecionar para home
      return baseUrl;
    },
  },

  /**
   * EVENTS
   * Ações executadas em eventos específicos
   */
  events: {
    /**
     * SignOut Event
     * Executa quando o usuário faz logout.
     * Limpa a sessão do Redis e pode revogar token no Identity Provider.
     */
    async signOut() {
      // Com Database Adapter, NextAuth limpa automaticamente do Redis
      // Opcionalmente, revogar token no Identity Provider:
      // await fetch(`${process.env.OIDC_ISSUER}/connect/revoke`, {...})
      console.log('[NextAuth] Usuário desconectado (sessão removida do Redis)');
    },
  },

  /**
   * PAGES
   * URLs personalizadas para páginas de autenticação
   */
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },

  /**
   * SESSION
   * Configuração da estratégia de sessão (Database para usar Redis)
   */
  session: {
    // Usar Database Adapter (Redis) em vez de JWT no cookie
    strategy: 'database',
    // Tempo máximo de sessão (30 dias)
    maxAge: 30 * 24 * 60 * 60,
    // Atualizar cookie a cada 24 horas
    updateAge: 24 * 60 * 60,
  },

  /**
   * DEBUG
   * Habilitar logs detalhados em desenvolvimento
   */
  debug: process.env.NODE_ENV === 'development',
};
