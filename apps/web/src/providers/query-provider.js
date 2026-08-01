import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
export function QueryProvider({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 10 * 60 * 1000, // 10 minutes
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [children, import.meta.env.DEV && _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
//# sourceMappingURL=query-provider.js.map