/**
 * @fileoverview Página de logout.
 * 
 * Executa o logout e redireciona para a página inicial.
 */

'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui';
import { Utensils } from 'lucide-react';

export default function LogoutPage() {
  useEffect(() => {
    // Executa o logout e redireciona para a home
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Utensils className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
        </div>
        <LoadingSpinner size="lg" className="mx-auto mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base text-text-secondary">Saindo da sua conta...</p>
      </div>
    </div>
  );
}
