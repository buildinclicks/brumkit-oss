/**
 * Notification Server Actions - Integration Tests
 *
 * Tests notification server actions with real test database.
 * Following TDD principles with proper database setup and cleanup.
 *
 * Test Coverage:
 * - Get notifications for authenticated user
 * - Mark single notification as read
 * - Mark all notifications as read
 * - Get unread notification count
 * - Authorization and security checks
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

// Mock database to use test client - must be before any imports that use it
vi.mock('@repo/database', async () => {
  // Import test utilities inside the factory
  const { getTestClient } = await import('@repo/database/test');
  return {
    db: getTestClient(),
  };
});

// Mock auth - external dependency
vi.mock('@repo/auth', () => ({
  auth: vi.fn(),
}));

import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
  createTestNotification,
} from '@repo/database/test';
import { auth } from '@repo/auth';

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from './notification';

describe('Notification Server Actions - Integration Tests', () => {
  const testDb = getTestClient();
  beforeEach(async () => {
    // Clean database before each test for isolation
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up and disconnect after all tests
    await cleanDatabase();
    await disconnectTestClient();
  });

  describe('getNotifications', () => {
    it('should return user notifications from database', async () => {
      // Create test user
      const user = await createTestUser({ email: 'test@example.com' });

      // Create test notification in database
      const notification = await createTestNotification({
        recipientId: user.id,
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'Test message',
      });

      // Mock auth to return our test user
      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      // Call server action
      const result = await getNotifications();

      // Verify results
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(notification.id);
      expect(result.data[0].title).toBe('Test Notification');
      expect(result.data[0].recipientId).toBe(user.id);
    });

    it('should return only user own notifications', async () => {
      // Create two users
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      // Create notifications for both users
      await createTestNotification({
        recipientId: user1.id,
        title: 'For User 1',
        message: 'Message for user 1',
      });

      await createTestNotification({
        recipientId: user2.id,
        title: 'For User 2',
        message: 'Message for user 2',
      });

      // Mock auth as user1
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      // Call server action
      const result = await getNotifications();

      // Verify only user1's notification is returned
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('For User 1');
      expect(result.data[0].recipientId).toBe(user1.id);
    });

    it('should return notifications ordered by createdAt desc', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      // Create notifications with slight delay to ensure different timestamps
      const notif1 = await createTestNotification({
        recipientId: user.id,
        title: 'First Notification',
        message: 'Created first',
      });

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const notif2 = await createTestNotification({
        recipientId: user.id,
        title: 'Second Notification',
        message: 'Created second',
      });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await getNotifications();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      // Most recent first
      expect(result.data[0].title).toBe('Second Notification');
      expect(result.data[1].title).toBe('First Notification');
    });

    it('should return empty array when user has no notifications', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await getNotifications();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await getNotifications();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read in database', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      const notification = await createTestNotification({
        recipientId: user.id,
        readAt: null, // Unread
      });

      // Verify it's unread
      expect(notification.readAt).toBeNull();

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      // Mark as read
      const result = await markAsRead(notification.id);

      expect(result.success).toBe(true);

      // Verify in database that it's now marked as read
      const updated = await testDb.notification.findUnique({
        where: { id: notification.id },
      });

      expect(updated?.readAt).not.toBeNull();
      expect(updated?.readAt).toBeInstanceOf(Date);
    });

    it('should not mark other user notification', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      // Create notification for user2
      const notification = await createTestNotification({
        recipientId: user2.id,
      });

      // Try to mark as read by user1
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      const result = await markAsRead(notification.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Notification not found');

      // Verify notification is still unread
      const unchanged = await testDb.notification.findUnique({
        where: { id: notification.id },
      });
      expect(unchanged?.readAt).toBeNull();
    });

    it('should return error for non-existent notification', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await markAsRead('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Notification not found');
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await markAsRead('some-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read in database', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      // Create multiple unread notifications
      await createTestNotification({
        recipientId: user.id,
        readAt: null,
        title: 'Notification 1',
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: null,
        title: 'Notification 2',
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: null,
        title: 'Notification 3',
      });

      // Verify all are unread
      const unreadCount = await testDb.notification.count({
        where: { recipientId: user.id, readAt: null },
      });
      expect(unreadCount).toBe(3);

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      // Mark all as read
      const result = await markAllAsRead();

      expect(result.success).toBe(true);

      // Verify all are now read
      const stillUnread = await testDb.notification.count({
        where: { recipientId: user.id, readAt: null },
      });
      expect(stillUnread).toBe(0);

      // Verify all have readAt timestamp
      const allNotifications = await testDb.notification.findMany({
        where: { recipientId: user.id },
      });

      allNotifications.forEach((notif) => {
        expect(notif.readAt).not.toBeNull();
        expect(notif.readAt).toBeInstanceOf(Date);
      });
    });

    it('should not mark other users notifications', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      // Create unread notifications for both users
      await createTestNotification({
        recipientId: user1.id,
        readAt: null,
      });

      await createTestNotification({
        recipientId: user2.id,
        readAt: null,
      });

      // Mark all as read for user1
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      const result = await markAllAsRead();

      expect(result.success).toBe(true);

      // Verify user1's notifications are read
      const user1Unread = await testDb.notification.count({
        where: { recipientId: user1.id, readAt: null },
      });
      expect(user1Unread).toBe(0);

      // Verify user2's notifications are still unread
      const user2Unread = await testDb.notification.count({
        where: { recipientId: user2.id, readAt: null },
      });
      expect(user2Unread).toBe(1);
    });

    it('should handle user with no notifications', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await markAllAsRead();

      expect(result.success).toBe(true);
    });

    it('should not mark already read notifications', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      // Create one unread and one already read notification
      const alreadyReadDate = new Date('2024-01-01');

      await createTestNotification({
        recipientId: user.id,
        readAt: null,
        title: 'Unread',
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: alreadyReadDate,
        title: 'Already Read',
      });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await markAllAsRead();

      expect(result.success).toBe(true);

      // Verify the already-read notification timestamp didn't change
      const alreadyRead = await testDb.notification.findFirst({
        where: { recipientId: user.id, title: 'Already Read' },
      });

      expect(alreadyRead?.readAt?.toISOString()).toBe(
        alreadyReadDate.toISOString()
      );
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await markAllAsRead();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('getUnreadCount', () => {
    it('should return correct unread count from database', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      // Create 2 unread and 1 read notification
      await createTestNotification({
        recipientId: user.id,
        readAt: null,
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: null,
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: new Date(),
      });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await getUnreadCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(2);
    });

    it('should return 0 when all notifications are read', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      // Create only read notifications
      await createTestNotification({
        recipientId: user.id,
        readAt: new Date(),
      });

      await createTestNotification({
        recipientId: user.id,
        readAt: new Date(),
      });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await getUnreadCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('should return 0 when user has no notifications', async () => {
      const user = await createTestUser({ email: 'test@example.com' });

      vi.mocked(auth).mockResolvedValue({ user: { id: user.id } } as any);

      const result = await getUnreadCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('should not count other users notifications', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      // Create unread notifications for both users
      await createTestNotification({
        recipientId: user1.id,
        readAt: null,
      });

      await createTestNotification({
        recipientId: user2.id,
        readAt: null,
      });

      await createTestNotification({
        recipientId: user2.id,
        readAt: null,
      });

      // Get count for user1
      vi.mocked(auth).mockResolvedValue({ user: { id: user1.id } } as any);

      const result = await getUnreadCount();

      expect(result.success).toBe(true);
      expect(result.data).toBe(1); // Only user1's notification
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await getUnreadCount();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });
});
