import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/providers/app-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { router } from '@/routes';

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ErrorBoundary>
  );
}
