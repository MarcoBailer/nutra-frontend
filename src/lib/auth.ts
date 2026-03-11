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
import type { JWT } from 'next-auth/jwt';
import {
  deleteOAuthAccountData,
  getOAuthAccountData,
  upsertOAuthAccountData,
} from './adapters/redis';

type OidcProfile = {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  role?: string | string[];
  roles?: string | string[];
};

function normalizeRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((role): role is string => typeof role === 'string');
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
}

async function refreshAccessToken(userId: string) {
  const account = await getOAuthAccountData(userId);

  if (!account?.refresh_token) {
    throw new Error('Refresh token não disponível para esta sessão.');
  }

  const tokenEndpoint = process.env.OIDC_TOKEN_ENDPOINT || `${process.env.OIDC_ISSUER}/connect/token`;
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: account.refresh_token,
    client_id: process.env.OIDC_CLIENT_ID!,
  });

  if (process.env.OIDC_CLIENT_SECRET) {
    body.set('client_secret', process.env.OIDC_CLIENT_SECRET);
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Falha ao renovar access token: ${response.status} ${errorBody}`);
  }

  const refreshed = await response.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
  };

  const expiresAt = refreshed.expires_in
    ? Math.floor(Date.now() / 1000) + refreshed.expires_in
    : account.expires_at;

  await upsertOAuthAccountData({
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    userId,
    type: account.type,
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token ?? account.refresh_token,
    expires_at: expiresAt,
    token_type: refreshed.token_type ?? account.token_type,
    scope: refreshed.scope ?? account.scope,
    id_token: refreshed.id_token ?? account.id_token,
  });

  return getOAuthAccountData(userId);
}

async function getValidAccessToken(userId: string) {
  let account = await getOAuthAccountData(userId);

  if (!account?.access_token) {
    return { accessToken: undefined, error: 'MissingAccessToken' };
  }

  const now = Math.floor(Date.now() / 1000);
  const shouldRefresh = typeof account.expires_at === 'number' && account.expires_at <= now + 60;

  if (shouldRefresh) {
    try {
      account = await refreshAccessToken(userId);
    } catch (error) {
      console.error('[NextAuth] Falha ao renovar access token:', error);
      return { accessToken: undefined, error: 'RefreshAccessTokenError' };
    }
  }

  return { accessToken: account?.access_token, error: undefined };
}

/**
 * Configuração principal do NextAuth.js.
 * 
 * PROVIDERS:
 * - Usa OpenID Connect com o Identity Provider (web_site_service)
 * - Escopos solicitados: openid, profile, email, roles, nutra-api e offline_access
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
          // Solicita roles para que UI e middleware possam autorizar corretamente.
          scope: 'openid profile email roles nutra-api offline_access',
        },
      },
      // Usar JWT para tokens (comum em OIDC)
      idToken: true,
      // Definir como pegar os tokens
      checks: ['pkce', 'state'],
      // Carregar informações adicionais do userinfo endpoint
      profile(profile: OidcProfile) {
        return {
          id: profile.sub ?? '',
          name: profile.name ?? profile.preferred_username ?? profile.sub ?? '',
          email: profile.email ?? '',
          image: null,
          roles: normalizeRoles(profile.roles ?? profile.role),
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

    async jwt({ token, user, profile }) {
      if (user?.id) {
        token.userId = user.id;
      }

      const oidcProfile = profile as OidcProfile | undefined;
      const userWithRoles = user as typeof user & { roles?: string[] };
      const roles = userWithRoles?.roles ?? normalizeRoles(oidcProfile?.roles ?? oidcProfile?.role);

      if (roles.length > 0) {
        token.roles = roles;
      }

      if (user?.name) {
        token.name = user.name;
      }

      if (user?.email) {
        token.email = user.email;
      }

      return token;
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
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }

      session.user.name = token.name ?? session.user.name;
      session.user.email = token.email ?? session.user.email;
      session.user.roles = Array.isArray(token.roles) ? token.roles : [];

      if (token.userId) {
        const { accessToken, error } = await getValidAccessToken(token.userId);
        if (accessToken) {
          session.accessToken = accessToken;
        }
        if (error) {
          session.error = error;
        }
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
    async signOut(message) {
      const jwtMessage = message as { token?: JWT };
      if (jwtMessage.token?.userId) {
        await deleteOAuthAccountData(jwtMessage.token.userId);
      }

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
    // JWT leve no cookie para o middleware funcionar; tokens OAuth ficam no Redis.
    strategy: 'jwt',
    // Tempo máximo de sessão (30 dias)
    maxAge: 30 * 24 * 60 * 60,
    // Atualizar cookie a cada 24 horas
    updateAge: 24 * 60 * 60,
  },

  /**
   * DEBUG
   * Habilitar logs detalhados em desenvolvimento
   */
  // debug: process.env.NODE_ENV === 'development',
  debug: false,
};
