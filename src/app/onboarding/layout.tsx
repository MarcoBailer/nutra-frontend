'use client';

import { ReactNode } from 'react';
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${bebasNeue.className} min-h-screen flex items-center justify-center p-2 sm:p-4`}
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="w-full max-w-2xl flex flex-col"
        style={{
          background: '#1c1c1c',
          border: '4px solid #2a2a2a',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5)',
          padding: '16px',
          minHeight: 'calc(100vh - 32px)',
        }}
      >
        <div
          className="pip-screen flex flex-col flex-1"
          style={{ borderRadius: '12px', padding: '20px' }}
        >
          <div className="pip-scanlines" style={{ borderRadius: '12px' }} />
          <div className="flex flex-col flex-1 relative z-10 pip-flicker" style={{ overflow: 'hidden' }}>
            <header
              style={{
                borderBottom: '2px solid var(--pip-green)',
                paddingBottom: '10px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="pip-glow" style={{ fontSize: '1.4rem', letterSpacing: '0.1em' }}>
                NUTRA 3000
              </span>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>CONFIGURAÇÃO INICIAL</span>
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
