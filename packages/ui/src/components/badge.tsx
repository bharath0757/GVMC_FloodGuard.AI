import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@floodguard/utils';

/**
 * Storybook & Component Documentation: Badge & RiskBadge
 *
 * **Purpose:** Status pill indicators and risk category callouts.
 * **Variants:** default, secondary, outline, destructive, warning, safe, risk_very_low, risk_low, risk_medium, risk_high, risk_critical.
 * **Usage:** `<Badge variant="risk_critical">CRITICAL RISK (92/100)</Badge>`
 * **Accessibility Notes:** Uses high-contrast background and clear text.
 */

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'text-foreground border-border',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        warning: 'border-transparent bg-warning text-warning-foreground',
        safe: 'border-transparent bg-safe text-safe-foreground',
        risk_very_low:
          'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        risk_low:
          'border-lime-500/30 bg-lime-500/15 text-lime-600 dark:text-lime-400',
        risk_medium:
          'border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400',
        risk_high:
          'border-orange-500/30 bg-orange-500/15 text-orange-600 dark:text-orange-400',
        risk_critical:
          'border-red-500/40 bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
