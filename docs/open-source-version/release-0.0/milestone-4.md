# Milestone 4: Basic Notification UI

**Status**: Pending  
**Prerequisites**: Milestone 3 completed  
**Estimated Effort**: 4 days

---

## Goal

Implement a simple notification list UI with mark-as-read functionality, following TDD principles and cursor rules.

---

## Context

The Notification model exists in the Prisma schema but has no UI implementation. For the open-source version, we need to provide a basic notification system where users can:

- View their notifications
- Mark individual notifications as read
- Mark all notifications as read
- See an unread count badge in the header

This will be implemented following strict TDD (Test-Driven Development) practices.

**Key Files**:

- Notification model: `packages/database/prisma/schema.prisma`
- Server actions: `apps/web/app/actions/notification.ts` (to create)
- UI components: `apps/web/components/notifications/` (to create)
- Page: `apps/web/app/(dashboard)/notifications/page.tsx` (to create)

---

## Tasks

### Task 4.1: Write Notification Validation Schemas (TDD - Red Phase)

**Objective**: Create validation schemas for notification operations.

**Actions**:

1. Create `packages/validation/src/schemas/notification.schema.ts`
2. Add validation schemas:

```typescript
import { z } from 'zod';
import { ValidationMessages } from '../messages';

/**
 * Schema for marking a notification as read
 */
export const markNotificationAsReadSchema = z.object({
  id: z.string().cuid(ValidationMessages.INVALID_ID),
});

export type MarkNotificationAsReadInput = z.infer<
  typeof markNotificationAsReadSchema
>;
```

3. Export from `packages/validation/src/schemas/index.ts`:

```typescript
export * from './notification.schema';
```

4. Create tests in `packages/validation/test/schemas/notification.schema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { markNotificationAsReadSchema } from '../../src/schemas/notification.schema';

describe('Notification Validation Schemas', () => {
  describe('markNotificationAsReadSchema', () => {
    it('should accept valid notification ID', () => {
      const result = markNotificationAsReadSchema.safeParse({
        id: 'clh1234567890abcdefghij',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid ID format', () => {
      const result = markNotificationAsReadSchema.safeParse({
        id: 'invalid-id',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing ID', () => {
      const result = markNotificationAsReadSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
```

**Files to Create**:

- `packages/validation/src/schemas/notification.schema.ts`
- `packages/validation/test/schemas/notification.schema.test.ts`

**Files to Modify**:

- `packages/validation/src/schemas/index.ts`

**Expected Result**: Validation tests fail initially (Red phase).

---

### Task 4.2: Write Notification Server Action Tests (TDD - Red Phase)

**Objective**: Write tests for notification server actions before implementation.

**Actions**:

1. Create `apps/web/app/actions/notification.test.ts`
2. Write comprehensive tests:

```typescript
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
  createTestNotification,
} from '@repo/database';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from './notification';

// Mock auth
vi.mock('@repo/auth', () => ({
  auth: vi.fn(),
}));

const { auth } = await import('@repo/auth');

describe('Notification Server Actions', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectTestClient();
  });

  describe('getNotifications', () => {
    it('should return user notifications', async () => {
      const user = await createTestUser({ email: 'test@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      await createTestNotification({
        recipientId: user.id,
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'Test message',
      });

      const result = await getNotifications();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Notification');
    });

    it('should return only user own notifications', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      await createTestNotification({
        recipientId: user1.id,
        title: 'For User 1',
      });
      await createTestNotification({
        recipientId: user2.id,
        title: 'For User 2',
      });

      const result = await getNotifications();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('For User 1');
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await getNotifications();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const user = await createTestUser({ email: 'test@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const notification = await createTestNotification({
        recipientId: user.id,
        readAt: null,
      });

      const result = await markAsRead(notification.id);

      expect(result.success).toBe(true);

      // Verify in database
      const db = getTestClient();
      const updated = await db.notification.findUnique({
        where: { id: notification.id },
      });
      expect(updated?.readAt).not.toBeNull();
    });

    it('should not mark other user notification', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      const notification = await createTestNotification({
        recipientId: user2.id,
      });

      const result = await markAsRead(notification.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Notification not found');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      const user = await createTestUser({ email: 'test@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      await createTestNotification({ recipientId: user.id, readAt: null });
      await createTestNotification({ recipientId: user.id, readAt: null });

      const result = await markAllAsRead();

      expect(result.success).toBe(true);

      // Verify in database
      const db = getTestClient();
      const notifications = await db.notification.findMany({
        where: { recipientId: user.id },
      });
      notifications.forEach((n) => expect(n.readAt).not.toBeNull());
    });
  });

  describe('getUnreadCount', () => {
    it('should return correct unread count', async () => {
      const user = await createTestUser({ email: 'test@example.com' });
      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      await createTestNotification({ recipientId: user.id, readAt: null });
      await createTestNotification({ recipientId: user.id, readAt: null });
      await createTestNotification({
        recipientId: user.id,
        readAt: new Date(),
      });

      const result = await getUnreadCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(2);
    });
  });
});
```

