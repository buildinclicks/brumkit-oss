'use client';

import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getUnreadCount } from '@/app/actions/notification';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnreadCount = async () => {
      setLoading(true);
      const result = await getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data);
      }
      setLoading(false);
    };

    loadUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {!loading && unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
