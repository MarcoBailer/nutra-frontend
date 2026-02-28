/**
 * @fileoverview Funções utilitárias para classes CSS.
 * 
 * Combina clsx para condicionais e tailwind-merge para resolver conflitos.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS de forma inteligente.
 * Resolve conflitos do Tailwind automaticamente.
 * 
 * @example
 * ```tsx
 * // Combina classes condicionalmente
 * <div className={cn('p-4', isActive && 'bg-blue-500', className)} />
 * 
 * // Resolve conflitos (p-4 é sobrescrito por p-2)
 * cn('p-4', 'p-2') // retorna 'p-2'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
