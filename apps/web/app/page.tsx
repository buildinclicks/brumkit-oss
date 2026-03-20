import { auth } from '@repo/auth';
import { Button } from '@repo/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { ThemeToggle } from '@/components/theme-toggle';

export default async function HomePage() {
  const session = await auth();
  const t = await getTranslations('home');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">{t('subtitle')}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {session ? (
            <>
              <Button asChild size="lg">
                <Link href="/dashboard">{t('go_to_dashboard')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/api/auth/signout">{t('sign_out')}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/login-demo">{t('get_started')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">{t('sign_up')}</Link>
              </Button>
            </>
          )}
        </div>

        {session && (
          <div className="mt-8 rounded-lg border bg-card p-4 text-left">
            <p className="text-sm text-muted-foreground">{t('signed_in_as')}</p>
            <p className="font-medium">{session.user?.email}</p>
            <p className="text-sm text-muted-foreground">
              {t('role', { role: session.user?.role })}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
