/**
 * @fileoverview Componente de navegação lateral (Sidebar).
 * 
 * Exibe os links de navegação principais da aplicação.
 * Usa o hook useSession() para mostrar opções baseadas em permissões.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  Home,
  Utensils,
  CalendarDays,
  ClipboardList,
  Activity,
  User,
  Settings,
  Search,
  LogOut,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Item de navegação.
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Roles permitidas (vazio = todos) */
  roles?: string[];
}

/**
 * Itens de navegação principal.
 */
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Buscar Alimentos', href: '/busca', icon: Search },
  { label: 'Plano Alimentar', href: '/plano', icon: Utensils },
  { label: 'Diário Alimentar', href: '/diario', icon: CalendarDays },
  { label: 'Avaliações', href: '/avaliacoes', icon: ClipboardList },
  { label: 'Progresso', href: '/progresso', icon: Activity },
];

/**
 * Itens de navegação para nutricionistas.
 */
const nutritionistNavItems: NavItem[] = [
  { label: 'Meus Pacientes', href: '/pacientes', icon: Users, roles: ['Nutricionista', 'Admin'] },
  { label: 'Clínicas', href: '/clinicas', icon: Building2, roles: ['Nutricionista', 'Admin'] },
];

/**
 * Itens de navegação do usuário.
 */
const userNavItems: NavItem[] = [
  { label: 'Meu Perfil', href: '/perfil', icon: User },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

/**
 * Props do Sidebar.
 */
interface SidebarProps {
  className?: string;
}

/**
 * Componente de sidebar.
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const userRoles = session?.user?.roles ?? [];

  /**
   * Verifica se o usuário tem permissão para ver o item.
   */
  const hasAccess = (item: NavItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((role) => userRoles.includes(role));
  };

  /**
   * Renderiza um link de navegação.
   */
  const renderNavLink = (item: NavItem) => {
    if (!hasAccess(item)) return null;

    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-sidebar-hover hover:text-primary',
          isActive
            ? 'bg-sidebar-active text-sidebar-active-foreground font-medium'
            : 'text-sidebar-foreground',
          collapsed && 'justify-center'
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col theme-transition',
        'bg-sidebar-background border-r border-sidebar-border',
        'transition-all duration-300',
        collapsed ? 'w-16' : 'w-60 lg:w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="p-3 lg:p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 lg:gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center flex-shrink-0">
            <Utensils className="h-4 w-4 lg:h-5 lg:w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg lg:text-xl text-text-primary">Nutra</span>
          )}
        </Link>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto">
        <p className={cn(
          'text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2',
          collapsed && 'hidden'
        )}>
          Menu
        </p>
        {mainNavItems.map(renderNavLink)}

        {/* Seção nutricionista */}
        {nutritionistNavItems.some(hasAccess) && (
          <>
            <div className="my-3 lg:my-4 border-t border-border-light" />
            <p className={cn(
              'text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2',
              collapsed && 'hidden'
            )}>
              Profissional
            </p>
            {nutritionistNavItems.map(renderNavLink)}
          </>
        )}

        {/* Seção do usuário */}
        <div className="my-3 lg:my-4 border-t border-border-light" />
        <p className={cn(
          'text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2',
          collapsed && 'hidden'
        )}>
          Conta
        </p>
        {userNavItems.map(renderNavLink)}

        {/* Logout */}
        <Link
          href="/auth/logout"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            'text-sidebar-foreground hover:bg-error-background hover:text-error',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </nav>

      {/* Toggle collapse - hidden on mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'p-3 border-t border-sidebar-border hidden md:flex items-center justify-center',
          'text-text-muted hover:text-text-primary hover:bg-sidebar-hover transition-colors'
        )}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
