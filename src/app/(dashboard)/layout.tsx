'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bebas_Neue } from 'next/font/google';
import { Menu, X } from 'lucide-react';
import { quickMealService, userProfileService, nutritionistService } from '@/services';
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
  const router = useRouter();
  const { data: session } = useSession();
  const [dailyStatus, setDailyStatus] = useState<StatusDiarioDto | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const userName = session?.user?.name?.split(' ')[0]?.toUpperCase() ?? 'VAULT-TEC';

  // Verificação de perfil: redireciona para onboarding se o perfil obrigatório não existir
  useEffect(() => {
    if (!session) return;

    const roles = (session as { user?: { roles?: string[] } }).user?.roles ?? [];
    const isPaciente = roles.includes('Paciente') || (!roles.includes('Nutricionista') && !roles.includes('Admin'));
    const isNutricionista = roles.includes('Nutricionista');

    if (isPaciente) {
      userProfileService.getProfile().then(profile => {
        if (!profile) router.replace('/onboarding/perfil');
      }).catch(() => null);
    } else if (isNutricionista) {
      nutritionistService.getProfile().then(profile => {
        if (!profile) router.replace('/onboarding/nutricionista');
      }).catch(() => {
        router.replace('/onboarding/nutricionista');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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

  return (
    <div className={`pip-wrapper ${bebasNeue.className} min-h-screen p-2 sm:p-4`}>
      <div
        className="w-full max-w-6xl mx-auto flex flex-col"
        style={{
          height: 'calc(100vh - 16px)',
          border: '1px solid rgba(135,255,188,0.22)',
          borderRadius: '22px',
          background: 'rgba(6, 19, 13, 0.75)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(135,255,188,0.08)',
          padding: '10px',
        }}
      >
        <div className="pip-screen flex flex-col flex-1" style={{ borderRadius: '14px' }}>
          <div className="pip-scanlines" style={{ borderRadius: '14px' }} />

          <div className="flex flex-col flex-1 relative z-10 pip-flicker" style={{ overflow: 'hidden' }}>
            <header
              style={{
                borderBottom: '1px solid rgba(133, 255, 186, 0.25)',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexShrink: 0,
              }}
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <button
                  className="md:hidden pip-btn"
                  style={{ padding: '7px 10px' }}
                  onClick={() => setMobileNavOpen(v => !v)}
                  aria-label="Abrir navegacao"
                >
                  {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                <span className="pip-glow text-sm sm:text-base md:text-lg tracking-[0.18em] whitespace-nowrap">
                  NUTRA 3000
                </span>

                <nav className="hidden md:flex items-center gap-2 overflow-x-auto">
                  {NAV_TABS.map(({ label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`pip-btn ${isActive ? 'pip-btn-filled' : ''}`}
                        style={{ textDecoration: 'none', padding: '6px 11px' }}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:block text-xs opacity-75 tracking-widest">
                  USER: {userName}
                </span>
                <button
                  className="pip-btn"
                  style={{ padding: '7px 12px' }}
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                  SAIR
                </button>
              </div>
            </header>

            {mobileNavOpen && (
              <div
                className="md:hidden"
                style={{
                  borderBottom: '1px solid rgba(133, 255, 186, 0.2)',
                  background: 'rgba(3, 14, 9, 0.9)',
                  padding: '10px 12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      className={`pip-btn ${isActive ? 'pip-btn-filled' : ''}`}
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}

            <main className="pip-scroll flex-1" style={{ padding: '14px 16px', overflow: 'hidden auto' }}>
              {children}
            </main>

            <footer
              style={{
                borderTop: '1px solid rgba(133, 255, 186, 0.2)',
                padding: '10px 12px',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="pip-glow" style={{ width: '76px', textAlign: 'right', fontSize: '0.85rem', flexShrink: 0 }}>
                  HP KCAL
                </span>
                <div className="pip-bar">
                  <div className="pip-bar-fill" style={{ width: mounted ? `${kcalPct}%` : '0%' }} />
                </div>
                <span style={{ fontSize: '0.8rem', minWidth: '90px', opacity: 0.82 }}>
                  {kcalConsumed.toFixed(0)} / {kcalTarget.toFixed(0)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="pip-glow-amber"
                  style={{ width: '76px', textAlign: 'right', fontSize: '0.85rem', flexShrink: 0, color: 'var(--pip-amber)' }}
                >
                  AP H2O
                </span>
                <div className="pip-bar">
                  <div className="pip-bar-fill-amber" style={{ width: mounted ? `${aguaPct}%` : '0%' }} />
                </div>
                <span style={{ fontSize: '0.8rem', minWidth: '90px', opacity: 0.82, color: 'var(--pip-amber)' }}>
                  {aguaConsumed.toFixed(1)}L / {aguaTarget.toFixed(1)}L
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
