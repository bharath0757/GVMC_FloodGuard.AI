import * as React from 'react';
import { ThemeProvider, ToastProvider } from '@floodguard/ui';
import { QueryProvider } from './query-provider';
import { LoadingProvider } from './loading-provider';
import { AuthProvider } from '@/context/auth-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
