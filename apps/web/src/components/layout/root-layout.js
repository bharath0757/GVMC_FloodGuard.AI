import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { useMediaQuery } from '@/hooks/use-media-query';
const LayoutContext = createContext(undefined);
export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context)
        throw new Error('useLayout must be used within Layout');
    return context;
};
export function RootLayout({ variant = 'default' }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const layoutContextValue = {
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
    };
    if (variant === 'minimal') {
        return (_jsx("main", { className: "min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100", children: _jsx(Outlet, {}) }));
    }
    const isDashboard = variant === 'dashboard';
    return (_jsx(LayoutContext.Provider, { value: layoutContextValue, children: _jsxs("div", { className: "flex min-h-screen flex-col bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100", children: [_jsx(Header, { showSidebarToggle: isDashboard }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [isDashboard && (_jsx(Sidebar, { isOpen: sidebarOpen, onToggle: toggleSidebar })), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsx("main", { className: "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8", children: _jsx(Outlet, {}) }), variant === 'default' && _jsx(Footer, {})] })] })] }) }));
}
//# sourceMappingURL=root-layout.js.map