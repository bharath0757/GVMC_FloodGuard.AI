import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster, toast } from 'sonner';
import { useTheme } from './theme-provider';
export function ToastProvider({ children }) {
    const { theme } = useTheme();
    return (_jsxs(_Fragment, { children: [children, _jsx(Toaster, { position: "bottom-right", theme: theme, richColors: true })] }));
}
export const useAppToast = () => {
    return {
        success: (message, description) => toast.success(message, { description }),
        error: (message, description) => toast.error(message, { description }),
        warning: (message, description) => toast.warning(message, { description }),
        info: (message, description) => toast.info(message, { description }),
        loading: (message, description) => toast.loading(message, { description }),
        dismiss: (id) => toast.dismiss(id),
    };
};
//# sourceMappingURL=toast-provider.js.map