'use client';
import { Button } from '@repo/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { NotificationBell } from '../notifications/notification-bell';
import { ThemeToggle } from '../theme-toggle';

import type { Session } from 'next-auth';

export const NavBarHeader = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const isActive = (path: string) => {
    // Exact match for dashboard to prevent it from matching all routes
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    // For other routes, check if pathname starts with the path
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    return isActive(path)
      ? 'text-foreground transition-colors hover:text-foreground/80'
      : 'text-foreground/60 transition-colors hover:text-foreground';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" mx-auto flex h-14  items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-xl">Brumkit</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className={getLinkClassName('/dashboard')}>
              {t('dashboard')}
            </Link>
            <Link href="/profile" className={getLinkClassName('/profile')}>
              {t('profile')}
            </Link>
            <Link
              href="/notifications"
              className={getLinkClassName('/notifications')}
            >
              {t('notifications')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session.user?.email}
          </span>
          <NotificationBell />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/api/auth/signout">{t('sign_out')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
