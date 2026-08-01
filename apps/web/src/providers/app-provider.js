import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider, ToastProvider } from '@floodguard/ui';
import { QueryProvider } from './query-provider';
import { LoadingProvider } from './loading-provider';
import { AuthProvider } from '@/context/auth-context';
export function AppProvider({ children }) {
    return (_jsx(ThemeProvider, { defaultTheme: "dark", children: _jsx(QueryProvider, { children: _jsx(AuthProvider, { children: _jsx(ToastProvider, { children: _jsx(LoadingProvider, { children: children }) }) }) }) }));
}
//# sourceMappingURL=app-provider.js.map