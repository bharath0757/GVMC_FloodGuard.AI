/**
 * FloodGuard AI - Responsive Breakpoints
 */

export const breakpoints = {
  sm: '640px',   // Mobile landscape / Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops / Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px',// Ultra-wide government command center screens
} as const;

export type BreakpointKey = keyof typeof breakpoints;
