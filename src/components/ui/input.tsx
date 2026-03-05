/**
 * @fileoverview Componente de input reutilizável.
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label do campo */
  label?: string;
  /** Mensagem de erro */
  error?: string;
  /** Mensagem de ajuda */
  helperText?: string;
}

/**
 * Componente de input.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="E-mail"
 *   type="email"
 *   placeholder="seu@email.com"
 *   error={errors.email}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border theme-transition',
            'text-text-primary bg-input-background',
            'placeholder-text-muted',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-error focus:ring-error focus:border-error'
              : 'border-input-border focus:ring-primary focus:border-primary',
            'disabled:bg-background-tertiary disabled:cursor-not-allowed disabled:text-text-disabled',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs sm:text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs sm:text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
