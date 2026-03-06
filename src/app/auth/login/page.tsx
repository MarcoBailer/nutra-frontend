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
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #050f05 60%, #020802 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        padding: '16px',
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          border: '2px solid #00b300',
          borderRadius: '4px',
          background: 'rgba(0,20,0,0.95)',
          boxShadow: '0 0 40px rgba(0,255,0,0.15), inset 0 0 30px rgba(0,50,0,0.3)',
          padding: '32px 28px',
          position: 'relative',
          zIndex: 20,
          color: '#1aff1a',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '0.75rem', color: '#00b300', letterSpacing: '3px', marginBottom: '6px' }}>
            VAULT-TEC INDUSTRIES
          </div>
          <div
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '6px',
              textShadow: '0 0 20px rgba(26,255,26,0.8)',
              lineHeight: 1,
            }}
          >
            NUTRA-3000
          </div>
          <div style={{ fontSize: '0.8rem', color: '#00b300', letterSpacing: '2px', marginTop: '4px' }}>
            SISTEMA DE GESTÃO NUTRICIONAL
          </div>
          <div style={{ borderBottom: '1px solid #00b300', margin: '16px 0', opacity: 0.4 }} />
        </div>

        {/* Terminal lines */}
        <div style={{ fontSize: '0.8rem', color: '#00b300', marginBottom: '20px', lineHeight: 1.8 }}>
          <div>&gt; INICIANDO SISTEMA...</div>
          <div>&gt; VERIFICANDO CONEXÃO VAULT...</div>
          <div style={{ color: '#1aff1a' }}>&gt; SISTEMA PRONTO. AGUARDANDO INPUT.</div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              border: '1px solid #ff4444',
              background: 'rgba(255,68,68,0.08)',
              color: '#ff4444',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.85rem',
              letterSpacing: '1px',
            }}
          >
            [ERRO] {errorMessages[error] ?? errorMessages.default}
          </div>
        )}

        {/* Auth button */}
        <button
          onClick={() => signIn('web-site-service', { callbackUrl })}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            border: '2px solid #1aff1a',
            color: '#1aff1a',
            fontFamily: 'inherit',
            fontSize: '1rem',
            letterSpacing: '3px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            boxShadow: '0 0 10px rgba(26,255,26,0.1)',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.background = 'rgba(26,255,26,0.12)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(26,255,26,0.3)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.background = 'transparent';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 10px rgba(26,255,26,0.1)';
          }}
        >
          [AUTENTICAR AGENTE]
        </button>

        <div style={{ fontSize: '0.7rem', color: '#00b300', textAlign: 'center', marginTop: '16px', opacity: 0.6, letterSpacing: '1px' }}>
          VAULT-TEC NÃO SE RESPONSABILIZA POR PERDA DE DADOS CALÓRICOS
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050f05', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1aff1a', fontFamily: 'monospace' }}>
        CARREGANDO...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
