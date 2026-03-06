/**
 * @fileoverview Redis Adapter para NextAuth.js
 * 
 * Implementa o Adapter Pattern do NextAuth usando Redis como backend.
 * Funciona com Redis local (docker) ou remoto.
 * 
 * @see {@link https://next-auth.js.org/adapters/overview} NextAuth Adapter Interface
 */

import { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';
import { createClient, RedisClientType } from 'redis';

// Criar cliente Redis singleton para evitar múltiplas conexões
let redisClient: RedisClientType | null = null;

/**
 * Obter ou criar cliente Redis
 * Usa as variáveis de ambiente para conectar
 */
function getRedisClient(): RedisClientType {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisPassword = process.env.REDIS_PASSWORD;
    console.log(`[NextAuth] Connecting to Redis at ${redisUrl}`);
    console.log(`[NextAuth] Redis password ${redisPassword ? 'provided' : 'not provided'}`);

    redisClient = createClient({
      url: redisUrl,
      password: redisPassword,
      // Reconnect automático
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
      },
    });

    // Setup de eventos
    redisClient.on('error', (err: Error) => {
      console.error('[NextAuth] Redis Adapter Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('[NextAuth] Redis Adapter Connected');
    });

    // Conectar imediatamente
    redisClient.connect().catch((err: Error) => {
      console.error('[NextAuth] Redis connection failed:', err);
    });
  }

  return redisClient;
}

/**
 * Fechar conexão com Redis
 * Chamado ao desligar a aplicação
 */
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Serialize data to JSON string
 */
function serialize(data: any): string {
  return JSON.stringify(data);
}

/**
 * Deserialize JSON string to object
 */
