/**
 * @fileoverview Componente de cabeçalho.
 * 
 * Exibe informações do usuário, notificações e ações rápidas.
 */

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  /** Título da página atual */
  title?: string;
  /** Subtítulo/descrição */
  subtitle?: string;
  /** Callback para toggle do menu mobile */
  onMenuToggle?: () => void;
  /** Classes adicionais */
  className?: string;
}

/**
 * Componente de header.
 */
export function Header({ title, subtitle, onMenuToggle, className }: HeaderProps) {
  const { data: session } = useSession();

  const userName = session?.user?.name ?? 'Usuário';
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b theme-transition',
        'bg-header-background border-header-border',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        {/* Lado esquerdo - Menu mobile + Título */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Toggle menu mobile */}
          <button
            onClick={onMenuToggle}
            className={cn(
              'p-2 rounded-lg md:hidden flex-shrink-0',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-sidebar-hover transition-colors'
            )}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Título da página */}
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="text-lg sm:text-xl font-semibold text-text-primary truncate">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-text-muted truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Busca rápida */}
          <Link
            href="/busca"
            className={cn(
              'p-2 rounded-lg hidden sm:flex',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-sidebar-hover transition-colors'
            )}
            aria-label="Buscar alimentos"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Toggle de tema */}
          <ThemeToggle showDropdown />

          {/* Notificações */}
          <button
            className={cn(
              'relative p-2 rounded-lg',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-sidebar-hover transition-colors'
            )}
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            {/* Badge de notificação */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* Perfil do usuário */}
          <Link
            href="/perfil"
            className={cn(
              'flex items-center gap-2 sm:gap-3 p-1 rounded-lg',
              'hover:bg-sidebar-hover transition-colors'
            )}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            ) : (
              <div className={cn(
                'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-medium',
                'bg-primary-background text-primary'
              )}>
                {userInitial}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-text-primary">{userName}</p>
              <p className="text-xs text-text-muted">
                {session?.user?.roles?.includes('Nutricionista')
                  ? 'Nutricionista'
                  : 'Paciente'}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
