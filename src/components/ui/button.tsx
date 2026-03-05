/**
 * @fileoverview Componente de botão reutilizável.
 * 
 * Suporta diferentes variantes e tamanhos para uso em toda a aplicação.
 * Use getButtonStyles() para estilizar Links como botões.
 */

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Variantes visuais do botão.
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Tamanhos disponíveis.
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props do botão.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
  /** Mostrar estado de loading */
  isLoading?: boolean;
  /** Ocupar toda a largura do container */
  fullWidth?: boolean;
  /** Conteúdo do botão */
  children?: ReactNode;
}

/**
 * Estilos base do botão.
 */
const baseStyles = `
  inline-flex items-center justify-center
  font-medium rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  theme-transition
`;

/**
 * Estilos por variante.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-primary-foreground
    hover:bg-primary-dark
    focus:ring-primary
  `,
  secondary: `
    bg-secondary text-secondary-foreground
    hover:opacity-90
    focus:ring-secondary
  `,
  outline: `
    border-2 border-primary text-primary
    hover:bg-primary-background
    focus:ring-primary
  `,
  ghost: `
    text-text-secondary
    hover:bg-sidebar-hover hover:text-text-primary
    focus:ring-primary
  `,
  danger: `
    bg-error text-white
    hover:opacity-90
    focus:ring-error
  `,
};

/**
 * Estilos por tamanho.
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

/**
 * Função que retorna as classes do botão.
 * Útil para estilizar Links como botões.
 */
export function getButtonStyles(options: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}): string {
  const { variant = 'primary', size = 'md', fullWidth = false, className } = options;
  return cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );
}

/**
 * Componente de botão reutilizável.
 * 
 * @example
 * ```tsx
 * // Botão primário
 * <Button variant="primary" onClick={handleClick}>
 *   Salvar
 * </Button>
 * 
 * // Botão de outline
 * <Button variant="outline">
 *   Cancelar
 * </Button>
 * 
 * // Estado de loading
 * <Button isLoading>
 *   Carregando...
 * </Button>
 * 
 * // Para Links, use getButtonStyles():
 * <Link href="/dashboard" className={getButtonStyles({ variant: 'outline' })}>
 *   Ir para Dashboard
 * </Link>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonComponent(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
