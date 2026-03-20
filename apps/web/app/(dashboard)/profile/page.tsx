import { auth } from '@repo/auth';
import { db } from '@repo/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { getTranslations } from 'next-intl/server';

import { ChangePasswordForm } from './change-password-form';
import { DeleteAccountForm } from './delete-account-form';
import { EmailChangeForm } from './email-change-form';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await auth();
  const t = await getTranslations('profile');

  if (!session?.user) {
    return null;
  }

  // Fetch full user data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.information.title')}</CardTitle>
              <CardDescription>
                {t('sections.information.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          <ChangePasswordForm />

          <Card>
            <CardHeader>
              <CardTitle>{t('sections.change_email.title')}</CardTitle>
              <CardDescription>
                {t('sections.change_email.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailChangeForm currentEmail={user.email} />
            </CardContent>
          </Card>

          <DeleteAccountForm />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.details.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {t('sections.details.email')}
                </span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('sections.details.role')}
                </span>
                <p className="font-medium">{user.role}</p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('sections.details.member_since')}
                </span>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