**Files to Create**:

- `apps/web/app/actions/notification.test.ts`

**Expected Result**: Tests fail because server actions don't exist yet (Red phase).

---

### Task 4.3: Implement Notification Server Actions (TDD - Green Phase)

**Objective**: Implement server actions to make tests pass.

**Actions**:

1. Create `apps/web/app/actions/notification.ts`:

```typescript
'use server';

import { auth } from '@repo/auth';
import { db } from '@repo/database';
import type { Notification } from '@prisma/client';

import type { ActionResult } from '@/lib/types';

/**
 * Get all notifications for the current user
 */
export async function getNotifications(): Promise<
  ActionResult<Notification[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const notifications = await db.notification.findMany({
      where: {
        recipientId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error('Get notifications error:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(id: string): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify notification belongs to user
    const notification = await db.notification.findFirst({
      where: {
        id,
        recipientId: session.user.id,
      },
    });

    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    await db.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllAsRead(): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.notification.updateMany({
      where: {
        recipientId: session.user.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Mark all as read error:', error);
    return { success: false, error: 'Failed to mark all as read' };
  }
}

/**
 * Get unread notification count for the current user
 */
export async function getUnreadCount(): Promise<ActionResult<number>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const count = await db.notification.count({
      where: {
        recipientId: session.user.id,
        readAt: null,
      },
    });

    return { success: true, data: count };
  } catch (error) {
    console.error('Get unread count error:', error);
    return { success: false, error: 'Failed to get unread count' };
  }
}
```

2. Export from `apps/web/app/actions/index.ts`:

```typescript
export * from './notification';
```

**Files to Create**:

- `apps/web/app/actions/notification.ts`

**Files to Modify**:

- `apps/web/app/actions/index.ts`

**Expected Result**: Server action tests pass (Green phase).

---

### Task 4.4: Write Notification Component Tests (TDD - Red Phase)

**Objective**: Write component tests before implementing UI.

**Actions**:

1. Create `apps/web/components/notifications/notification-item.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/lib/test';
import { NotificationItem } from './notification-item';

describe('NotificationItem', () => {
  const mockNotification = {
    id: '1',
    type: 'SYSTEM' as const,
    title: 'Test Notification',
    message: 'This is a test message',
    link: '/test',
    readAt: null,
    createdAt: new Date(),
    recipientId: 'user1',
  };

  it('should render notification title and message', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} onMarkAsRead={() => {}} />,
      { disableTheme: true }
    );

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('should show unread indicator for unread notifications', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} onMarkAsRead={() => {}} />,
      { disableTheme: true }
    );

    expect(screen.getByTestId('unread-indicator')).toBeInTheDocument();
  });

  it('should not show unread indicator for read notifications', () => {
    const readNotification = { ...mockNotification, readAt: new Date() };

    renderWithProviders(
      <NotificationItem notification={readNotification} onMarkAsRead={() => {}} />,
      { disableTheme: true }
    );

    expect(screen.queryByTestId('unread-indicator')).not.toBeInTheDocument();
  });

  it('should call onMarkAsRead when mark as read button clicked', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();

    renderWithProviders(
      <NotificationItem notification={mockNotification} onMarkAsRead={onMarkAsRead} />,
      { disableTheme: true }
    );

    await user.click(screen.getByRole('button', { name: /mark as read/i }));

    expect(onMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should not show mark as read button for read notifications', () => {
    const readNotification = { ...mockNotification, readAt: new Date() };

    renderWithProviders(
      <NotificationItem notification={readNotification} onMarkAsRead={() => {}} />,
      { disableTheme: true }
    );

    expect(screen.queryByRole('button', { name: /mark as read/i })).not.toBeInTheDocument();
  });
});
```

2. Create similar tests for NotificationList and the notifications page

**Files to Create**:

- `apps/web/components/notifications/notification-item.test.tsx`
- `apps/web/components/notifications/notification-list.test.tsx`
- `apps/web/app/(dashboard)/notifications/page.test.tsx`

**Expected Result**: Component tests fail because components don't exist yet (Red phase).

---

### Task 4.5: Implement Notification UI Components (TDD - Green Phase)

**Objective**: Create UI components to make tests pass.

**Actions**:

1. Create `apps/web/components/notifications/notification-item.tsx`:

```typescript
'use client';

import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { Notification } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const isUnread = !notification.readAt;

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
          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
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
```

2. Create `apps/web/components/notifications/notification-list.tsx`
3. Create skeleton component `apps/web/components/skeletons/notification-skeleton.tsx`

**Files to Create**:

- `apps/web/components/notifications/notification-item.tsx`
- `apps/web/components/notifications/notification-list.tsx`
- `apps/web/components/skeletons/notification-skeleton.tsx`

**Expected Result**: Component tests pass (Green phase).

---

### Task 4.6: Implement Notification Page

**Objective**: Create the notifications page with loading state.

**Actions**:

1. Create `apps/web/app/(dashboard)/notifications/page.tsx`:

```typescript
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
```

