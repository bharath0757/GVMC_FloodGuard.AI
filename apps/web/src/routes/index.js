import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/landing';
import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(LandingPage, {}),
    },
    {
        path: '/dashboard',
        element: _jsx(DashboardPage, {}),
    },
    {
        path: '*',
        element: _jsx(NotFoundPage, {}),
    },
]);
//# sourceMappingURL=index.js.map