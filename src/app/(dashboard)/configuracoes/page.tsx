'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function ConfiguracoesPage() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(d => !d);
    document.documentElement.classList.toggle('light-mode');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        &gt;&gt; CONFIGURAÇÕES DO SISTEMA
      </div>

      {/* Tema */}
      <div className="pip-card">
        <div className="pip-card-title">MODO DE EXIBIÇÃO</div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            className={`pip-btn ${isDark ? 'pip-btn-filled' : ''}`}
            style={{ padding: '6px 20px', fontSize: '0.85rem' }}
            onClick={toggleTheme}
          >
            {isDark ? '[ESCURO]' : '[CLARO]'}
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="pip-card">
        <div className="pip-card-title">ACESSO RÁPIDO</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
          {[
            { label: 'PERFIL DO AGENTE', href: '/perfil' },
            { label: 'AVALIAÇOES CORPORAIS', href: '/avaliacoes' },
            { label: 'PLANOS ALIMENTARES', href: '/plano' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="pip-row"
              style={{ textDecoration: 'none', fontSize: '0.9rem' }}
            >
              <span className="pip-row-label">{link.label}</span>
              <div className="pip-dots" />
              <span className="pip-row-value">&gt;</span>
            </a>
          ))}
        </div>
      </div>

      {/* Sessão */}
      <div className="pip-card">
        <div className="pip-card-title" style={{ color: 'var(--pip-red)' }}>ZONA DE PERIGO</div>
        <div style={{ marginTop: '10px' }}>
          {!confirmLogout ? (
            <button
              className="pip-btn pip-btn-danger"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              onClick={() => setConfirmLogout(true)}
            >
              [ENCERRAR SESSÃO]
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>CONFIRMAR LOGOUT?</span>
              <button
                className="pip-btn pip-btn-danger"
                style={{ padding: '6px 16px' }}
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
              >
                SIM
              </button>
              <button
                className="pip-btn"
                style={{ padding: '6px 16px' }}
                onClick={() => setConfirmLogout(false)}
              >
                NÃO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
