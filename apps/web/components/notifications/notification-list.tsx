'use client';

import { Button } from '@repo/ui/button';
import { useEffect, useState } from 'react';

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '@/app/actions/notification';

import { NotificationItem } from './notification-item';

import type { Notification } from '@prisma/client';

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    const result = await getNotifications();
    if (result.success) {
      setNotifications(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const result = await markAsRead(id);
    if (result.success) {
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date() }))
      );
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error loading notifications: {error}</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No notifications</p>
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}
