'use client';

import { Toaster } from '@repo/ui/sonner';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/lib/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
