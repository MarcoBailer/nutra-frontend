/**
 * @fileoverview Cliente HTTP base para comunicação com a API Nutra.
 * 
 * Este módulo fornece uma instância configurada do Axios para fazer
 * requisições à API Nutra. Suporta dois modos de uso:
 * 
 * 1. SERVER-SIDE (SSR/API Routes): Fornece o token diretamente
 * 2. CLIENT-SIDE (Browser): Usa o endpoint de sessão do NextAuth
 * 
 * ARQUITETURA:
 * ```
 * ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
 * │   Next.js App   │────▶│   API Client    │────▶│   Nutra API     │
 * │  (SSR/Client)   │     │   (Axios)       │     │   (.NET)        │
 * └─────────────────┘     └─────────────────┘     └─────────────────┘
 *         │                       │
 *         │                       │ Authorization: Bearer <token>
 *         ▼                       │
 * ┌─────────────────┐            │
 * │   NextAuth.js   │────────────┘
 * │   (Sessão)      │  Token JWT
 * └─────────────────┘
 * ```
 * 
 * TRATAMENTO DE ERROS:
 * - 401 Unauthorized: Token expirado ou inválido → Redireciona para login
 * - 403 Forbidden: Sem permissão → Mostra mensagem de erro
 * - 4xx/5xx: Erros de validação ou servidor → Retorna mensagem da API
 * 
 * @see {@link ../lib/auth.ts} Configuração de autenticação
 * @see {@link ./services/} Serviços específicos da API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * URL base da API Nutra.
 * - Servidor: Usa NUTRA_API_URL (pode ser URL interna Docker)
 * - Cliente: Usa NEXT_PUBLIC_NUTRA_API_URL (deve ser acessível pelo browser)
 */
const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NUTRA_API_URL
  : process.env.NEXT_PUBLIC_NUTRA_API_URL;

/**
 * Interface para erros da API Nutra.
 * O backend .NET retorna erros neste formato.
 */
export interface ApiError {
  sucesso: boolean;
  mensagem: string;
  erros?: string[];
}

/**
 * Erro customizado para erros da API.
 * Fornece acesso tipado aos dados do erro.
 */
export class NutraApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: ApiError
  ) {
    super(message);
    this.name = 'NutraApiError';
  }
}

/**
 * Cria uma instância do cliente Axios configurada.
 * 
 * @param token - Token JWT opcional (para uso server-side)
 * @returns Instância configurada do Axios
 */
export function createApiClient(token?: string): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar token de autorização
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      let authToken = token;

      // Se está no cliente, busca o token da sessão do NextAuth
      if (!authToken && typeof window !== 'undefined') {
        try {
          const session = await fetch('/api/auth/session').then(r => r.json());
          authToken = session?.accessToken;
        } catch (error) {
          console.warn('[ApiClient] Erro ao obter sessão:', error);
        }
      }

      // Adiciona header de autorização se tiver token
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratamento de erros
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      const status = error.response?.status ?? 0;
      const data = error.response?.data;

      // Log para debug
      console.error('[ApiClient] Erro na requisição:', {
        url: error.config?.url,
        status,
        mensagem: data?.mensagem || error.message,
      });

      // Tratamento específico por status
      if (status === 401) {
        // Evita loop de redirecionamento: só redireciona se a sessão NextAuth realmente não existir
        if (typeof window !== 'undefined') {
          void fetch('/api/auth/session')
            .then((response) => response.json())
            .then((session) => {
              if (!session?.user) {
                window.location.href = '/auth/login';
              }
            })
            .catch(() => {
              window.location.href = '/auth/login';
            });
        }
        throw new NutraApiError('Não autorizado na API Nutra. Verifique o token de acesso.', status, data);
      }

      if (status === 403) {
        throw new NutraApiError('Você não tem permissão para acessar este recurso.', status, data);
      }

      if (status === 404) {
        throw new NutraApiError(data?.mensagem || 'Recurso não encontrado.', status, data);
      }

      if (status >= 400 && status < 500) {
        throw new NutraApiError(
          data?.mensagem || 'Erro na requisição. Verifique os dados enviados.',
          status,
          data
        );
      }

      if (status >= 500) {
        throw new NutraApiError(
          'Erro interno do servidor. Tente novamente mais tarde.',
          status,
          data
        );
      }

      // Erro de rede ou timeout
      throw new NutraApiError(
        'Erro de conexão. Verifique sua internet e tente novamente.',
        0
      );
    }
  );

  return client;
}

/**
 * Cliente padrão para uso no browser.
 * Busca automaticamente o token da sessão NextAuth.
 */
export const apiClient = createApiClient();

/**
 * Cria um cliente com token específico (para uso em Server Components/API Routes).
 * 
 * @example
 * ```ts
 * // Em uma API Route ou Server Component
 * import { getServerSession } from 'next-auth';
 * import { authOptions } from '@/lib/auth';
 * import { createServerApiClient } from '@/lib/api-client';
 * 
 * const session = await getServerSession(authOptions);
 * const api = createServerApiClient(session?.accessToken);
 * const user = await api.get('/api/Accounts/me');
 * ```
 * 
 * @param token - Token de acesso JWT
 * @returns Cliente Axios configurado com o token
 */
export function createServerApiClient(token?: string): AxiosInstance {
  return createApiClient(token);
}
