import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/providers/app-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { router } from '@/routes';
export function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(AppProvider, { children: _jsx(RouterProvider, { router: router }) }) }));
}
//# sourceMappingURL=app.js.map