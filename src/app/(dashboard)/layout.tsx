'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bebas_Neue } from 'next/font/google';
import { quickMealService } from '@/services';
import { StatusDiarioDto } from '@/types/api';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface DashboardLayoutProps {
  children: ReactNode;
}

/** Tabs de navegação Pip-Boy */
const NAV_TABS = [
  { label: 'STATUS',      href: '/dashboard' },
  { label: 'DIETA',       href: '/diario' },
  { label: 'INVENTÁRIO',  href: '/busca' },
  { label: 'PLANO',       href: '/plano' },
  { label: 'CORPO',       href: '/avaliacoes' },
  { label: 'PERFIL',      href: '/perfil' },
] as const;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dailyStatus, setDailyStatus] = useState<StatusDiarioDto | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const userName = session?.user?.name?.split(' ')[0]?.toUpperCase() ?? 'VAULT-TEC';

  useEffect(() => {
    setMounted(true);
    quickMealService.getDailyStatus()
      .then(setDailyStatus)
      .catch(() => null);
  }, [pathname]); // refetch on route change

  const kcalConsumed = dailyStatus?.caloriasConsumidas ?? 0;
  const kcalTarget   = dailyStatus?.caloriasAlvo ?? 2000;
  const aguaConsumed = dailyStatus?.aguaConsumidaL ?? 0;
  const aguaTarget   = dailyStatus?.aguaAlvoL ?? 3;
  const kcalPct      = Math.min((kcalConsumed / kcalTarget) * 100, 100);
  const aguaPct      = Math.min((aguaConsumed / aguaTarget) * 100, 100);

  const activeTab = NAV_TABS.find(t =>
    pathname === t.href || pathname.startsWith(t.href + '/')
  );

  return (
    <div className={`pip-wrapper ${bebasNeue.className} min-h-screen flex items-center justify-center p-2 sm:p-4`}>
      {/* FRAME DO PIP-BOY */}
      <div
        className="w-full max-w-5xl flex flex-col"
        style={{
          height: 'calc(100vh - 16px)',
          background: '#1c1c1c',
          border: '4px solid #2a2a2a',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5)',
          padding: '16px',
        }}
      >
        {/* TELA CRT */}
        <div
          className="pip-screen flex flex-col flex-1"
          style={{ borderRadius: '12px' }}
        >
          {/* Scanlines overlay */}
          <div className="pip-scanlines" style={{ borderRadius: '12px' }} />

          {/* CONTEÚDO (acima do overlay) */}
          <div className="flex flex-col flex-1 relative z-10 pip-flicker" style={{ overflow: 'hidden' }}>

            {/* ── HEADER ─────────────────────────────────── */}
            <header
              style={{
                borderBottom: '2px solid var(--pip-green)',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexShrink: 0,
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {/* Logo + Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <span className="pip-glow" style={{ fontSize: '1.6rem', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                  NUTRA 3000
                </span>

                {/* Desktop nav */}
                <nav style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }} className="hidden sm:flex">
                  {NAV_TABS.map(({ label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                      <Link
                        key={href}
                        href={href}
                        style={{
                          padding: '4px 10px',
                          fontSize: '1rem',
                          opacity: isActive ? 1 : 0.5,
                          fontWeight: isActive ? 'bold' : 'normal',
                          textDecoration: 'none',
                          color: 'var(--pip-green)',
                          textShadow: isActive ? 'var(--pip-glow)' : 'none',
                          transition: 'opacity 0.15s',
                          borderBottom: isActive ? '2px solid var(--pip-green)' : '2px solid transparent',
                        }}
                      >
                        {isActive ? `[${label}]` : label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile hamburger tab */}
                <button
                  className="sm:hidden pip-btn"
                  style={{ fontSize: '0.85rem', padding: '4px 10px' }}
                  onClick={() => setMobileNavOpen(v => !v)}
                >
                  {activeTab ? `[${activeTab.label}]` : 'MENU'} ▼
                </button>
              </div>

              {/* User + Exit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  USER: {userName}
                </span>
                <button
                  className="pip-btn"
                  style={{ fontSize: '0.85rem', padding: '4px 12px' }}
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                  SAIR &gt;
                </button>
              </div>
            </header>

            {/* Mobile dropdown nav */}
            {mobileNavOpen && (
              <div
                className="sm:hidden"
                style={{
                  borderBottom: '1px solid var(--pip-dim)',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '8px 16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {NAV_TABS.map(({ label, href }) => {
                  const isActive = pathname === href || pathname.startsWith(href + '/');
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileNavOpen(false)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.9rem',
                        color: 'var(--pip-green)',
                        textDecoration: 'none',
                        opacity: isActive ? 1 : 0.55,
                        textShadow: isActive ? 'var(--pip-glow-sm)' : 'none',
                        border: isActive ? '1px solid var(--pip-green)' : '1px solid transparent',
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── MAIN CONTENT ─────────────────────────── */}
            <main
              className="pip-scroll flex-1"
              style={{ padding: '16px 18px', overflow: 'hidden auto' }}
            >
              {children}
            </main>

            {/* ── FOOTER STATUS BARS ─────────────────── */}
            <footer
              style={{
                borderTop: '2px solid rgba(0,179,0,0.5)',
                padding: '10px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              {/* HP (Calorias) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="pip-glow"
                  style={{ width: '80px', textAlign: 'right', fontSize: '1rem', flexShrink: 0 }}
                >
                  HP (KCAL)
                </span>
                <div className="pip-bar">
                  <div
                    className="pip-bar-fill"
                    style={{ width: mounted ? `${kcalPct}%` : '0%' }}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', minWidth: '120px', opacity: 0.85 }}>
                  {kcalConsumed.toFixed(0)} / {kcalTarget.toFixed(0)}
                </span>
              </div>

              {/* AP (Água) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="pip-glow-amber"
                  style={{
                    width: '80px', textAlign: 'right', fontSize: '1rem', flexShrink: 0,
                    color: 'var(--pip-amber)',
                  }}
                >
                  AP (H2O)
                </span>
                <div className="pip-bar">
                  <div
                    className="pip-bar-fill-amber"
                    style={{ width: mounted ? `${aguaPct}%` : '0%' }}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', minWidth: '120px', opacity: 0.85, color: 'var(--pip-amber)' }}>
                  {aguaConsumed.toFixed(1)}L / {aguaTarget.toFixed(1)}L
                </span>
              </div>
            </footer>
          </div>
        </div>

        {/* Bolts do frame */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px 0', opacity: 0.4 }}>
          {['◉', '◉', '◉', '◉'].map((b, i) => (
            <span key={i} style={{ fontSize: '0.7rem', color: '#555' }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
