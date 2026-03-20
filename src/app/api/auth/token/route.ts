/**
 * @fileoverview Endpoint para obter um access token válido.
 * 
 * Este endpoint obtém o estado autenticado da sessão do NextAuth.
 * Se a sessão for consultada, o callback de sessão do NextAuth já tenta
 * renovar o access_token no servidor quando necessário.
 * Usado pelo frontend para fazer requisições autenticadas à API Nutra.
 * 
 * FLUXO:
 * 1. Frontend faz GET /api/auth/token
 * 2. Server obtém a sessão
 * 3. Se o token expirou, o callback de sessão tenta renová-lo no servidor
 * 4. Retorna o estado autenticado da sessão
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obter sessão do servidor
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // A renovação do token acontece no callback de sessão do NextAuth.
    return NextResponse.json({
      success: true,
      // Não retorna o token por segurança.
      authenticated: true,
      user: {
        id: session.user?.id,
        email: session.user?.email,
      },
      error: session.error,
    });
  } catch (error) {
    console.error('[API] Erro ao obter token:', error);
    return NextResponse.json(
      { error: 'Erro ao obter token' },
      { status: 500 }
    );
  }
}
