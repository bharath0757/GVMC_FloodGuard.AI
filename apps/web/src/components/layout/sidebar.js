import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Settings, Map, BarChart3 } from 'lucide-react';
import { cn } from '@floodguard/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
const navItems = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'Map View', icon: Map, path: '/map' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
];
export function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 767px)');
    if (isMobile && !isOpen)
        return null;
    return (_jsxs(motion.aside, { initial: false, animate: {
            width: isOpen ? 256 : 64,
            x: isMobile && !isOpen ? -256 : 0
        }, className: cn("flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30", isMobile ? "fixed inset-y-0 left-0 pt-16 h-full" : "relative h-[calc(100vh-4rem)]"), children: [_jsx("div", { className: "flex-1 overflow-y-auto py-4", children: _jsx("nav", { className: "space-y-1 px-2", children: navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (_jsxs(Link, { to: item.path, className: cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", isActive
                                ? "bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"), title: !isOpen ? item.label : undefined, children: [_jsx(Icon, { className: cn("h-5 w-5 shrink-0", isActive && "text-[#0D9488]") }), _jsx(AnimatePresence, { mode: "wait", children: isOpen && (_jsx(motion.span, { initial: { opacity: 0, width: 0 }, animate: { opacity: 1, width: 'auto' }, exit: { opacity: 0, width: 0 }, className: "whitespace-nowrap font-medium text-sm overflow-hidden", children: item.label })) })] }, item.path));
                    }) }) }), !isMobile && (_jsx("div", { className: "border-t border-slate-200 dark:border-slate-800 p-2", children: _jsx("button", { onClick: onToggle, className: "flex w-full items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors", children: isOpen ? _jsx(ChevronLeft, { className: "h-5 w-5" }) : _jsx(ChevronRight, { className: "h-5 w-5" }) }) }))] }));
}
//# sourceMappingURL=sidebar.js.map