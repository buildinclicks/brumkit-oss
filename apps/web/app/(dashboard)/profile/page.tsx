import { auth } from '@repo/auth';
import { db } from '@repo/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';

import { ChangePasswordForm } from './change-password-form';
import { DeleteAccountForm } from './delete-account-form';
import { EmailChangeForm } from './email-change-form';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await auth();

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
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Update your email address for account access and notifications
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
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>
                <p className="font-medium">{user.role}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Member since:</span>
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
