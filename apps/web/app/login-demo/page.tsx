'use client';

import { Button } from '@repo/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ROLES = [
  {
    id: 'super_admin',
    email: 'superadmin@brumkit.com',
    password: 'SuperAdmin123!',
  },
  {
    id: 'admin',
    email: 'admin@brumkit.com',
    password: 'Admin123!',
  },
  {
    id: 'moderator',
    email: 'moderator@brumkit.com',
    password: 'Moderator123!',
  },
  {
    id: 'user',
    email: 'user@example.com', // Placeholder for random users, or just use one
    password: 'User123!',
  },
] as const;

export default function LoginDemoPage() {
  const t = useTranslations('demo');

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {ROLES.map((role) => (
          <Card
            key={role.id}
            className="flex flex-col justify-between transition-all hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl">{t(`roles.${role.id}`)}</CardTitle>
              <CardDescription>{t(`descriptions.${role.id}`)}</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0 mt-auto">
              <Button asChild className="w-full">
                <Link
                  href={`/login?email=${encodeURIComponent(
                    role.email
                  )}&password=${encodeURIComponent(role.password)}`}
                >
                  {t('login_button', { role: t(`roles.${role.id}`) })}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="ghost" asChild>
          <Link href="/login">{t('back_to_login')}</Link>
        </Button>
      </div>
    </div>
  );
}
