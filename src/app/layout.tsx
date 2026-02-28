/**
 * @fileoverview Layout raiz da aplicação.
 * 
 * Este arquivo configura:
 * - Fontes globais (Inter)
 * - Providers de autenticação e estado
 * - Metadados SEO
 * 
 * ESTRUTURA DE PROVIDERS:
 * ```
 * AuthSessionProvider (NextAuth)
 *   └── QueryProvider (React Query)
 *         └── {children}
 * ```
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthSessionProvider } from '@/components/providers/auth-session-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Nutra - Gestão Nutricional',
    template: '%s | Nutra',
  },
  description:
    'Plataforma completa para gestão nutricional. Acompanhe sua dieta, registre refeições e alcance seus objetivos.',
  keywords: ['nutrição', 'dieta', 'saúde', 'alimentação', 'plano alimentar'],
  authors: [{ name: 'Nutra Team' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Nutra',
  },
};

/**
 * Layout raiz que envolve toda a aplicação.
 * Configura providers globais e estilos base.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <AuthSessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
