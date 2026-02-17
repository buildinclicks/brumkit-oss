import { NotificationSkeleton } from '@/components/skeletons/notification-skeleton';

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationSkeleton />
    </div>
  );
}
