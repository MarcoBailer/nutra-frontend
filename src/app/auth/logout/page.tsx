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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6">
          <Utensils className="h-8 w-8 text-white" />
        </div>
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-600">Saindo da sua conta...</p>
      </div>
    </div>
  );
}
