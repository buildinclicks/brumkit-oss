'use client';

import { Button } from '@repo/ui/button';

export function GoBackButton({ children }: { children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
      {children}
    </Button>
  );
}
