import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@floodguard/utils';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

/**
 * Storybook & Component Documentation: Alert & AlertTitle & AlertDescription
 *
 * **Purpose:** System notifications, warnings, and emergency flood broadcast callouts.
 * **Variants:** info, success, warning, danger, emergency.
 * **Usage:** `<Alert variant="emergency"><AlertTitle>Flash Flood Warning</AlertTitle><AlertDescription>Evacuate to elevated shelters immediately.</AlertDescription></Alert>`
 * **Accessibility Notes:** Uses `role="alert"` or `role="status"` with appropriate `aria-live` regions.
 */

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        info: 'bg-blue-500/10 text-blue-900 dark:text-blue-200 border-blue-500/30 [&>svg]:text-blue-500',
        success:
          'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-emerald-500/30 [&>svg]:text-emerald-500',
        warning:
          'bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/30 [&>svg]:text-amber-500',
        danger:
          'bg-red-500/10 text-red-900 dark:text-red-200 border-red-500/30 [&>svg]:text-red-500',
        emergency:
          'bg-red-600 text-white border-red-700 font-medium shadow-lg [&>svg]:text-white animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const defaultIcons = {
  default: <Info className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  danger: <AlertCircle className="h-4 w-4" />,
  emergency: <AlertTriangle className="h-5 w-5" />,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = 'default', icon, onDismiss, children, ...props },
    ref,
  ) => {
    const selectedIcon = icon || defaultIcons[variant || 'default'];
    return (
      <div
        ref={ref}
        role={
          variant === 'emergency' || variant === 'danger' ? 'alert' : 'status'
        }
        aria-live={variant === 'emergency' ? 'assertive' : 'polite'}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {selectedIcon}
        <div className="flex-1">{children}</div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
