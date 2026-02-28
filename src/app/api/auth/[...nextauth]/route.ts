/**
 * @fileoverview API Route Handler para NextAuth.js.
 * 
 * Este arquivo expõe os endpoints de autenticação do NextAuth:
 * - GET /api/auth/signin - Página de login
 * - POST /api/auth/signin/:provider - Iniciar login com provider
 * - GET /api/auth/callback/:provider - Callback após login
 * - GET /api/auth/signout - Página de logout
 * - POST /api/auth/signout - Executar logout
 * - GET /api/auth/session - Dados da sessão atual
 * - GET /api/auth/csrf - Token CSRF para proteção
 * - GET /api/auth/providers - Lista de providers disponíveis
 * 
 * O NextAuth gerencia automaticamente todos estes endpoints.
 * 
 * @see {@link ../../../lib/auth.ts} Configuração do NextAuth
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Handler do NextAuth.
 * Exportado como GET e POST para o App Router do Next.js 13+.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
