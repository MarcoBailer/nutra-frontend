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
 * 6. Tokens são armazenados na sessão segura do NextAuth (cookie HTTP-only)
 * 7. Frontend pode acessar dados do usuário via useSession() ou getServerSession()
 * 
 * FLUXO DE TOKENS:
 * - access_token: Usado para chamar a API Nutra (enviado no header Authorization: Bearer)
 * - refresh_token: Usado para renovar o access_token quando expira
 * - id_token: Contém dados do usuário (claims) do Identity Provider
 * 
 * RENOVAÇÃO AUTOMÁTICA:
 * - Quando o access_token expira, o callback jwt() detecta e usa o refresh_token
 * - Se a renovação falhar, session.error = "RefreshAccessTokenError"
 * - O frontend deve verificar este erro e redirecionar para login
 * 
 * @see {@link https://next-auth.js.org/configuration/options} Documentação NextAuth
 * @see {@link ../../../web_site_service/docs/INTEGRATION_GUIDE.md} Guia de integração
 */

import { NextAuthOptions } from 'next-auth';

/**
 * Função para renovar o access_token usando o refresh_token.
 * Chamada automaticamente quando o token expira.
 * 
 * @param token - Token atual contendo refresh_token
 * @returns Token atualizado ou token com erro
 */
async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const response = await fetch(`${process.env.OIDC_ISSUER}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
        client_id: process.env.OIDC_CLIENT_ID!,
        client_secret: process.env.OIDC_CLIENT_SECRET!,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw tokens;
    }

    console.log('[NextAuth] Token renovado com sucesso');

    return {
      ...token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
    };
  } catch (error) {
    console.error('[NextAuth] Erro ao renovar token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

/**
 * Configuração principal do NextAuth.js.
 * 
 * PROVIDERS:
 * - Usa OpenID Connect com o Identity Provider (web_site_service)
 * - Escopos solicitados: openid, profile, email, roles, offline_access
 * 
 * CALLBACKS:
 * - jwt: Processa tokens e detecta expiração para renovação
 * - session: Expõe dados do token de forma segura para o frontend
 * 
 * EVENTS:
 * - signOut: Revoga o token no Identity Provider ao fazer logout
 */
export const authOptions: NextAuthOptions = {
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
          // Escopos: openid (obrigatório), profile (nome), email, 
          // roles (para autorização), offline_access (refresh_token)
          scope: 'openid profile email roles offline_access',
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
          name: profile.name ?? profile.preferred_username ?? profile.email,
          email: profile.email,
          image: profile.picture,
          roles: profile.roles ?? [],
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
     * JWT Callback
     * Executado quando um JWT é criado ou acessado.
     * 
     * @param token - Token JWT atual
     * @param account - Dados da conta (disponível apenas no primeiro login)
     * @param profile - Perfil do usuário do Identity Provider
     */
    async jwt({ token, account, profile }) {
      // Primeiro login - salvar tokens do Identity Provider
      if (account) {
        console.log('[NextAuth] Primeiro login - salvando tokens');
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.roles = (profile as { roles?: string[] })?.roles ?? [];
        token.userId = account.providerAccountId;
      }

      // Verificar se token ainda é válido
      const expiresAt = token.expiresAt as number;
      if (Date.now() < expiresAt * 1000) {
        return token;
      }

      // Token expirou - tentar renovar
      console.log('[NextAuth] Token expirado - tentando renovar');
      return refreshAccessToken(token);
    },

    /**
     * Session Callback
     * Define quais dados do token ficam disponíveis na sessão do frontend.
     * 
     * @param session - Sessão atual
     * @param token - Token JWT
     */
    async session({ session, token }) {
      // Disponibilizar access_token para chamadas à API
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      
      // Dados do usuário
      session.user.id = token.userId as string;
      session.user.roles = token.roles as string[];
      
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
     * Revoga o token no Identity Provider para invalidar a sessão.
     */
    async signOut({ token }) {
      if (token?.accessToken) {
        try {
          await fetch(`${process.env.OIDC_ISSUER}/connect/revoke`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: token.accessToken as string,
              client_id: process.env.OIDC_CLIENT_ID!,
              client_secret: process.env.OIDC_CLIENT_SECRET!,
            }),
          });
          console.log('[NextAuth] Token revogado no Identity Provider');
        } catch (error) {
          console.error('[NextAuth] Erro ao revogar token:', error);
        }
      }
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
   * Configuração da estratégia de sessão (JWT para stateless)
   */
  session: {
    strategy: 'jwt',
    // Tempo máximo de sessão (30 dias)
    maxAge: 30 * 24 * 60 * 60,
  },

  /**
   * DEBUG
   * Habilitar logs detalhados em desenvolvimento
   */
  debug: process.env.NODE_ENV === 'development',
};
