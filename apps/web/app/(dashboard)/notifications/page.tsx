import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { Suspense } from 'react';

import { NotificationList } from '@/components/notifications/notification-list';
import { NotificationSkeleton } from '@/components/skeletons/notification-skeleton';

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            View and manage all your notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<NotificationSkeleton />}>
            <NotificationList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
