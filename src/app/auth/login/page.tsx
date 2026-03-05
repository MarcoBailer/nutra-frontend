/**
 * @fileoverview Página de login.
 * 
 * Redireciona o usuário para o fluxo de autenticação OAuth.
 * Esta página é mostrada quando o usuário não está autenticado.
 */

'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Utensils } from 'lucide-react';
import { Button } from '@/components/ui';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const error = searchParams.get('error');

  /**
   * Mensagens de erro do NextAuth.
   */
  const errorMessages: Record<string, string> = {
    OAuthSignin: 'Erro ao iniciar autenticação. Tente novamente.',
    OAuthCallback: 'Erro no retorno da autenticação.',
    OAuthCreateAccount: 'Erro ao criar conta.',
    OAuthAccountNotLinked: 'Esta conta já está vinculada a outro usuário.',
    Callback: 'Erro ao processar autenticação.',
    CredentialsSignin: 'Credenciais inválidas.',
    SessionRequired: 'Você precisa estar logado para acessar esta página.',
    default: 'Ocorreu um erro durante a autenticação.',
  };

  const handleLogin = () => {
    signIn('web-site-service', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Card de login */}
        <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mb-3 sm:mb-4">
              <Utensils className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Nutra</h1>
            <p className="text-text-muted mt-1 text-sm sm:text-base">Gestão Nutricional</p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm">
              {errorMessages[error] || errorMessages.default}
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-center text-sm sm:text-base text-text-secondary">
              Faça login para acessar sua conta e gerenciar sua alimentação.
            </p>

            <Button
              onClick={handleLogin}
              fullWidth
              size="lg"
              className="mt-4 sm:mt-6"
            >
              Entrar com sua conta
            </Button>

            <p className="text-xs text-center text-text-muted mt-3 sm:mt-4">
              Ao continuar, você concorda com nossos{' '}
              <a href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-text-muted mt-4 sm:mt-6">
          Não tem uma conta?{' '}
          <a href="/auth/register" className="text-primary hover:underline font-medium">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
