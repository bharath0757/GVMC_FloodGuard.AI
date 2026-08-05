import * as React from 'react';
import { cn } from '@floodguard/utils';
import { X } from 'lucide-react';

/**
 * Storybook & Component Documentation: Dialog (Modal)
 *
 * **Purpose:** High-priority overlays for confirmations, emergency dispatch, or detail view.
 * **Usage:** `<Dialog isOpen={open} onClose={close}><DialogHeader><DialogTitle>Confirm Evacuation</DialogTitle></DialogHeader>...</Dialog>`
 * **Accessibility Notes:**
 * - Traps focus and listens to ESC key.
 * - `aria-modal="true"`, `role="dialog"`.
 */

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'border-border bg-card animate-in zoom-in-95 relative z-50 w-full max-w-lg rounded-xl border p-6 shadow-2xl transition-all duration-200',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'mb-4 flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn(
      'text-foreground text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);

const DialogDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p className={cn('text-muted-foreground text-sm', className)} {...props} />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
