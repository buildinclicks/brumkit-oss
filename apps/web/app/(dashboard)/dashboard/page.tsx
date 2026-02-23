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

export default async function DashboardPage() {
  const session = await auth();

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Email</Label>
              <span className="text-sm font-medium">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Role</Label>
              <Badge variant="secondary">{session.user.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Username</Label>
              <span className="text-sm font-medium">
                {session.user.username || 'Not set'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>What you can do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Manage Users</Label>
              <Badge
                variant={permissions.canManageUsers ? 'default' : 'secondary'}
              >
                {permissions.canManageUsers ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">
                Read Notifications
              </Label>
              <Badge
                variant={
                  permissions.canReadNotifications ? 'default' : 'secondary'
                }
              >
                {permissions.canReadNotifications ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Notifications</Label>
              <span className="text-2xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Here are some things you can do to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Update your profile information</li>
            <li>Check your notifications</li>
            <li>Explore the community</li>
            <li>Connect with other users</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
