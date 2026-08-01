/**
 * FloodGuard AI - Color Design Tokens
 * 
 * Deep Blue (#1E3A5F) for trust, stability, and emergency authority.
 * Teal (#0D9488) for environmental monitoring and water systems.
 * Red/Amber/Green for critical alert levels and risk status.
 */

export const colors = {
  primary: {
    DEFAULT: '#1E3A5F',
    50: '#F0F4F8',
    100: '#D9E2EC',
    200: '#BCCCDC',
    300: '#9FB3C8',
    400: '#829AB1',
    500: '#1E3A5F',
    600: '#183050',
    700: '#12243C',
    800: '#0C1828',
    900: '#060C14',
    foreground: '#F8FAFC',
  },
  secondary: {
    DEFAULT: '#0D9488',
    50: '#F0FDFB',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    foreground: '#F8FAFC',
  },
  danger: {
    DEFAULT: '#DC2626',
    foreground: '#FFFFFF',
    light: '#FEE2E2',
    dark: '#991B1B',
  },
  warning: {
    DEFAULT: '#F59E0B',
    foreground: '#000000',
    light: '#FEF3C7',
    dark: '#92400E',
  },
  safe: {
    DEFAULT: '#16A34A',
    foreground: '#FFFFFF',
    light: '#DCFCE7',
    dark: '#166534',
  },
  neutral: {
    DEFAULT: '#64748B',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  riskLevels: {
    veryLow: {
      color: '#22C55E',
      bg: 'rgba(34, 197, 94, 0.15)',
      border: '#22C55E',
      label: 'Very Low',
    },
    low: {
      color: '#84CC16',
      bg: 'rgba(132, 204, 22, 0.15)',
      border: '#84CC16',
      label: 'Low',
    },
    medium: {
      color: '#EAB308',
      bg: 'rgba(234, 179, 8, 0.15)',
      border: '#EAB308',
      label: 'Medium',
    },
    high: {
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.15)',
      border: '#F97316',
      label: 'High',
    },
    critical: {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.2)',
      border: '#EF4444',
      label: 'Critical',
    },
  },
} as const;

export type RiskLevelKey = keyof typeof colors.riskLevels;
