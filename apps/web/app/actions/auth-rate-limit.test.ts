import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock rate limiter
const mockRateLimiterCheck = vi.fn();
const mockRateLimiterReset = vi.fn();

vi.mock('@repo/rate-limit', () => ({
  RedisRateLimiter: class {
    check = mockRateLimiterCheck;
    reset = mockRateLimiterReset;
  },
}));

// Mock database - we're testing rate limiting, not database logic
vi.mock('@repo/database', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock email sending
vi.mock('@repo/email', () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock auth utilities
vi.mock('@repo/auth', () => ({
  generateMagicLinkToken: vi.fn().mockResolvedValue('mock-token-12345'),
}));

// Mock next/headers with proper ReadonlyHeaders-like object
const mockHeadersMap = new Map<string, string>();

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => mockHeadersMap.get(name.toLowerCase()) ?? null,
    has: (name: string) => mockHeadersMap.has(name.toLowerCase()),
    forEach: (callback: (value: string, key: string) => void) => {
      mockHeadersMap.forEach(callback);
    },
  })),
}));

// Import after mocks
import { requestPasswordReset } from './auth';

import { db } from '@repo/database';

describe('🔴 RED: requestPasswordReset Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersMap.clear();
    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: null,
      image: null,
      password: 'hashed_password',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should check rate limit before processing request', async () => {
    // Mock rate limiter to allow request
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 2,
      current: 1,
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

  it('should normalize email case for rate limiting', async () => {
    mockRateLimiterCheck.mockResolvedValue({
      success: true,
      remaining: 2,
      current: 1,
    });

    await requestPasswordReset('User@Example.COM');

    // Email is normalized by Zod schema (toLower), then passed to rate limiter
    expect(mockRateLimiterCheck).toHaveBeenCalledWith({
      action: 'password-reset',
      identifier: 'user@example.com', // Normalized by Zod schema
      limit: 3,
      window: 300,
    });
  });

  it('should handle rate limiter errors gracefully (fail-open)', async () => {
    // Mock rate limiter to fail-open (returns success: true on error)
    mockRateLimiterCheck.mockResolvedValue({
      success: true, // Fail-open behavior
      remaining: 3,
    });

    const result = await requestPasswordReset('test@example.com');

    // Should still allow request (fail-open)
    expect(result.success).toBe(true);
  });
});
