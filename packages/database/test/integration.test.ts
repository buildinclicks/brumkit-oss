import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  getTestClient,
  disconnectTestClient,
  cleanDatabase,
  createTestUser,
  findUserByEmail,
  countUsers,
} from './utils';

describe('Database Integration Tests', () => {
  const db = getTestClient();

  beforeAll(async () => {
    // Clean database before all tests
    await cleanDatabase();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await cleanDatabase();
    await disconnectTestClient();
  });

  beforeEach(async () => {
    // Clean between each test for isolation
    await cleanDatabase();
  });

  describe('User Operations', () => {
    it('should create a user', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('USER');
    });

    it('should find user by email', async () => {
      const email = 'find@example.com';
      await createTestUser({ email });

      const found = await findUserByEmail(email);

      expect(found).toBeDefined();
      expect(found?.email).toBe(email);
    });

    it('should enforce unique email constraint', async () => {
      const email = 'duplicate@example.com';
      await createTestUser({ email });

      await expect(createTestUser({ email })).rejects.toThrow();
    });

    it('should count users correctly', async () => {
      expect(await countUsers()).toBe(0);

      await createTestUser();
      await createTestUser();

      expect(await countUsers()).toBe(2);
    });
  });

  describe('Notification Operations', () => {
    it('should create a notification for a user', async () => {
      const user = await createTestUser();

      const notification = await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'SYSTEM',
          title: 'Test Notification',
          message: 'This is a test notification',
        },
      });

      expect(notification).toBeDefined();
      expect(notification.id).toBeTruthy();
      expect(notification.recipientId).toBe(user.id);
      expect(notification.type).toBe('SYSTEM');
      expect(notification.readAt).toBeNull();
    });

    it('should cascade delete notifications when user is deleted', async () => {
      const user = await createTestUser();

      await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'SYSTEM',
          title: 'Test 1',
          message: 'Message 1',
        },
      });

      await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'ACCOUNT',
          title: 'Test 2',
          message: 'Message 2',
        },
      });

      const notificationCount = await db.notification.count({
        where: { recipientId: user.id },
      });
      expect(notificationCount).toBe(2);

      await db.user.delete({ where: { id: user.id } });

      const notificationCountAfterDelete = await db.notification.count({
        where: { recipientId: user.id },
      });
      expect(notificationCountAfterDelete).toBe(0);
    });

    it('should mark notification as read', async () => {
      const user = await createTestUser();

      const notification = await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'SYSTEM',
          title: 'Test',
          message: 'Test message',
        },
      });

      expect(notification.readAt).toBeNull();

      const updated = await db.notification.update({
        where: { id: notification.id },
        data: { readAt: new Date() },
      });

      expect(updated.readAt).toBeDefined();
      expect(updated.readAt).toBeInstanceOf(Date);
    });
  });

  describe('Relationships', () => {
    it('should create user with notifications', async () => {
      const user = await createTestUser();

      await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'SYSTEM',
          title: 'Notification 1',
          message: 'Message 1',
        },
      });

      await db.notification.create({
        data: {
          recipientId: user.id,
          type: 'ACCOUNT',
          title: 'Notification 2',
          message: 'Message 2',
        },
      });

      const userWithNotifications = await db.user.findUnique({
        where: { id: user.id },
        include: { notifications: true },
      });

      expect(userWithNotifications?.notifications).toHaveLength(2);
    });
  });
});
