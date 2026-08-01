import * as React from 'react';
import { apiClient } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'government' | 'admin';
  language_pref: string;
  phone?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('floodguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { access_token, refresh_token, user_id, full_name, role } = res.data;
      const profile: UserProfile = { id: user_id, email, full_name, role, language_pref: 'en' };

      localStorage.setItem('floodguard_access_token', access_token);
      localStorage.setItem('floodguard_refresh_token', refresh_token);
      localStorage.setItem('floodguard_user', JSON.stringify(profile));
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, role = 'citizen') => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        role,
      });
      const { access_token, refresh_token, user_id } = res.data;
      const profile: UserProfile = { id: user_id, email, full_name: fullName, role: role as UserProfile['role'], language_pref: 'en' };

      localStorage.setItem('floodguard_access_token', access_token);
      localStorage.setItem('floodguard_refresh_token', refresh_token);
      localStorage.setItem('floodguard_user', JSON.stringify(profile));
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('floodguard_access_token');
    localStorage.removeItem('floodguard_refresh_token');
    localStorage.removeItem('floodguard_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
