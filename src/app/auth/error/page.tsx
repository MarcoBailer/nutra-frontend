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
    <div className="min-h-screen bg-gradient-to-br from-error/5 via-background to-background-secondary flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-error" />
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
          {errorInfo.title}
        </h1>
        
        <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8">
          {errorInfo.description}
        </p>

        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-200"
          >
            Tentar novamente
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg text-text-secondary hover:bg-background-secondary transition-all duration-200"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Voltar para o início
          </Link>
        </div>

        {error && (
          <p className="text-xs text-text-muted mt-4 sm:mt-6">
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
