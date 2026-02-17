# @repo/config-tailwind

Shared Tailwind CSS configuration for React Masters monorepo.

## Features

- ✅ **Design Tokens** - Centralized colors, typography, spacing
- ✅ **Brand Colors** - Consistent brand identity across apps
- ✅ **Semantic Colors** - Success, warning, error, info states
- ✅ **shadcn/ui Compatible** - CSS variable-based theming
- ✅ **Dark Mode Ready** - Class-based dark mode strategy
- ✅ **Custom Animations** - Accordion, fade, slide animations
- ✅ **Responsive** - Mobile-first with extended breakpoints
- ✅ **Type-Safe** - Full TypeScript support

## Installation

This package is already part of the monorepo. No installation needed.

```bash
# Apps automatically have access via workspace
pnpm add @repo/config-tailwind --filter @repo/admin
```

## Usage

### Basic Setup

In your app's `tailwind.config.js`:

```js
import baseConfig from '@repo/config-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### Extending the Config

```js
import baseConfig from '@repo/config-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add app-specific customizations
      colors: {
        'admin-accent': '#ff6b6b',
      },
    },
  },
  plugins: [
    // Add app-specific plugins
    require('@tailwindcss/typography'),
  ],
};
```

## Design Tokens

### Brand Colors

Primary brand color palette (blue):

```jsx
<div className="bg-brand-500 text-white">Brand Primary</div>
<div className="bg-brand-600 hover:bg-brand-700">Brand Dark</div>
<div className="bg-brand-100 text-brand-900">Brand Light</div>
```

Available shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Semantic Colors

Status and feedback colors:

```jsx
{
  /* Success (green) */
}
<div className="bg-success-500 text-white">Success</div>;

{
  /* Warning (yellow/orange) */
}
<div className="bg-warning-500 text-white">Warning</div>;

{
  /* Error (red) */
}
<div className="bg-error-500 text-white">Error</div>;

{
  /* Info (blue) */
}
<div className="bg-info-500 text-white">Info</div>;
```

### shadcn/ui Theme Variables

Compatible with shadcn/ui CSS variables:

```jsx
{
  /* Primary */
}
<button className="bg-primary text-primary-foreground">Primary Button</button>;

{
  /* Secondary */
}
<button className="bg-secondary text-secondary-foreground">
  Secondary Button
</button>;

{
  /* Muted */
}
<div className="bg-muted text-muted-foreground">Muted background</div>;

{
  /* Destructive */
}
<button className="bg-destructive text-destructive-foreground">Delete</button>;
```

### Typography

Font sizes with line heights:

```jsx
<h1 className="text-5xl font-bold">Heading 1 (48px)</h1>
<h2 className="text-4xl font-bold">Heading 2 (36px)</h2>
<h3 className="text-3xl font-semibold">Heading 3 (30px)</h3>
<h4 className="text-2xl font-semibold">Heading 4 (24px)</h4>
<p className="text-base">Body text (16px)</p>
<small className="text-sm">Small text (14px)</small>
<span className="text-xs">Extra small (12px)</span>
```

Font families:

```jsx
<p className="font-sans">Inter / System UI</p>
<code className="font-mono">JetBrains Mono / Fira Code</code>
```

### Spacing

Based on 4px grid system:

```jsx
<div className="p-4">Padding 16px</div>
<div className="m-8">Margin 32px</div>
<div className="space-y-6">Gap 24px between children</div>
<div className="px-12 py-6">Padding 48px horizontal, 24px vertical</div>
```

Available: 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96

### Border Radius

Rounded corners:

```jsx
<div className="rounded">Default (4px)</div>
<div className="rounded-sm">Small (2px)</div>
<div className="rounded-md">Medium (6px)</div>
<div className="rounded-lg">Large (8px)</div>
<div className="rounded-xl">Extra Large (12px)</div>
<div className="rounded-2xl">2XL (16px)</div>
<div className="rounded-3xl">3XL (24px)</div>
<div className="rounded-full">Full (pill shape)</div>
```

### Shadows

Elevation system:

```jsx
<div className="shadow-sm">Subtle shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>
<div className="shadow-2xl">2XL shadow</div>
```

## Custom Animations

Pre-built animations for common UI patterns:

### Accordion

```jsx
<div className="animate-accordion-down">Expanding content</div>
<div className="animate-accordion-up">Collapsing content</div>
```

### Fade

```jsx
<div className="animate-fade-in">Fade in (300ms)</div>
<div className="animate-fade-out">Fade out (300ms)</div>
```

### Slide

```jsx
<div className="animate-slide-in-from-top">Slide from top</div>
<div className="animate-slide-in-from-bottom">Slide from bottom</div>
<div className="animate-slide-in-from-left">Slide from left</div>
<div className="animate-slide-in-from-right">Slide from right</div>
```

## Dark Mode

Uses class-based strategy (compatible with `next-themes`):

```jsx
{
  /* Light and dark variants */
}
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Text adapts to theme</p>
</div>;

