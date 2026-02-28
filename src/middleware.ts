/**
 * @fileoverview Middleware para proteção de rotas.
 * 
 * Este middleware intercepta requisições e verifica autenticação:
 * - Rotas públicas: /, /auth/*, /api/auth/*
 * - Rotas protegidas: todas as outras
 * 
 * FLUXO:
 * 1. Requisição chega ao middleware
 * 2. Verifica se é rota pública → permite
 * 3. Verifica se há token de sessão → permite se válido
 * 4. Sem token → redireciona para /auth/login
 * 
 * VERIFICAÇÃO DE ROLES:
 * - Rotas /nutricionista/* requerem role "Nutricionista"
 * - Rotas /admin/* requerem role "Admin"
 * 
 * @see {@link https://next-auth.js.org/configuration/nextjs#middleware}
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Verificar roles para rotas específicas
    const roles = (token?.roles as string[]) ?? [];

    // Rotas de nutricionista
    if (pathname.startsWith('/pacientes') || pathname.startsWith('/clinicas')) {
      if (!roles.includes('Nutricionista') && !roles.includes('Admin')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Rotas de admin
    if (pathname.startsWith('/admin')) {
      if (!roles.includes('Admin')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * Verifica se o usuário está autorizado.
       * Retorna true se o token existe (usuário logado).
       */
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
  }
);

/**
 * Configuração do matcher.
 * Define quais rotas passam pelo middleware.
 * 
 * EXCLUÍDOS:
 * - / (página inicial pública)
 * - /auth/* (páginas de autenticação)
 * - /api/auth/* (APIs do NextAuth)
 * - /_next/* (arquivos estáticos do Next.js)
 * - /favicon.ico, /robots.txt, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - / (home page)
     * - /auth/* (auth pages)
     * - /api/auth/* (NextAuth API routes)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt, /sitemap.xml
     * - Static files (images, fonts, etc.)
     */
    '/((?!auth|api/auth|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    '/dashboard/:path*',
    '/busca/:path*',
    '/plano/:path*',
    '/diario/:path*',
    '/avaliacoes/:path*',
    '/progresso/:path*',
    '/perfil/:path*',
    '/configuracoes/:path*',
    '/pacientes/:path*',
    '/clinicas/:path*',
    '/admin/:path*',
  ],
};
