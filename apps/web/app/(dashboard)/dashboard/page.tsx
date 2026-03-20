import { auth, defineAbilitiesFor } from '@repo/auth';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
} from '@repo/ui';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations('dashboard');

  if (!session?.user) {
    return null;
  }

  const ability = defineAbilitiesFor({
    id: session.user.id ?? '',
    role: session.user.role ?? 'USER',
    email: session.user.email ?? '',
  });

  const permissions = {
    canManageUsers: ability.can('manage', 'User'),
    canReadNotifications: ability.can('read', 'Notification'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('welcome', {
            name: session.user.name || session.user.email || 'User',
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('cards.account_status.title')}</CardTitle>
            <CardDescription>
              {t('cards.account_status.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.account_status.email')}
              </Label>
              <span className="text-sm font-medium">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.account_status.role')}
              </Label>
              <Badge variant="secondary">{session.user.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.account_status.username')}
              </Label>
              <span className="text-sm font-medium">
                {session.user.username || t('cards.account_status.not_set')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('cards.permissions.title')}</CardTitle>
            <CardDescription>
              {t('cards.permissions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.permissions.manage_users')}
              </Label>
              <Badge
                variant={permissions.canManageUsers ? 'default' : 'secondary'}
              >
                {permissions.canManageUsers
                  ? t('cards.permissions.yes')
                  : t('cards.permissions.no')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.permissions.read_notifications')}
              </Label>
              <Badge
                variant={
                  permissions.canReadNotifications ? 'default' : 'secondary'
                }
              >
                {permissions.canReadNotifications
                  ? t('cards.permissions.yes')
                  : t('cards.permissions.no')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('cards.quick_stats.title')}</CardTitle>
            <CardDescription>
              {t('cards.quick_stats.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                {t('cards.quick_stats.notifications')}
              </Label>
              <span className="text-2xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('cards.getting_started.title')}</CardTitle>
          <CardDescription>
            {t('cards.getting_started.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>{t('cards.getting_started.list.profile')}</li>
            <li>{t('cards.getting_started.list.notifications')}</li>
            <li>{t('cards.getting_started.list.community')}</li>
            <li>{t('cards.getting_started.list.connect')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
