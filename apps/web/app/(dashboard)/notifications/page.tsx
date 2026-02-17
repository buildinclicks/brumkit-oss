import { Suspense } from 'react';

import { NotificationList } from '@/components/notifications/notification-list';
import { NotificationSkeleton } from '@/components/skeletons/notification-skeleton';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationList />
      </Suspense>
    </div>
  );
}
