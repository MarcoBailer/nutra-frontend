/**
 * @fileoverview Provider de Sessão NextAuth.js para o App Router.
 * 
 * Este componente wrappa a aplicação com o SessionProvider do NextAuth,
 * permitindo que componentes filhos usem o hook useSession().
 * 
 * IMPORTANTE: Como é um Client Component ('use client'), deve ser usado
 * no layout.tsx para envolver todas as páginas que precisam de autenticação.
 * 
 * @example
 * ```tsx
 * // Em app/layout.tsx
 * import { AuthSessionProvider } from '@/components/providers/auth-session-provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthSessionProvider>
 *           {children}
 *         </AuthSessionProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthSessionProviderProps {
  children: ReactNode;
}

/**
 * Provider de sessão para autenticação.
 * Envolve a aplicação com o contexto de sessão do NextAuth.
 */
export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return (
    <SessionProvider
      // Refetch da sessão a cada 5 minutos para manter tokens atualizados
      refetchInterval={5 * 60}
      // Refetch quando a janela ganha foco (usuário volta à aba)
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
