'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'ERRO AO INICIAR AUTENTICAÇÃO.',
    OAuthCallback: 'ERRO NO RETORNO DA AUTENTICAÇÃO.',
    OAuthCreateAccount: 'ERRO AO CRIAR CONTA.',
    OAuthAccountNotLinked: 'CONTA JÁ VINCULADA A OUTRO USUÁRIO.',
    Callback: 'ERRO AO PROCESSAR AUTENTICAÇÃO.',
    CredentialsSignin: 'CREDENCIAIS INVÁLIDAS.',
    SessionRequired: 'ACESSO RESTRITO. AUTENTIQUE-SE.',
    default: 'ERRO DURANTE AUTENTICAÇÃO. TENTE NOVAMENTE.',
  };

  return (
    <div className="vault-page flex items-center justify-center p-4 sm:p-6">
      <section className="vault-panel w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden relative z-10">
        <aside className="p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-[rgba(133,255,186,0.2)]">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="vault-chip">AUTH TERMINAL</span>
            <span className="vault-chip">SECURE LINK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl text-[#dcffea] tracking-widest font-semibold leading-tight">
            ACESSO AO
            <br />
            NUTRA 3000
          </h1>

          <p className="mt-4 text-sm text-[#9dd7b2] leading-relaxed max-w-sm">
            Entrando no painel voce desbloqueia missoes, progresso diario e uma experiencia gamificada moderna,
            mantendo a essencia Fallout sem perder a clareza visual.
          </p>

          <div className="mt-6 vault-feature-card p-4">
            <p className="text-xs text-[#9fd8b4]">STATUS DE CONEXAO</p>
            <div className="mt-2 text-sm text-[#d4ffe4] space-y-1">
              <p>&gt; INICIANDO NODO VAULT...</p>
              <p>&gt; VALIDANDO CREDENCIAIS...</p>
              <p>&gt; AGUARDANDO AUTENTICACAO.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vaultboy.gif" alt="Vault Boy" className="pip-vault-boy pip-vault-boy-md vault-float" />
          </div>
        </aside>

        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <p className="text-xs tracking-[0.14em] text-[#99ffc3] mb-2">VAULT-TEC INDUSTRIES</p>
          <h2 className="text-2xl sm:text-3xl tracking-widest text-[#d9ffea]">LOGIN DO AGENTE</h2>

          {error && (
            <div className="pip-alert mt-5">
              [ERRO] {errorMessages[error] ?? errorMessages.default}
            </div>
          )}

          <button
            onClick={() => signIn('web-site-service', { callbackUrl })}
            className="pip-btn pip-btn-filled w-full mt-6"
            style={{ paddingTop: '12px', paddingBottom: '12px' }}
          >
            AUTENTICAR E ENTRAR
          </button>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="vault-feature-card p-3">
              <p className="text-[11px] text-[#9dd7b2] tracking-widest">MISSAO</p>
              <p className="text-sm text-[#d7ffe7] mt-1">BATER META DO DIA</p>
            </div>
            <div className="vault-feature-card p-3">
              <p className="text-[11px] text-[#9dd7b2] tracking-widest">RECOMPENSA</p>
              <p className="text-sm text-[#d7ffe7] mt-1">+120 XP</p>
            </div>
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-[#83c5a0]">
            VAULT-TEC NAO SE RESPONSABILIZA POR PERDA DE DADOS CALORICOS.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050f05', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5ffca', fontFamily: 'monospace' }}>
        CARREGANDO...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
