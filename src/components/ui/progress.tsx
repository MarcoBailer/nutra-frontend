/**
 * @fileoverview Componente de barra de progresso.
 */

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  /** Valor atual (0-100 ou valor absoluto se max fornecido) */
  value: number;
  /** Valor máximo (default: 100) */
  max?: number;
  /** Cor da barra */
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
  /** Tamanho da barra */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar label com percentual */
  showLabel?: boolean;
  /** Label customizada */
  label?: string;
  /** Classes adicionais */
  className?: string;
}

const colorStyles = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

/**
 * Barra de progresso para visualização de métricas.
 * 
 * @example
 * ```tsx
 * <ProgressBar value={1400} max={2000} color="emerald" showLabel />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  color = 'emerald',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const displayLabel = label ?? `${Math.round(percentage)}%`;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs sm:text-sm font-medium text-text-primary">{displayLabel}</span>
          <span className="text-xs sm:text-sm text-text-secondary">
            {value.toLocaleString('pt-BR')} / {max.toLocaleString('pt-BR')}
          </span>
        </div>
      )}
      <div className={cn('w-full bg-background-tertiary rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface MacroProgressProps {
  /** Label do macro */
  label: string;
  /** Valor atual */
  current: number;
  /** Meta/alvo */
  target: number;
  /** Unidade (g, kcal, L) */
  unit: string;
  /** Cor da barra */
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
}

/**
 * Componente especializado para exibir progresso de macronutrientes.
 */
export function MacroProgress({ label, current, target, unit, color = 'emerald' }: MacroProgressProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const overTarget = percentage > 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs sm:text-sm font-medium text-text-secondary">{label}</span>
        <span className={cn(
          'text-xs sm:text-sm font-medium',
          overTarget ? 'text-error' : 'text-text-primary'
        )}>
          {current.toFixed(0)}{unit} / {target.toFixed(0)}{unit}
        </span>
      </div>
      <ProgressBar
        value={current}
        max={target}
        color={overTarget ? 'red' : color}
        size="sm"
      />
      <div className="text-right">
        <span className={cn(
          'text-xs',
          overTarget ? 'text-error' : 'text-text-muted'
        )}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
