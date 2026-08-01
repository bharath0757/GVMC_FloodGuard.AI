import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@floodguard/utils';

/**
 * Storybook & Component Documentation: Spinner
 * 
 * **Purpose:** Accessible animated loading spinner.
 * **Variants:** sm (16px), md (24px), lg (32px), xl (48px).
 * **Usage:** `<Spinner size="lg" variant="primary" label="Fetching live flood risk..." />`
 * **Accessibility Notes:** `role="status"`, `aria-label` screen reader announcement.
 */

const spinnerVariants = cva('animate-spin rounded-full border-solid border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-3',
      xl: 'h-12 w-12 border-4',
    },
    variant: {
      default: 'border-current',
      primary: 'border-primary border-t-transparent',
      secondary: 'border-secondary border-t-transparent',
      danger: 'border-red-500 border-t-transparent',
      white: 'border-white border-t-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => {
    return (
      <div ref={ref} role="status" className="inline-flex items-center justify-center" {...props}>
        <div className={cn(spinnerVariants({ size, variant, className }))} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
