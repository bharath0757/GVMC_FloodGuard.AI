/**
 * FloodGuard AI - Accessibility Guidelines & Standards
 * WCAG 2.1 AA Compliance Requirements for Disaster Management Systems
 */

export const accessibility = {
  minTouchTarget: '44px', // Minimum 44x44px target on touchscreens for emergency usability
  minContrastRatioText: 4.5, // 4.5:1 for normal text
  minContrastRatioLargeText: 3.0, // 3:1 for large text (18pt+)
  focusRingClass: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  screenReaderOnlyClass: 'sr-only',
  reducedMotionClass: 'motion-reduce:transition-none motion-reduce:transform-none',
} as const;
