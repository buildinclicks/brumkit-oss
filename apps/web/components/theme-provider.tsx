'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

import type { ThemeProviderProps } from 'next-themes';

/**
 * Theme provider component that wraps next-themes
 *
 * Provides dark/light mode functionality throughout the application.
 * Syncs with system preferences and persists user selection.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