function deserialize(data: string | null): any {
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Interface para dados de account OAuth que serão persistidos
 */
export interface UpsertOAuthAccountInput {
  provider: string;
  providerAccountId: string;
  userId: string;
  type?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
}

/**
 * Faz upsert (insert or update) dos dados de account OAuth.
 * Chamado pelo callback signIn para persistir tokens a cada login.
 */
export async function upsertOAuthAccountData(data: UpsertOAuthAccountInput): Promise<void> {
  const client = getRedisClient();
  const prefix = 'next-auth:';
  const accountId = `${data.provider}:${data.providerAccountId}`;

  // Buscar account existente ou criar novo
  const existingData = await client.get(`${prefix}account:data:${accountId}`);
  const parsed = deserialize(existingData);

  // Mesclar com dados existentes, dando prioridade aos novos
  const mergedAccount = {
    ...(parsed || {}),
    userId: data.userId,
    provider: data.provider,
    providerAccountId: data.providerAccountId,
    type: data.type,
    ...(data.access_token && { access_token: data.access_token }),
    ...(data.refresh_token && { refresh_token: data.refresh_token }),
    ...(data.expires_at && { expires_at: data.expires_at }),
    ...(data.token_type && { token_type: data.token_type }),
    ...(data.scope && { scope: data.scope }),
    ...(data.id_token && { id_token: data.id_token }),
  };

  // Salvar dados da account
  await client.set(`${prefix}account:data:${accountId}`, serialize(mergedAccount));
  // Índice forward: account → userId
  await client.set(`${prefix}account:${accountId}`, data.userId);
  // Índice reverso: userId → accountId
  await client.set(`${prefix}user:account:${data.userId}`, accountId);
}

/**
 * NextAuth.js Redis Adapter
 * Implementa a interface Adapter para usar Redis como backend de sessão
 */
export function RedisAdapter(): Adapter {
  const client = getRedisClient();
  const prefix = 'next-auth:';

  return {
    /**
     * Criar um novo usuário
     */
    async createUser(data: Omit<AdapterUser, 'id'> & { id?: string }) {
      const user: AdapterUser = {
        ...data,
        id: data.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        emailVerified: data.emailVerified || null,
      };

      const key = `${prefix}user:${user.id}`;
      await client.set(key, serialize(user));

      // Email index (para lookup rápido)
      if (user.email) {
        await client.set(`${prefix}user:email:${user.email}`, user.id);
      }

      return user;
    },

    /**
     * Obter usuário por ID
     */
    async getUser(id: string) {
      const data = await client.get(`${prefix}user:${id}`);
      return deserialize(data);
    },

    /**
     * Obter usuário por email
     */
    async getUserByEmail(email: string) {
      const userId = await client.get(`${prefix}user:email:${email}`);
      if (!userId) return null;
      const data = await client.get(`${prefix}user:${userId}`);
      return deserialize(data);
    },

    /**
     * Obter usuário por account (provider + providerAccountId)
     */
    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const accountId = `${provider}:${providerAccountId}`;
      let userId = await client.get(`${prefix}account:${accountId}`);

      // Compatibilidade com formato antigo que armazenava o account completo nesta chave
      if (userId?.startsWith('{')) {
        const accountData = deserialize(userId) as AdapterAccount | null;
        userId = accountData?.userId ?? null;

        // Migração automática para o formato correto (account -> userId)
        if (userId) {
          await client.set(`${prefix}account:${accountId}`, userId);
        }
      }

      if (!userId) return null;
      const data = await client.get(`${prefix}user:${userId}`);
      return deserialize(data);
    },

    /**
     * Atualizar usuário
     */
    async updateUser(data: Partial<AdapterUser> & { id: string }) {
      const key = `${prefix}user:${data.id}`;
      const existing = await client.get(key);
      const user = {
        ...deserialize(existing),
        ...data,
      };
      await client.set(key, serialize(user));
      return user;
    },

    /**
     * Deletar usuário
     */
    async deleteUser(userId: string) {
      const key = `${prefix}user:${userId}`;
      const user = await client.get(key);
      const userData = deserialize(user);

      // Deletar email index
      if (userData?.email) {
        await client.del(`${prefix}user:email:${userData.email}`);
      }

      // Deletar accounts
      const accountKeys = await client.keys(`${prefix}account:*:${userId}`);
      if (accountKeys.length > 0) {
        await client.del(accountKeys);
      }

      // Deletar índice reverso user -> account e os dados da account vinculada
      const linkedAccountId = await client.get(`${prefix}user:account:${userId}`);
      if (linkedAccountId) {
        await client.del(`${prefix}user:account:${userId}`);
        await client.del(`${prefix}account:${linkedAccountId}`);
        await client.del(`${prefix}account:data:${linkedAccountId}`);
      }

      // Deletar sessions
      const sessionKeys = await client.keys(`${prefix}session:*:${userId}`);
      if (sessionKeys.length > 0) {
        await client.del(sessionKeys);
      }

      // Deletar usuário
      await client.del(key);
    },

    /**
     * Vincular account (OAuth) ao usuário
     */
    async linkAccount(data: AdapterAccount) {
      const account: AdapterAccount = {
        ...data,
      };

      const accountId = `${data.provider}:${data.providerAccountId}`;
      const key = `${prefix}account:data:${accountId}`;

      // Armazenar account
      await client.set(key, serialize(account));
      // Index: account → userId (para lookup rápido)
      await client.set(`${prefix}account:${accountId}`, data.userId);
      // Index reverso: userId -> accountId (para recuperar tokens na sessão)
      await client.set(`${prefix}user:account:${data.userId}`, accountId);

      return account;
    },

    /**
     * Criar nova sessão
     */
    async createSession(data: { sessionToken: string; userId: string; expires: Date | string }) {
      const session: AdapterSession = {
        ...data,
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: new Date(data.expires),
      };

      const key = `${prefix}session:${data.sessionToken}`;
      const ttl = Math.floor((session.expires.getTime() - Date.now()) / 1000);

      // Armazenar com TTL (auto-expiração)
      await client.setEx(key, ttl > 0 ? ttl : 1, serialize(session));
      // Index: userId → sessionToken
      await client.setEx(`${prefix}session:user:${data.userId}:${data.sessionToken}`, ttl > 0 ? ttl : 1, data.sessionToken);

      return session;
    },

    /**
     * Obter sessão por token
     */
    async getSessionAndUser(sessionToken: string) {
      const data = await client.get(`${prefix}session:${sessionToken}`);
      const sessionData = deserialize(data);

      if (!sessionData) return null;

      // Converter expires de string para Date
      const session: AdapterSession = {
        ...sessionData,
        expires: new Date(sessionData.expires),
      };

      const userData = await client.get(`${prefix}user:${session.userId}`);
      const user = deserialize(userData);
      if (!user) return null;

      // Recuperar access_token da conta OAuth vinculada ao usuário
      let accountId = await client.get(`${prefix}user:account:${session.userId}`);

      // Fallback para dados legados: tenta localizar pela chave account -> userId
      if (!accountId) {
        const accountIndexKeys = await client.keys(`${prefix}account:*`);
        for (const accountIndexKey of accountIndexKeys) {
          if (accountIndexKey.includes(':data:')) {
            continue;
          }

          const indexedUserId = await client.get(accountIndexKey);
          if (indexedUserId === session.userId) {
            accountId = accountIndexKey.replace(`${prefix}account:`, '');
            await client.set(`${prefix}user:account:${session.userId}`, accountId);
            break;
          }
        }
      }

      let accessToken: string | undefined;
      if (accountId) {
        const accountDataRaw = await client.get(`${prefix}account:data:${accountId}`);

        // Fallback para formato antigo em que account estava na chave account:{id}
        const accountData = deserialize(accountDataRaw) ?? deserialize(await client.get(`${prefix}account:${accountId}`));

        accessToken = accountData?.access_token;
      }

      const userWithToken = {
        ...user,
        accessToken,
      };

      return { session, user: userWithToken };
    },

    /**
     * Atualizar sessão
     */
    async updateSession(data: Partial<AdapterSession> & { sessionToken: string }) {
      const key = `${prefix}session:${data.sessionToken}`;
      const existing = await client.get(key);
      const session: AdapterSession = {
        ...deserialize(existing),
        ...data,
        expires: data.expires ? new Date(data.expires) : new Date(),
      };

      const ttl = Math.floor((session.expires.getTime() - Date.now()) / 1000);
      await client.setEx(key, ttl > 0 ? ttl : 1, serialize(session));

      return session;
    },

    /**
     * Deletar sessão
     */
    async deleteSession(sessionToken: string) {
      const key = `${prefix}session:${sessionToken}`;
      const data = await client.get(key);
      const session = deserialize(data);

      if (session) {
        // Deletar index
        await client.del(`${prefix}session:user:${session.userId}:${sessionToken}`);
      }

      await client.del(key);
    },

    /**
     * Criar token de verificação (para email verification, password reset, etc)
     */
    async createVerificationToken(data: { identifier: string; token: string; expires: Date | string }) {
      const token: VerificationToken = {
        ...data,
        expires: new Date(data.expires),
      };

      const key = `${prefix}verification:${data.identifier}:${data.token}`;
      const ttl = Math.floor((token.expires.getTime() - Date.now()) / 1000);

      await client.setEx(key, ttl > 0 ? ttl : 1, serialize(token));

      return token;
    },

    /**
     * Usar token de verificação (consome e deleta)
     */
    async useVerificationToken({ identifier, token: tokenValue }: { identifier: string; token: string }) {
      const key = `${prefix}verification:${identifier}:${tokenValue}`;
      const data = await client.get(key);
      const tokenData = deserialize(data);

      if (!tokenData) return null;

      await client.del(key);

      // Converter expires de string para Date
      return {
        ...tokenData,
        expires: new Date(tokenData.expires),
      };
    },
  };
}
