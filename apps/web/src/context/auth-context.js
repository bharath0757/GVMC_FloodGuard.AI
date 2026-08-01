import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { apiClient } from '@/lib/api-client';
const AuthContext = React.createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(() => {
        const saved = localStorage.getItem('floodguard_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await apiClient.post('/auth/login', { email, password });
            const { access_token, refresh_token, user_id, full_name, role } = res.data;
            const profile = { id: user_id, email, full_name, role, language_pref: 'en' };
            localStorage.setItem('floodguard_access_token', access_token);
            localStorage.setItem('floodguard_refresh_token', refresh_token);
            localStorage.setItem('floodguard_user', JSON.stringify(profile));
            setUser(profile);
        }
        finally {
            setIsLoading(false);
        }
    };
    const register = async (email, password, fullName, role = 'citizen') => {
        setIsLoading(true);
        try {
            const res = await apiClient.post('/auth/register', {
                email,
                password,
                full_name: fullName,
                role,
            });
            const { access_token, refresh_token, user_id } = res.data;
            const profile = { id: user_id, email, full_name: fullName, role: role, language_pref: 'en' };
            localStorage.setItem('floodguard_access_token', access_token);
            localStorage.setItem('floodguard_refresh_token', refresh_token);
            localStorage.setItem('floodguard_user', JSON.stringify(profile));
            setUser(profile);
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('floodguard_access_token');
        localStorage.removeItem('floodguard_refresh_token');
        localStorage.removeItem('floodguard_user');
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
        }, children: children }));
};
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
//# sourceMappingURL=auth-context.js.map