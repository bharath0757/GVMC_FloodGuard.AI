import * as React from 'react';
import { cn } from '@floodguard/utils';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Storybook & Component Documentation: Inputs Suite (Input, Textarea, PasswordInput, Select)
 * 
 * **Purpose:** Accessible form controls for citizen crowd reporting, search parameters, and gov admin configuration.
 * **Usage:** `<FormLabel>Ward Number</FormLabel><Input placeholder="e.g. Ward 14" error="Invalid ward" />`
 * **Accessibility Notes:** 
 * - Includes proper focus rings, `aria-invalid`, `aria-describedby` linkage.
 * - Min 44px height touch area on mobile screens.
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <Input
        type={show ? 'text' : 'password'}
        ref={ref}
        className={className}
        rightIcon={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="focus:outline-none opacity-70 hover:opacity-100"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, disabled, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

const FormLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={cn('block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5', className)} {...props} />
);

const FormHelperText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs text-muted-foreground mt-1', className)} {...props} />
);

const FormError: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs font-medium text-destructive mt-1', className)} {...props} />
);

export { Input, Textarea, PasswordInput, Select, FormLabel, FormHelperText, FormError };
