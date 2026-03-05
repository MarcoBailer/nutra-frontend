/**
 * @fileoverview Layout para páginas autenticadas (dashboard).
 * 
 * Este layout inclui:
 * - Sidebar de navegação
 * - Header com informações do usuário
 * - Área de conteúdo principal
 * 
 * Usado por todas as páginas que requerem autenticação.
 */

'use client';

import { ReactNode, useState } from 'react';
import { Sidebar, Header } from '@/components/layout';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background-secondary">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'var(--overlay)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <div className="container-responsive animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
