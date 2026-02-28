/**
 * @fileoverview Extensão dos tipos do NextAuth.js para incluir campos customizados.
 * 
 * Este arquivo estende as interfaces padrão do NextAuth para incluir:
 * - accessToken: Token JWT para autenticação na API Nutra
 * - roles: Array de roles do usuário (Paciente, Nutricionista, Admin)
 * - error: Mensagem de erro (ex: RefreshAccessTokenError)
 * 
 * IMPORTANTE: Estes tipos são usados em todo o frontend para tipar corretamente
 * a sessão retornada por useSession() e getServerSession().
 * 
 * @see {@link ../lib/auth.ts} Configuração NextAuth que popula estes campos
 */

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extensão da interface Session do NextAuth.
   * Disponível via useSession() (client) e getServerSession() (server).
   */
  interface Session {
    /** Token de acesso JWT para chamadas à API Nutra */
    accessToken: string;
    
    /** Erro de autenticação (ex: RefreshAccessTokenError quando token não pode ser renovado) */
    error?: string;
    
    /** Dados do usuário com campos customizados */
    user: {
      /** ID único do usuário no Identity Provider */
      id: string;
      
      /** Roles do usuário para controle de acesso */
      roles: string[];
    } & DefaultSession['user'];
  }

  /**
   * Extensão da interface User do NextAuth.
   * Representa o usuário retornado pelo Identity Provider.
   */
  interface User {
    /** Roles do usuário */
    roles?: string[];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extensão da interface JWT do NextAuth.
   * Representa o token armazenado na sessão.
   */
  interface JWT {
    /** Token de acesso para a API Nutra */
    accessToken?: string;
    
    /** Token de refresh para renovação automática */
    refreshToken?: string;
    
    /** Timestamp de expiração do access_token (Unix epoch em segundos) */
    expiresAt?: number;
    
    /** Roles do usuário */
    roles?: string[];
    
    /** ID do usuário no Identity Provider */
    userId?: string;
    
    /** Erro de autenticação */
    error?: string;
  }
}
