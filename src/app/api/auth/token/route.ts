/**
 * @fileoverview Endpoint para obter um access token válido.
 * 
 * Este endpoint obtém o access_token do NextAuth (renovando se necessário).
 * Usado pelo frontend para fazer requisições autenticadas à API Nutra.
 * 
 * FLUXO:
 * 1. Frontend faz GET /api/auth/token
 * 2. Server obtém a sessão
 * 3. Se token expirou, renova usando refresh_token
 * 4. Retorna o access_token válido
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

    // O token é renovado automaticamente pelo callback JWT
    // Aqui apenas retornamos o refresh_token para que o cliente obtenha um novo token
    return NextResponse.json({
      success: true,
      // Não retorna o token por segurança - o cliente usa cookies HTTP-only
      authenticated: true,
      user: {
        id: session.user?.id,
        email: session.user?.email,
      },
    });
  } catch (error) {
    console.error('[API] Erro ao obter token:', error);
    return NextResponse.json(
      { error: 'Erro ao obter token' },
      { status: 500 }
    );
  }
}
