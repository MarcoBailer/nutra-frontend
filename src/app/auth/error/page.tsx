/**
 * @fileoverview Página de erro de autenticação.
 */

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: 'Erro de Configuração',
      description: 'Há um problema com a configuração do servidor de autenticação.',
    },
    AccessDenied: {
      title: 'Acesso Negado',
      description: 'Você não tem permissão para acessar este recurso.',
    },
    Verification: {
      title: 'Erro de Verificação',
      description: 'O link de verificação expirou ou já foi utilizado.',
    },
    Default: {
      title: 'Erro de Autenticação',
      description: 'Ocorreu um erro durante o processo de autenticação.',
    },
  };

  const errorInfo = errorMessages[error ?? 'Default'] ?? errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {errorInfo.title}
        </h1>
        
        <p className="text-slate-600 mb-8">
          {errorInfo.description}
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
          >
            Tentar novamente
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o início
          </Link>
        </div>

        {error && (
          <p className="text-xs text-slate-400 mt-6">
            Código do erro: {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
