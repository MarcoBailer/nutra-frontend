/**
 * @fileoverview Componente de alerta/notificação.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual do alerta */
  variant?: AlertVariant;
  /** Título do alerta */
  title?: string;
  /** Callback ao fechar (se omitido, não mostra botão de fechar) */
  onClose?: () => void;
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-info-background border-accent text-info',
  success: 'bg-success-background border-success text-success',
  warning: 'bg-warning-background border-warning text-warning',
  error: 'bg-error-background border-error text-error',
};

const iconMap: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

/**
 * Componente de alerta para feedback ao usuário.
 * 
 * @example
 * ```tsx
 * <Alert variant="success" title="Sucesso!">
 *   Seus dados foram salvos com sucesso.
 * </Alert>
 * 
 * <Alert variant="error" onClose={() => setError(null)}>
 *   Ocorreu um erro ao processar sua solicitação.
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, onClose, className, children, ...props }, ref) => {
    const Icon = iconMap[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 p-4 rounded-lg border',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && (
            <h5 className="font-semibold mb-1">{title}</h5>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
            aria-label="Fechar alerta"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
