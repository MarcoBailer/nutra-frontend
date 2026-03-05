/**
 * @fileoverview Componentes de loading/spinner.
 */

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Tamanho do spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Cor do spinner */
  color?: 'emerald' | 'white' | 'slate';
  /** Classes adicionais */
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorStyles = {
  emerald: 'text-primary',
  white: 'text-white',
  slate: 'text-text-secondary',
};

/**
 * Spinner de loading animado.
 */
export function LoadingSpinner({
  size = 'md',
  color = 'emerald',
  className,
}: LoadingSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', sizeStyles[size], colorStyles[color], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  /** Mensagem a exibir */
  message?: string;
}

/**
 * Overlay de loading de tela cheia.
 */
export function LoadingOverlay({ message = 'Carregando...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'var(--overlay)' }}>
      <div className="bg-card rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 shadow-xl">
        <LoadingSpinner size="xl" />
        <p className="text-text-primary font-medium text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
}

interface PageLoadingProps {
  /** Mensagem a exibir */
  message?: string;
}

/**
 * Componente de loading para páginas.
 */
export function PageLoading({ message = 'Carregando...' }: PageLoadingProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="xl" />
      <p className="text-slate-600">{message}</p>
    </div>
  );
}

interface SkeletonProps {
  /** Classes adicionais */
  className?: string;
}

/**
 * Skeleton para loading de conteúdo.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-slate-200 rounded animate-pulse',
        className
      )}
    />
  );
}
