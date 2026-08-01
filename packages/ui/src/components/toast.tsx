import * as React from 'react';
import { cn } from '@floodguard/utils';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    ({ title, message, type = 'info', duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, message, type, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const typeClasses = {
    success: 'bg-safe text-safe-foreground border-safe',
    error: 'bg-destructive text-destructive-foreground border-destructive',
    warning: 'bg-warning text-warning-foreground border-warning',
    info: 'bg-background text-foreground border-border',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
        'animate-in slide-in-from-bottom-5 fade-in-90',
        typeClasses[toast.type]
      )}
      role="alert"
    >
      <div className="flex w-full flex-col gap-1">
        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
        <div className="text-sm opacity-90">{toast.message}</div>
      </div>
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-inherit opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
