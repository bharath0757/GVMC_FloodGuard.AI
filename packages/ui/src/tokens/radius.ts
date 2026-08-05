/**
 * FloodGuard AI - Border Radius Tokens
 */

export const radius = {
  none: '0px',
  sm: '0.25rem', // 4px - Inputs, badges, small tags
  md: '0.5rem', // 8px - Buttons, standard cards
  lg: '0.75rem', // 12px - Modals, container cards
  xl: '1rem', // 16px - Large structural panels
  full: '9999px', // Pills, avatars
} as const;