2. Create `apps/web/app/(dashboard)/notifications/loading.tsx`:

```typescript
import { NotificationSkeleton } from '@/components/skeletons/notification-skeleton';

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationSkeleton />
    </div>
  );
}
```

**Files to Create**:

- `apps/web/app/(dashboard)/notifications/page.tsx`
- `apps/web/app/(dashboard)/notifications/loading.tsx`

---

### Task 4.7: Add Notification Indicator to Header

**Objective**: Add unread count badge to dashboard navigation.

**Actions**:

1. Find the dashboard header/navigation component
2. Add notification bell icon with unread count badge
3. Link to `/notifications` page

**Files to Modify**:

- Dashboard navigation/header component (location TBD based on codebase structure)

---

### Task 4.8: Add i18n Translations

**Objective**: Add notification-related translation strings.

**Actions**:

1. Open `apps/web/messages/en.json`
2. Add notifications section:

```json
"notifications": {
  "title": "Notifications",
  "empty": "No notifications",
  "empty_description": "You don't have any notifications yet",
  "mark_read": "Mark as read",
  "mark_all_read": "Mark all as read",
  "unread_count": "{count} unread",
  "load_more": "Load more",
  "type_system": "System",
  "type_account": "Account",
  "type_security": "Security"
}
```

**Files to Modify**:

- `apps/web/messages/en.json`

---

### Task 4.9: Refactor and Polish (TDD - Refactor Phase)

**Objective**: Clean up code while keeping tests green.

**Actions**:

1. Ensure consistent styling with existing components
2. Verify dark mode support
3. Test responsive design
4. Optimize performance (memoization if needed)
5. Add proper TypeScript types
6. Remove any console.log statements
7. Ensure accessibility (ARIA labels, keyboard navigation)

**Expected Result**: Clean, production-ready code with all tests passing.

---

## Deliverables

- [ ] Notification validation schemas with tests
- [ ] Notification server actions with tests
- [ ] NotificationItem component with tests
- [ ] NotificationList component with tests
- [ ] Notification skeleton component
- [ ] Notifications page with loading state
- [ ] Header notification indicator with unread count
- [ ] i18n translations for notifications
- [ ] This milestone documentation file completed

---

## Acceptance Criteria

### Must Have (Blocking)

- [ ] Users can view their notifications
- [ ] Users can mark individual notifications as read
- [ ] Users can mark all notifications as read
- [ ] Empty state displays when no notifications
- [ ] Loading skeleton displays while fetching
- [ ] Unread count badge in header
- [ ] Unread notifications visually distinct (border/indicator)
- [ ] Notifications sorted by date (newest first)
- [ ] Only user's own notifications visible

### Code Quality

- [ ] All tests pass: `pnpm test`
- [ ] ESLint clean: `pnpm lint`
- [ ] Prettier clean: `pnpm format:check`
- [ ] TypeScript clean: `pnpm type-check`
- [ ] Test coverage 80%+ for new code

### TDD Compliance

- [ ] Tests written BEFORE implementation (Red phase)
- [ ] Implementation made tests pass (Green phase)
- [ ] Code refactored while keeping tests green (Refactor phase)
- [ ] Test coverage maintained at 80%+

### Cursor Rules Compliance

- [ ] Followed all rules in `.cursor/rules`
- [ ] Server Actions used for mutations
- [ ] `ActionResult<T>` pattern used
- [ ] Tailwind CSS v4 classes used (no custom CSS)
- [ ] Loading states with skeleton components
- [ ] i18n for all user-facing strings
- [ ] Single quotes, 2-space indentation, semicolons

### Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on buttons
- [ ] Error messages have `role="alert"`
- [ ] Component tests use role queries
- [ ] Focus management working correctly

### Manual Verification

- [ ] Can view notifications in `/notifications` page
- [ ] Can mark notification as read by clicking button
- [ ] Notification disappears from unread list after marking
- [ ] Can mark all as read
- [ ] Unread count badge updates correctly
- [ ] Badge shows in header navigation
- [ ] Dark mode works correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors

---

## Testing Database Helpers

Add these helpers to `packages/database/test/helpers.ts`:

```typescript
export async function createTestNotification(data: Partial<Notification>) {
  return await prisma.notification.create({
    data: {
      type: 'SYSTEM',
      title: 'Test Notification',
      message: 'Test message',
      recipientId: data.recipientId!,
      ...data,
    },
  });
}
```

---

## Rollback Plan

If issues arise:

1. Remove notifications page and components
2. Remove notification server actions
3. Remove notification validation schemas
4. Revert header changes
5. Run `pnpm test` to verify rollback

---

## Notes

- Notifications are sorted by `createdAt` DESC (newest first)
- Notification types: SYSTEM, ACCOUNT, SECURITY (from Prisma enum)
- No real-time updates in this milestone (polling or manual refresh only)
- No pagination in this milestone (all notifications loaded at once)
- Future enhancement: Add pagination for better performance

---

## Next Steps

After completing this milestone, proceed to **Milestone 5: Documentation and Branding**.
