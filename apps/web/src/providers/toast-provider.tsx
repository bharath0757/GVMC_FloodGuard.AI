import { Toaster, toast } from 'sonner';
import { useTheme } from './theme-provider';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme={theme as 'light' | 'dark' | 'system'}
        richColors
      />
    </>
  );
}

export const useAppToast = () => {
  return {
    success: (message: string, description?: string) =>
      toast.success(message, { description }),
    error: (message: string, description?: string) =>
      toast.error(message, { description }),
    warning: (message: string, description?: string) =>
      toast.warning(message, { description }),
    info: (message: string, description?: string) =>
      toast.info(message, { description }),
    loading: (message: string, description?: string) =>
      toast.loading(message, { description }),
    dismiss: (id?: string | number) => toast.dismiss(id),
  };
};
