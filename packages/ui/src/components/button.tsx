import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@floodguard/utils';
import { Spinner } from './spinner';

/**
 * Storybook & Component Documentation: Button
 * 
 * **Purpose:** Primary action trigger across FloodGuard AI interfaces.
 * **Variants:** primary, secondary, outline, ghost, danger, safe, warning, link.
 * **Sizes:** sm (36px), default (40px), lg (48px - optimal for emergency touch targets), icon.
 * **Usage:** `<Button variant="danger" isLoading={isSubmitting}>Dispatch Emergency Team</Button>`
 * **Accessibility Notes:** 
 * - Includes focus visible rings for keyboard navigation.
 * - Supports loading states with `aria-busy` and `disabled`.
 * - Minimum 44x44px target on mobile viewports for stress-free interaction under emergency duress.
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none min-h-[44px] sm:min-h-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm active:scale-[0.98]',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-danger text-danger-foreground hover:bg-danger/90 shadow-sm active:scale-[0.98]',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm active:scale-[0.98]',
        safe: 'bg-safe text-safe-foreground hover:bg-safe/90 shadow-sm active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline min-h-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base font-semibold',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="mr-2" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
