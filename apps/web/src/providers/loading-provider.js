import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
const LoadingContext = createContext(undefined);
export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);
    return (_jsxs(LoadingContext.Provider, { value: { isLoading, showLoading, hideLoading }, children: [children, _jsx(AnimatePresence, { children: isLoading && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs(motion.div, { initial: { scale: 0.8 }, animate: { scale: 1 }, exit: { scale: 0.8 }, className: "flex flex-col items-center gap-4 rounded-xl bg-slate-900/90 p-8 shadow-2xl border border-slate-800", children: [_jsx(Loader2, { className: "h-12 w-12 animate-spin text-[#0D9488]" }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("span", { className: "text-xl font-semibold text-white tracking-tight", children: "FloodGuard AI" }), _jsx("span", { className: "text-sm text-slate-400 animate-pulse", children: "Processing request..." })] })] }) })) })] }));
}
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
//# sourceMappingURL=loading-provider.js.map