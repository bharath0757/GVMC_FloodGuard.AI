import * as React from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ThemeMode = 'normal' | 'emergency';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export interface ThemeProviderState {
  theme: Theme;
  mode: ThemeMode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleEmergencyMode: () => void;
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  mode: 'normal',
  setTheme: () => null,
  setMode: () => null,
  toggleEmergencyMode: () => null,
};

export const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

/**
 * FloodGuard Theme Provider
 * Supports Light, Dark (default), System theme preferences,
 * plus Emergency High-Contrast Mode for crisis management.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  defaultMode = 'normal',
  storageKey = 'floodguard-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(
    () =>
      (typeof window !== 'undefined'
        ? (localStorage.getItem(storageKey) as Theme)
        : undefined) || defaultTheme,
  );
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'emergency-mode');

    if (mode === 'emergency') {
      root.classList.add('dark', 'emergency-mode');
      return;
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, mode]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey],
  );

  const setMode = React.useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleEmergencyMode = React.useCallback(() => {
    setModeState((prev) => (prev === 'normal' ? 'emergency' : 'normal'));
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      mode,
      setTheme,
      setMode,
      toggleEmergencyMode,
    }),
    [theme, mode, setTheme, setMode, toggleEmergencyMode],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
