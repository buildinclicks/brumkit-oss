/**
 * Design Tokens
 *
 * Centralized design system tokens for React Masters.
 * These tokens ensure consistency across admin and user apps.
 */

/**
 * Color Palette
 *
 * Uses CSS variables for theme support (light/dark mode).
 * Compatible with shadcn/ui theming system.
 */
const colors = {
  // Brand colors
  brand: {
    50: 'hsl(222, 89%, 97%)',
    100: 'hsl(222, 89%, 94%)',
    200: 'hsl(222, 89%, 88%)',
    300: 'hsl(222, 89%, 77%)',
    400: 'hsl(222, 89%, 65%)',
    500: 'hsl(222, 89%, 53%)', // Primary brand color
    600: 'hsl(222, 89%, 42%)',
    700: 'hsl(222, 89%, 32%)',
    800: 'hsl(222, 89%, 24%)',
    900: 'hsl(222, 89%, 18%)',
    950: 'hsl(222, 89%, 11%)',
  },

  // Neutral colors (grays)
  neutral: {
    50: 'hsl(210, 20%, 98%)',
    100: 'hsl(210, 20%, 96%)',
    200: 'hsl(210, 16%, 93%)',
    300: 'hsl(210, 14%, 89%)',
    400: 'hsl(210, 12%, 71%)',
    500: 'hsl(210, 10%, 53%)',
    600: 'hsl(210, 12%, 43%)',
    700: 'hsl(210, 16%, 32%)',
    800: 'hsl(210, 20%, 20%)',
    900: 'hsl(210, 24%, 12%)',
    950: 'hsl(210, 28%, 7%)',
  },

  // Semantic colors
  success: {
    50: 'hsl(142, 76%, 97%)',
    100: 'hsl(142, 76%, 94%)',
    200: 'hsl(142, 76%, 88%)',
    300: 'hsl(142, 76%, 77%)',
    400: 'hsl(142, 76%, 65%)',
    500: 'hsl(142, 76%, 53%)', // Success green
    600: 'hsl(142, 76%, 42%)',
    700: 'hsl(142, 76%, 32%)',
    800: 'hsl(142, 76%, 24%)',
    900: 'hsl(142, 76%, 18%)',
  },

  warning: {
    50: 'hsl(38, 92%, 97%)',
    100: 'hsl(38, 92%, 94%)',
    200: 'hsl(38, 92%, 88%)',
    300: 'hsl(38, 92%, 77%)',
    400: 'hsl(38, 92%, 65%)',
    500: 'hsl(38, 92%, 53%)', // Warning yellow/orange
    600: 'hsl(38, 92%, 42%)',
    700: 'hsl(38, 92%, 32%)',
    800: 'hsl(38, 92%, 24%)',
    900: 'hsl(38, 92%, 18%)',
  },

  error: {
    50: 'hsl(0, 86%, 97%)',
    100: 'hsl(0, 86%, 94%)',
    200: 'hsl(0, 86%, 88%)',
    300: 'hsl(0, 86%, 77%)',
    400: 'hsl(0, 86%, 65%)',
    500: 'hsl(0, 86%, 53%)', // Error red
    600: 'hsl(0, 86%, 42%)',
    700: 'hsl(0, 86%, 32%)',
    800: 'hsl(0, 86%, 24%)',
    900: 'hsl(0, 86%, 18%)',
  },

  info: {
    50: 'hsl(199, 89%, 97%)',
    100: 'hsl(199, 89%, 94%)',
    200: 'hsl(199, 89%, 88%)',
    300: 'hsl(199, 89%, 77%)',
    400: 'hsl(199, 89%, 65%)',
    500: 'hsl(199, 89%, 53%)', // Info blue
    600: 'hsl(199, 89%, 42%)',
    700: 'hsl(199, 89%, 32%)',
    800: 'hsl(199, 89%, 24%)',
    900: 'hsl(199, 89%, 18%)',
  },
};

/**
 * Typography Scale
 *
 * Font sizes based on a modular scale (1.250 - major third).
 * Ensures harmonious typography across the design.
 */
const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  base: ['1rem', { lineHeight: '1.5rem' }], // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }], // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
  '8xl': ['6rem', { lineHeight: '1' }], // 96px
  '9xl': ['8rem', { lineHeight: '1' }], // 128px
};

/**
 * Font Families
 *
 * System font stacks for optimal performance and compatibility.
 */
const fontFamily = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Consolas',
    'Monaco',
    'Courier New',
    'monospace',
  ],
};

/**
 * Spacing Scale
 *
 * Based on 4px grid system (0.25rem = 4px).
 * Extended scale for larger spacing needs.
 */
const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
};

/**
 * Border Radius
 *
 * Rounded corners for UI elements.
 */
const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

/**
 * Box Shadow
 *
 * Elevation system for depth and hierarchy.
 */
const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

/**
 * Animation Duration
 *
 * Standard durations for transitions and animations.
 */
const transitionDuration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
};

/**
 * Z-Index Scale
 *
 * Layering system for stacking contexts.
 */
const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
};

module.exports = {
  colors,
  fontSize,
  fontFamily,
  spacing,
  borderRadius,
  boxShadow,
  transitionDuration,
  zIndex,
};
