import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null,
        isDetailsOpen: false,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error, errorInfo: null, isDetailsOpen: false };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };
    handleGoHome = () => {
        window.location.href = '/';
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-4", children: _jsxs("div", { className: "max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6", children: _jsx(AlertTriangle, { className: "h-8 w-8 text-red-600 dark:text-red-500" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-slate-500 dark:text-slate-400 mb-8", children: "An unexpected error occurred in FloodGuard AI." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 w-full mb-6", children: [_jsxs("button", { onClick: this.handleReset, className: "flex-1 flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#152a46] text-white px-4 py-2.5 rounded-lg transition-colors font-medium", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Try Again"] }), _jsxs("button", { onClick: this.handleGoHome, className: "flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-lg transition-colors font-medium", children: [_jsx(Home, { className: "h-4 w-4" }), "Go Home"] })] }), import.meta.env.DEV && this.state.error && (_jsxs("div", { className: "w-full text-left", children: [_jsxs("button", { onClick: () => this.setState(prev => ({ isDetailsOpen: !prev.isDetailsOpen })), className: "text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300", children: [this.state.isDetailsOpen ? 'Hide' : 'Show', " error details"] }), this.state.isDetailsOpen && (_jsxs("div", { className: "mt-4 p-4 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-auto max-h-48 text-xs font-mono text-slate-800 dark:text-slate-300", children: [_jsx("p", { className: "font-bold mb-2 text-red-600 dark:text-red-400", children: this.state.error.toString() }), _jsx("pre", { children: this.state.errorInfo?.componentStack })] }))] }))] }) }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=error-boundary.js.map