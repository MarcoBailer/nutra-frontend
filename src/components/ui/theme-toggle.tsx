/**
 * @fileoverview Componente de toggle de tema (dark/light mode).
 * 
 * Botão para alternar entre modos claro e escuro.
 */

'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ThemeToggleProps {
  /** Mostrar dropdown com opções */
  showDropdown?: boolean;
  /** Classes adicionais */
  className?: string;
}

/**
 * Botão para alternar tema.
 */
export function ThemeToggle({ showDropdown = false, className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Icon = resolvedTheme === 'dark' ? Moon : Sun;

  // Modo simples: só toggle
  if (!showDropdown) {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-sidebar-hover',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          className
        )}
        aria-label={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  // Modo com dropdown
  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-sidebar-hover',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        )}
        aria-label="Selecionar tema"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-40 py-1 rounded-lg shadow-lg',
            'bg-card border border-card-border',
            'animate-fade-in z-50'
          )}
          role="menu"
        >
          <button
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-2 text-sm',
              'hover:bg-sidebar-hover transition-colors',
              theme === 'light' ? 'text-primary font-medium' : 'text-text-secondary'
            )}
            role="menuitem"
          >
            <Sun className="h-4 w-4" />
            Claro
          </button>
          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-2 text-sm',
              'hover:bg-sidebar-hover transition-colors',
              theme === 'dark' ? 'text-primary font-medium' : 'text-text-secondary'
            )}
            role="menuitem"
          >
            <Moon className="h-4 w-4" />
            Escuro
          </button>
          <button
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-2 text-sm',
              'hover:bg-sidebar-hover transition-colors',
              theme === 'system' ? 'text-primary font-medium' : 'text-text-secondary'
            )}
            role="menuitem"
          >
            <Monitor className="h-4 w-4" />
            Sistema
          </button>
        </div>
      )}
    </div>
  );
}
