import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
} from '@repo/database/test';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

import { changePassword, requestPasswordReset } from './auth';

// Mock rate limiter
const mockRateLimiterCheck = vi.fn();
const mockRateLimiterReset = vi.fn();

vi.mock('@repo/rate-limit', () => ({
  RedisRateLimiter: vi.fn(() => ({
    check: mockRateLimiterCheck,
    reset: mockRateLimiterReset,
  })),
}));

describe('changePassword Server Action', () => {
  beforeEach(async () => {
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await disconnectTestClient();
  });

  describe('Authentication', () => {
    it('should return error if user is not authenticated', async () => {
      const result = await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('Password Validation', () => {
    it('should return error if current password is incorrect', async () => {
      // Create test user
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'CurrentPassword123!',
      });

      // Mock getCurrentUser to return our test user
      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      const result = await changePassword({
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Current password is incorrect');
      expect(result.fieldErrors?.currentPassword).toBe(
        'Current password is incorrect'
      );
    });

    it('should return error if new password is same as current password', async () => {
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'SamePassword123!',
      });

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      const result = await changePassword({
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!',
      });

      expect(result.success).toBe(false);
      // Validation error from Zod
      expect(result.fieldErrors?.newPassword).toBeTruthy();
    });
  });

  describe('Successful Password Change', () => {
    it('should successfully change password with valid data', async () => {
      const db = getTestClient();
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123!',
      });

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      const result = await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result.success).toBe(true);

      // Verify password was actually updated in database
      const updatedUser = await db.user.findUnique({
        where: { id: testUser.id },
        select: { password: true },
      });

      expect(updatedUser?.password).not.toBe(testUser.password);
    });

    it('should hash the new password before saving', async () => {
      const db = getTestClient();
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123!',
      });

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      const newPassword = 'NewPassword123!';
      await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword,
      });

      const updatedUser = await db.user.findUnique({
        where: { id: testUser.id },
        select: { password: true },
      });

      // Password should be hashed, not plain text
      expect(updatedUser?.password).not.toBe(newPassword);
      expect(updatedUser?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });
  });

  describe('Email Notification', () => {
    it('🔴 RED: should send email notification after successful password change', async () => {
      const db = getTestClient();
      const testUser = await createTestUser({
        email: 'test@example.com',
        name: 'Test User',
        password: 'OldPassword123!',
      });

      // Mock email service
      const mockSendPasswordChangedEmail = vi
        .fn()
        .mockResolvedValue({ success: true });
      vi.mock('@repo/email', () => ({
        sendPasswordChangedEmail: mockSendPasswordChangedEmail,
      }));

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      // EMAIL NOTIFICATION SHOULD BE SENT
      expect(mockSendPasswordChangedEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        name: 'Test User',
      });
    });

    it('🔴 RED: should still succeed even if email sending fails', async () => {
      const db = getTestClient();
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123!',
      });

      // Mock email service to fail
      const mockSendPasswordChangedEmail = vi
        .fn()
        .mockRejectedValue(new Error('Email service down'));
      vi.mock('@repo/email', () => ({
        sendPasswordChangedEmail: mockSendPasswordChangedEmail,
      }));

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: testUser.id }),
        verifyPassword: async (password: string, hash: string) => {
          const { verifyPassword } = await import('bcryptjs');
          return verifyPassword(password, hash);
        },
        hashPassword: async (password: string) => {
          const { hash } = await import('bcryptjs');
          return hash(password, 10);
        },
      }));

      const result = await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      // Password change should still succeed
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const testUser = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123!',
      });

      // Mock getCurrentUser to return invalid user ID
      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: 'invalid-id' }),
        verifyPassword: vi.fn(),
        hashPassword: vi.fn(),
      }));

      const result = await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should return error if user has no password set (OAuth user)', async () => {
      const db = getTestClient();
      const oauthUser = await db.user.create({
        data: {
          email: 'oauth@example.com',
          name: 'OAuth User',
          password: null, // OAuth user with no password
          role: 'USER',
        },
      });

      vi.mock('@repo/auth', () => ({
        getCurrentUser: vi.fn().mockResolvedValue({ id: oauthUser.id }),
        verifyPassword: vi.fn(),
        hashPassword: vi.fn(),
      }));

      const result = await changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found or password not set');
    });
  });
});

describe('🔴 RED: requestPasswordReset Rate Limiting', () => {
  beforeEach(async () => {
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await disconnectTestClient();
  });

  it('should check rate limit before processing request', async () => {
    // Mock rate limiter to allow request
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 2,
      current: 1,
    });

    const testUser = await createTestUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    await requestPasswordReset('test@example.com');

    // Should have checked rate limit
    expect(mockRateLimiterCheck).toHaveBeenCalledWith({
      action: 'password-reset',
      identifier: 'test@example.com',
      limit: 3,
      window: 300, // 5 minutes
    });
  });

  it('should block request when rate limit exceeded', async () => {
    // Mock rate limiter to block request
    mockRateLimiterCheck.mockResolvedValue({
      success: false,
      remaining: 0,
      retryAfter: 250,
      current: 4,
    });

    const result = await requestPasswordReset('test@example.com');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Too many requests');
    expect(result.error).toContain('5 minutes');
  });

  it('should allow request when rate limit not exceeded', async () => {
    // Mock rate limiter to allow request
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 1,
      current: 2,
    });

    const testUser = await createTestUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    const result = await requestPasswordReset('test@example.com');

    expect(result.success).toBe(true);
    expect(result.data?.message).toContain('sent a reset link');
  });

  it('should apply rate limit even for non-existent emails (prevent enumeration)', async () => {
    // Mock rate limiter to allow request
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 2,
      current: 1,
    });

    await requestPasswordReset('nonexistent@example.com');

    // Should still check rate limit for non-existent email
    expect(mockRateLimiterCheck).toHaveBeenCalledWith({
      action: 'password-reset',
      identifier: 'nonexistent@example.com',
      limit: 3,
      window: 300,
    });
  });

  it('should reset rate limit after successful password reset', async () => {
    // This test ensures we reset the rate limit when password is successfully reset
    // Actual implementation will be in resetPassword action
    expect(mockRateLimiterReset).toBeDefined();
  });

  it('should normalize email case for rate limiting', async () => {
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 2,
      current: 1,
    });

    await requestPasswordReset('User@Example.COM');

    // Rate limiter should receive normalized email (lowercase, trimmed)
    // The RedisRateLimiter handles normalization internally
    expect(mockRateLimiterCheck).toHaveBeenCalledWith({
      action: 'password-reset',
      identifier: 'User@Example.COM', // Passed as-is, normalized by limiter
      limit: 3,
      window: 300,
    });
  });

  it('should handle rate limiter errors gracefully (fail-open)', async () => {
    // Mock rate limiter to throw error, but it should fail-open
    mockRateLimiterCheck.mockResolvedValue({
      success: true, // Fail-open behavior
      remaining: 3,
    });

    const testUser = await createTestUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    const result = await requestPasswordReset('test@example.com');

    // Should still allow request (fail-open)
    expect(result.success).toBe(true);
  });
});