{
  /* Using CSS variables (recommended) */
}
<div className="bg-background text-foreground">Automatically themed</div>;
```

## Responsive Design

Mobile-first with extended breakpoints:

```jsx
{/* Breakpoints: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) */}
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<div className="hidden md:block">
  Hidden on mobile, visible on tablet+
</div>
```

## Container

Centered container with responsive padding:

```jsx
<div className="container">
  {/* Centered with responsive padding */}
  {/* Max width: 1400px (2xl) */}
</div>
```

## Best Practices

### 1. Use CSS Variables for Theming

```jsx
// ✅ Good - works with light/dark mode
<button className="bg-primary text-primary-foreground">
  Button
</button>

// ❌ Avoid - fixed color
<button className="bg-blue-500 text-white">
  Button
</button>
```

### 2. Use Semantic Colors

```jsx
// ✅ Good - semantic meaning
<div className="bg-success-500">Operation successful</div>
<div className="bg-error-500">Operation failed</div>

// ❌ Avoid - unclear meaning
<div className="bg-green-500">Operation successful</div>
<div className="bg-red-500">Operation failed</div>
```

### 3. Consistent Spacing

```jsx
// ✅ Good - follows 4px grid
<div className="space-y-4">
  <div className="p-4">...</div>
  <div className="p-8">...</div>
</div>

// ❌ Avoid - arbitrary spacing
<div className="space-y-[13px]">
  <div className="p-[17px]">...</div>
</div>
```

### 4. Mobile-First

```jsx
// ✅ Good - mobile-first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// ❌ Avoid - desktop-first
<div className="text-lg md:text-sm">
  Wrong approach
</div>
```

## Customization

### Adding Custom Colors

Extend in your app's `tailwind.config.js`:

```js
export default {
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        'custom-purple': {
          50: '#faf5ff',
          // ... more shades
          500: '#8b5cf6',
          // ... more shades
          950: '#2e1065',
        },
      },
    },
  },
};
```

### Adding Custom Fonts

```js
export default {
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
      },
    },
  },
};
```

### Adding Custom Animations

```js
export default {
  presets: [baseConfig],
  theme: {
    extend: {
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s ease-out',
      },
    },
  },
};
```

## Testing

To verify the configuration works:

1. Create a test HTML file
2. Apply Tailwind classes
3. Check that colors, spacing, and animations render correctly

## Compatibility

- ✅ Tailwind CSS 4.x
- ✅ Next.js 15.x
- ✅ shadcn/ui components
- ✅ next-themes (dark mode)
- ✅ TypeScript

## Troubleshooting

### Colors not working

Make sure CSS variables are defined in your `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222 89% 53%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 222 89% 65%;
    --primary-foreground: 222 84% 4.9%;
    /* ... more variables */
  }
}
```

### Custom animations not working

Ensure you've imported the config as a preset, not merged directly.

### Fonts not loading

Make sure to import fonts in your app's layout:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

## Contributing

When adding new tokens or configurations:

1. Update `tokens.js` with the new values
2. Export from `index.js`
3. Document in this README
4. Test in both admin and user apps

## License

Private package for React Masters monorepo.
