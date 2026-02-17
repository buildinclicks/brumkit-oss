import { auth } from '@repo/auth';
import { db } from '@repo/database';
import { Button } from '@repo/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { NotificationBell } from '@/components/notifications/notification-bell';
import { ThemeToggle } from '@/components/theme-toggle';
import { VerificationBanner } from '@/components/verification-banner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Get user's email verification status
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, email: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Show verification banner if email not verified */}
      {user && !user.emailVerified && <VerificationBanner email={user.email} />}

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold">
              React Masters
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Profile
              </Link>
              <Link
                href="/notifications"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Notifications
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
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
