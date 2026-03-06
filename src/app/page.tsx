import Link from 'next/link';

export default function HomePage() {
  const features = [
    { icon: '⚡', label: 'STATUS', desc: 'MONITORAMENTO DE MACROS E CALORIAS EM TEMPO REAL.' },
    { icon: '📋', label: 'DIÁRIO', desc: 'REGISTRO DE CONSUMO DIÁRIO COM BANCO DE ALIMENTOS.' },
    { icon: '🎯', label: 'PLANOS', desc: 'PLANOS ALIMENTARES PERSONALIZADOS POR OBJETIVO.' },
    { icon: '📊', label: 'CORPO', desc: 'AVALIAÇÕES ANTROPOMÉTRICAS E EVOLUÇÃO CORPORAL.' },
    { icon: '🔍', label: 'INVENTÁRIO', desc: 'MAIS DE MILHARES DE ITENS NO BANCO DE DADOS.' },
    { icon: '👨‍⚕️', label: 'SUPORTE', desc: 'ACOMPANHAMENTO COM NUTRICIONISTAS CERTIFICADOS.' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 30%, #0a1a0a 0%, #050f05 50%, #020802 100%)',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        color: '#1aff1a',
        overflowX: 'hidden',
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(0,179,0,0.4)',
          background: 'rgba(2,8,2,0.9)',
          backdropFilter: 'blur(6px)',
          padding: '0 24px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '1.2rem', letterSpacing: '4px', textShadow: '0 0 10px rgba(26,255,26,0.6)' }}>
          NUTRA-3000
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            href="/auth/login"
            style={{
              color: '#00b300',
              fontSize: '0.85rem',
              letterSpacing: '2px',
              textDecoration: 'none',
            }}
          >
            ENTRAR
          </Link>
          <Link
            href="/auth/login"
            style={{
              border: '1px solid #1aff1a',
              color: '#1aff1a',
              padding: '6px 16px',
              fontSize: '0.85rem',
              letterSpacing: '2px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            [INICIAR]
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '60px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Vault Boy */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vaultboy.gif"
            alt="Vault Boy"
            style={{
              height: '160px',
              filter: 'sepia(1) hue-rotate(60deg) saturate(4) brightness(0.85)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '6px',
            color: '#00b300',
            marginBottom: '12px',
          }}
        >
          VAULT-TEC PRESENTS
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            letterSpacing: '8px',
            textShadow: '0 0 30px rgba(26,255,26,0.7), 0 0 60px rgba(26,255,26,0.3)',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          NUTRA 3000
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: '#00b300',
            letterSpacing: '2px',
            lineHeight: 1.8,
            marginBottom: '36px',
            maxWidth: '600px',
            margin: '0 auto 36px',
          }}
        >
          O SISTEMA DE GESTÃO NUTRICIONAL MAIS AVANÇADO DO VALE-TEC.
          MONITORE CALORIAS, MACROS E OBJETIVOS COM PRECISÃO TOTAL.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/auth/login"
            style={{
              border: '2px solid #1aff1a',
              color: '#1aff1a',
              padding: '14px 36px',
              fontSize: '1rem',
              letterSpacing: '3px',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(26,255,26,0.2)',
              display: 'inline-block',
            }}
          >
            [INICIAR SESSÃO]
          </Link>
          <a
            href="#features"
            style={{
              border: '1px solid #00b300',
              color: '#00b300',
              padding: '14px 36px',
              fontSize: '1rem',
              letterSpacing: '3px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            SAIBA MAIS &gt;
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '60px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            borderBottom: '1px solid rgba(0,179,0,0.4)',
            paddingBottom: '8px',
            marginBottom: '32px',
            letterSpacing: '4px',
            fontSize: '0.9rem',
            color: '#00b300',
          }}
        >
          &gt;&gt; MÓDULOS DISPONÍVEIS
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {features.map(f => (
            <div
              key={f.label}
              style={{
                border: '1px solid rgba(0,179,0,0.4)',
                background: 'rgba(0,30,0,0.4)',
                padding: '20px',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '0.95rem', letterSpacing: '2px', marginBottom: '6px' }}>{f.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#00b300', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: 'center',
          padding: '60px 24px 80px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ borderTop: '1px solid rgba(0,179,0,0.3)', maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
          <div style={{ fontSize: '0.8rem', color: '#00b300', letterSpacing: '3px', marginBottom: '16px' }}>
            PRONTO PARA INICIAR?
          </div>
          <Link
            href="/auth/login"
            style={{
              border: '2px solid #1aff1a',
              color: '#1aff1a',
              padding: '16px 48px',
              fontSize: '1.1rem',
              letterSpacing: '4px',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(26,255,26,0.2)',
              display: 'inline-block',
            }}
          >
            [ACESSAR NUTRA-3000]
          </Link>
          <p style={{ fontSize: '0.7rem', color: '#00b300', opacity: 0.5, marginTop: '20px', letterSpacing: '1px' }}>
            VAULT-TEC • GESTÃO NUTRICIONAL • TODOS OS DIREITOS RESERVADOS
          </p>
        </div>
      </section>
    </div>
  );
}
