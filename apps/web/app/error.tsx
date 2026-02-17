'use client';

import { Button } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@repo/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.500');

  // Log error (will be caught by error reporting service)
  if (typeof window !== 'undefined') {
    console.error('Error:', error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{t('heading')}</h1>
          <CardDescription className="text-base">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {t('message')}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              {t('try_again')}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t('go_home')}</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {error?.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
