/**
 * @fileoverview Provider do React Query para gerenciamento de cache e estado server.
 * 
 * Configura o QueryClient com opções otimizadas para a aplicação:
 * - Retry automático em falhas
 * - Cache com stale time configurável
 * - Refetch em foco da janela
 * 
 * @see {@link https://tanstack.com/query/latest} Documentação TanStack Query
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider do React Query.
 * Fornece o contexto para todos os hooks de query (useQuery, useMutation).
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Criar QueryClient apenas uma vez por instância do componente
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo que os dados são considerados "frescos" (5 minutos)
            staleTime: 5 * 60 * 1000,
            // Tempo máximo que os dados ficam em cache (30 minutos)
            gcTime: 30 * 60 * 1000,
            // Tentar novamente 2 vezes antes de falhar
            retry: 2,
            // Delay entre retries (exponencial)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: true,
            // Não refetch automaticamente ao montar
            refetchOnMount: false,
          },
          mutations: {
            // Mutations não fazem retry por padrão
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
