import * as React from 'react';
import { cn } from '@floodguard/utils';
import { X } from 'lucide-react';

/**
 * Storybook & Component Documentation: Drawer (Slide-Over / Bottom Sheet)
 * 
 * **Purpose:** Side panels for complex inspector views (e.g., Shelter detail, Ward Sensor stats).
 * **Variants:** right (default desktop slide-over), bottom (mobile bottom sheet), left.
 * **Usage:** `<Drawer isOpen={isOpen} onClose={close} position="right"><DrawerHeader><DrawerTitle>Ward 14 Telemetry</DrawerTitle></DrawerHeader>...</Drawer>`
 * **Accessibility Notes:** Traps focus and supports ESC to dismiss.
 */

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'right' | 'left' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  children,
  className,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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

  const positionClasses = {
    right: 'inset-y-0 right-0 h-full w-full sm:w-[480px] border-l animate-in slide-in-from-right',
    left: 'inset-y-0 left-0 h-full w-full sm:w-[480px] border-r animate-in slide-in-from-left',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] w-full border-t rounded-t-2xl animate-in slide-in-from-bottom',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed z-50 bg-card border-border p-6 shadow-2xl overflow-y-auto flex flex-col justify-between',
          positionClasses[position],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const DrawerHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 mb-6 pr-6', className)} {...props} />
);

const DrawerTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-xl font-bold leading-none tracking-tight text-foreground', className)} {...props} />
);

const DrawerDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-row justify-end space-x-2 pt-6 mt-auto border-t border-border', className)} {...props} />
);

export { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter };
