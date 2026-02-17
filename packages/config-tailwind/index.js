/**
 * Tailwind CSS Preset for React Masters
 *
 * Shared configuration for admin and user apps.
 * Includes design tokens, plugins, and best practices.
 *
 * Usage in app's tailwind.config.js:
 *
 * ```js
 * import baseConfig from "@repo/config-tailwind";
 *
 * export default {
 *   presets: [baseConfig],
 *   content: [
 *     "./app/**\/*.{js,ts,jsx,tsx}",
 *     "./components/**\/*.{js,ts,jsx,tsx}",
 *   ],
 * };
 * ```
 */

const tokens = require('./tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode using class strategy (compatible with next-themes)
  darkMode: ['class'],

  // Content paths (apps will extend this)
  content: [],

  theme: {
    // Container configuration
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      // Design tokens from tokens.js
      colors: {
        // Brand colors
        brand: tokens.colors.brand,

        // Neutral colors
        gray: tokens.colors.neutral,

        // Semantic colors
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,

        // shadcn/ui compatible CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // Typography
      fontSize: tokens.fontSize,
      fontFamily: tokens.fontFamily,

      // Spacing
      spacing: tokens.spacing,

      // Border radius
      borderRadius: tokens.borderRadius,

      // Shadows
      boxShadow: tokens.boxShadow,

      // Animations
      transitionDuration: tokens.transitionDuration,

      // Z-index
      zIndex: tokens.zIndex,

      // Custom animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
      },

      // Screen breakpoints (keep defaults, extend if needed)
      screens: {
        xs: '475px',
      },
    },
  },

  // Plugins (apps can add more)
  plugins: [
    // Add commonly used plugins here if needed
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
    // require("tailwindcss-animate"),
  ],
};
