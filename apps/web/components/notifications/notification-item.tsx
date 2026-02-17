'use client';

import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import Link from 'next/link';

import type { Notification } from '@prisma/client';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const isUnread = !notification.readAt;

  // Format relative time manually to avoid external dependencies
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Card className={`p-4 ${isUnread ? 'border-primary' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isUnread && (
              <div
                data-testid="unread-indicator"
                className="w-2 h-2 bg-primary rounded-full"
              />
            )}
            <h3 className="font-semibold">{notification.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(notification.createdAt)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {isUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
          {notification.link && (
            <Button variant="outline" size="sm" asChild>
              <Link href={notification.link}>View</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
