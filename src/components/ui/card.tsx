/**
 * @fileoverview Componente de card reutilizável.
 * 
 * Container para agrupar conteúdo relacionado com visual consistente.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adicionar padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Variante visual */
  variant?: 'default' | 'elevated' | 'outlined';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantStyles = {
  default: 'bg-card shadow-sm theme-transition',
  elevated: 'bg-card shadow-lg theme-transition',
  outlined: 'bg-card border border-card-border theme-transition',
};

/**
 * Componente de card.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = 'md', variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          paddingStyles[padding],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Cabeçalho do card.
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 pb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Título do card.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base sm:text-lg font-semibold text-card-foreground', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * Descrição do card.
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs sm:text-sm text-text-muted', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

/**
 * Conteúdo do card.
 */
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

/**
 * Rodapé do card.
 */
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-3 sm:pt-4 border-t border-border-light', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
