/**
 * Email Change Server Actions - Integration Tests
 *
 * Tests email change server actions with real test database.
 * Following TDD principles with proper database setup and cleanup.
 *
 * Test Coverage:
 * - Request email change with password confirmation
 * - Verify email change with token
 * - Token generation and expiry
 * - Security validations (password, email uniqueness)
 * - Rate limiting
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

// Mock database to use test client - must be before any imports that use it
vi.mock('@repo/database', async () => {
  const { getTestClient } = await import('@repo/database/test');
  return {
    prisma: getTestClient(),
  };
});

// Mock external dependencies
vi.mock('@repo/email', () => ({
  sendEmailChangeVerification: vi.fn(),
  sendEmailChangeNotification: vi.fn(),
}));

vi.mock('@repo/rate-limit', () => {
  const MockRedisRateLimiter = vi.fn();
  MockRedisRateLimiter.prototype.check = vi.fn();
  MockRedisRateLimiter.prototype.reset = vi.fn();
  return {
    RedisRateLimiter: MockRedisRateLimiter,
  };
});

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

vi.mock('@repo/auth', async () => {
  const actual = await vi.importActual('@repo/auth');
  return {
    ...actual,
    auth: vi.fn(),
  };
});

vi.mock('@/lib/utils/rate-limit-helpers', () => ({
  getClientIp: vi.fn(() => '127.0.0.1'),
  formatRetryAfter: vi.fn((seconds: number) => `${seconds} seconds`),
}));

import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
} from '@repo/database/test';
import {
  sendEmailChangeVerification,
  sendEmailChangeNotification,
} from '@repo/email';
import { RedisRateLimiter } from '@repo/rate-limit';
import { auth, verifyPassword } from '@repo/auth';

import { requestEmailChange, verifyEmailChange } from './email-change';

describe('Email Change Server Actions - Integration Tests', () => {
  const testDb = getTestClient();

  beforeEach(async () => {
    // Clean database before each test for isolation
    await cleanDatabase();
    vi.clearAllMocks();

    // Mock email functions to resolve successfully by default
    vi.mocked(sendEmailChangeVerification).mockResolvedValue(undefined as any);
    vi.mocked(sendEmailChangeNotification).mockResolvedValue(undefined as any);

    // Mock rate limiter to pass by default
    RedisRateLimiter.prototype.check = vi
      .fn()
      .mockResolvedValue({ success: true });
  });

  afterAll(async () => {
    // Clean up and disconnect after all tests
    await cleanDatabase();
    await disconnectTestClient();
  });

  describe('requestEmailChange', () => {
    it('should send verification email to new email address', async () => {
      // Create test user with password
      const user = await createTestUser({
        email: 'old@example.com',
        name: 'John Doe',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(true);
      expect(sendEmailChangeVerification).toHaveBeenCalledWith({
        email: 'new@example.com',
        token: expect.any(String),
        userName: 'John Doe',
      });
    });

    it('should send notification to old email address', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
        name: 'John Doe',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(true);
      expect(sendEmailChangeNotification).toHaveBeenCalledWith({
        email: 'old@example.com',
        userName: 'John Doe',
        newEmail: 'new@example.com',
      });
    });

    it('should generate secure token and set expiry (1 hour)', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      const beforeRequest = Date.now();
      await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'Password123!',
      });

      // Verify token and expiry in database
      const updatedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });

      expect(updatedUser?.emailChangeToken).toBeTruthy();
      expect(updatedUser?.emailChangeToken).toHaveLength(64); // 32 bytes hex = 64 chars
      expect(updatedUser?.emailChangeTokenExpiry).toBeInstanceOf(Date);
      expect(updatedUser?.newEmail).toBe('new@example.com');

      // Verify expiry is ~1 hour from now
      const expiryTime = updatedUser!.emailChangeTokenExpiry!.getTime();
      const oneHourFromNow = beforeRequest + 3600000;
      const timeDiff = Math.abs(expiryTime - oneHourFromNow);
      expect(timeDiff).toBeLessThan(2000); // Within 2 seconds
    });

    it('should validate password before processing', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      // Wrong password
      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'WrongPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Incorrect password');
      expect(sendEmailChangeVerification).not.toHaveBeenCalled();

      // Verify database was not updated
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.emailChangeToken).toBeNull();
    });

    it('should reject invalid password', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'WrongPassword123!',
      });

      expect(result.success).toBe(false);

      // Verify no database changes
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.emailChangeToken).toBeNull();
      expect(unchangedUser?.newEmail).toBeNull();
    });

    it('should reject same email as current', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      const result = await requestEmailChange({
        newEmail: 'old@example.com', // Same as current
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('different');

      // Verify no database changes
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.emailChangeToken).toBeNull();
    });

    it('should reject already-used email', async () => {
      const user1 = await createTestUser({
        email: 'old@example.com',
      });

      const user2 = await createTestUser({
        email: 'existing@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user1.id, email: user1.email },
      } as any);

      const result = await requestEmailChange({
        newEmail: 'existing@example.com', // Already taken by user2
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already in use');

      // Verify no database changes
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user1.id },
      });
      expect(unchangedUser?.emailChangeToken).toBeNull();
    });

    it('should apply rate limiting (3 per hour)', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);

      RedisRateLimiter.prototype.check = vi.fn().mockResolvedValue({
        success: false,
        retryAfter: 3600,
      });

      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many');
      expect(RedisRateLimiter.prototype.check).toHaveBeenCalledWith({
        action: 'email-change',
        identifier: expect.any(String),
        limit: 3,
        window: 3600,
      });

      // Verify no database changes
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.emailChangeToken).toBeNull();
    });

    it('should return error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const result = await requestEmailChange({
        newEmail: 'new@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Authentication required');
    });
  });

  describe('verifyEmailChange', () => {
    it('should update user email on valid token', async () => {
      // Create user with pending email change
      const user = await createTestUser({
        email: 'old@example.com',
        name: 'John Doe',
      });

      const token = 'valid_token_123';
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with token
      await testDb.user.update({
        where: { id: user.id },
        data: {
          emailChangeToken: token,
          emailChangeTokenExpiry: tokenExpiry,
          newEmail: 'new@example.com',
        },
      });

      const result = await verifyEmailChange({
        token: token,
      });

      expect(result.success).toBe(true);

      // Verify email was updated and token fields cleared
      const updatedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });

      expect(updatedUser?.email).toBe('new@example.com');
      expect(updatedUser?.emailChangeToken).toBeNull();
      expect(updatedUser?.emailChangeTokenExpiry).toBeNull();
      expect(updatedUser?.newEmail).toBeNull();
    });

    it('should clear token fields after successful change', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      const token = 'valid_token_456';

      await testDb.user.update({
        where: { id: user.id },
        data: {
          emailChangeToken: token,
          emailChangeTokenExpiry: new Date(Date.now() + 3600000),
          newEmail: 'new@example.com',
        },
      });

      await verifyEmailChange({
        token: token,
      });

      const updatedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });

      expect(updatedUser?.emailChangeToken).toBeNull();
      expect(updatedUser?.emailChangeTokenExpiry).toBeNull();
      expect(updatedUser?.newEmail).toBeNull();
    });

    it('should invalidate old sessions after email change', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      const token = 'valid_token_789';

      // Create some sessions for the user
      await testDb.session.create({
        data: {
          sessionToken: 'session_1',
          userId: user.id,
          expires: new Date(Date.now() + 86400000),
        },
      });

      await testDb.session.create({
        data: {
          sessionToken: 'session_2',
          userId: user.id,
          expires: new Date(Date.now() + 86400000),
        },
      });

      await testDb.user.update({
        where: { id: user.id },
        data: {
          emailChangeToken: token,
          emailChangeTokenExpiry: new Date(Date.now() + 3600000),
          newEmail: 'new@example.com',
        },
      });

      await verifyEmailChange({
        token: token,
      });

      // Verify all sessions were deleted
      const remainingSessions = await testDb.session.count({
        where: { userId: user.id },
      });

      expect(remainingSessions).toBe(0);
    });

    it('should reject invalid token', async () => {
      const result = await verifyEmailChange({
        token: 'invalid_token',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject expired token', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      const token = 'expired_token';

      await testDb.user.update({
        where: { id: user.id },
        data: {
          emailChangeToken: token,
          emailChangeTokenExpiry: new Date(Date.now() - 1000), // Expired 1 second ago
          newEmail: 'new@example.com',
        },
      });

      const result = await verifyEmailChange({
        token: token,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('expired');

      // Verify email was NOT changed
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.email).toBe('old@example.com');
    });

    it('should reject already-used token (no newEmail)', async () => {
      const user = await createTestUser({
        email: 'old@example.com',
      });

      const token = 'used_token';

      await testDb.user.update({
        where: { id: user.id },
        data: {
          emailChangeToken: token,
          emailChangeTokenExpiry: new Date(Date.now() + 3600000),
          newEmail: null, // Token already used (newEmail cleared)
        },
      });

      const result = await verifyEmailChange({
        token: token,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('used');

      // Verify email was NOT changed
      const unchangedUser = await testDb.user.findUnique({
        where: { id: user.id },
      });
      expect(unchangedUser?.email).toBe('old@example.com');
    });
  });
});
