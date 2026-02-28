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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
              <Utensils className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Nutra</h1>
            <p className="text-slate-500 mt-1">Gestão Nutricional</p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {errorMessages[error] || errorMessages.default}
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-4">
            <p className="text-center text-slate-600">
              Faça login para acessar sua conta e gerenciar sua alimentação.
            </p>

            <Button
              onClick={handleLogin}
              fullWidth
              size="lg"
              className="mt-6"
            >
              Entrar com sua conta
            </Button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Ao continuar, você concorda com nossos{' '}
              <a href="/termos" className="text-emerald-600 hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-emerald-600 hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem uma conta?{' '}
          <a href="/auth/register" className="text-emerald-600 hover:underline font-medium">
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
