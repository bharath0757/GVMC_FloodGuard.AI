export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export type ColorVariant =
  'primary' | 'secondary' | 'danger' | 'warning' | 'safe' | 'neutral';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
