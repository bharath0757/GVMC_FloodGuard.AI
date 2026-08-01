import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/landing';
import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
