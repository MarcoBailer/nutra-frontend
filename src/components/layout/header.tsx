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
        'sticky top-0 z-40 bg-white border-b border-slate-200',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Lado esquerdo - Menu mobile + Título */}
        <div className="flex items-center gap-4">
          {/* Toggle menu mobile */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Título da página */}
          <div>
            {title && (
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-2">
          {/* Busca rápida */}
          <Link
            href="/busca"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hidden sm:flex"
            aria-label="Buscar alimentos"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Notificações */}
          <button
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            {/* Badge de notificação */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Perfil do usuário */}
          <Link
            href="/perfil"
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100"
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-medium">
                {userInitial}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">
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
