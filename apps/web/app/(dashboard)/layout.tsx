import { auth } from '@repo/auth';
import { db } from '@repo/database';
import { redirect } from 'next/navigation';

import { NavBarHeader } from '@/components/header';
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

      <NavBarHeader session={session} />
      <main className="flex-1">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
