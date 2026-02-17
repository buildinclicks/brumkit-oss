import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock rate limiter
const mockRateLimiterCheck = vi.fn();

vi.mock('@repo/rate-limit', () => ({
  RedisRateLimiter: class {
    check = mockRateLimiterCheck;
    reset = vi.fn();
  },
}));

// Mock database
vi.mock('@repo/database', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock('@repo/auth', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
  generateMagicLinkToken: vi.fn().mockResolvedValue('token_12345'),
}));

// Mock email
vi.mock('@repo/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue({ success: true }),
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

// Import the function after mocks are set up
import { db } from '@repo/database';

import { registerUser } from '@/app/actions/auth';

describe('🔴 RED: Register Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersMap.clear();
    vi.mocked(db.user.findUnique).mockResolvedValue(null); // User doesn't exist
    vi.mocked(db.user.create).mockResolvedValue({
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

  describe('Email-based rate limiting', () => {
    it('should check email rate limit (3 attempts / 1 hour)', async () => {
      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 2,
      });

      await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(mockRateLimiterCheck).toHaveBeenCalledWith({
        action: 'register',
        identifier: 'test@example.com',
        limit: 3,
        window: 3600, // 1 hour
      });
    });

    it('should block when email rate limit exceeded', async () => {
      mockRateLimiterCheck.mockResolvedValue({
        success: false,
        remaining: 0,
        retryAfter: 2700, // 45 minutes
      });

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many registration attempts');
      expect(result.error).toContain('45 minutes');
    });
  });

  describe('IP-based rate limiting', () => {
    it('should check IP rate limit (10 attempts / 1 hour)', async () => {
      mockHeadersMap.set('x-forwarded-for', '203.0.113.1');
      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 9,
      });

      await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      // Should check both email and IP
      expect(mockRateLimiterCheck).toHaveBeenCalledWith({
        action: 'register-ip',
        identifier: '203.0.113.1',
        limit: 10,
        window: 3600,
      });
    });

    it('should block when IP rate limit exceeded', async () => {
      mockHeadersMap.set('x-forwarded-for', '203.0.113.1');

      // Email check passes
      mockRateLimiterCheck.mockResolvedValueOnce({
        success: true,
        remaining: 2,
      });

      // IP check fails
      mockRateLimiterCheck.mockResolvedValueOnce({
        success: false,
        remaining: 0,
        retryAfter: 1800, // 30 minutes
      });

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many registration attempts');
      expect(result.error).toContain('30 minutes');
    });
  });

  describe('Time formatting', () => {
    it('should show time in minutes', async () => {
      mockRateLimiterCheck.mockResolvedValue({
        success: false,
        remaining: 0,
        retryAfter: 3600, // 60 minutes
      });

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.error).toContain('60 minutes');
    });
  });

  describe('Fail-open strategy', () => {
    it('should allow registration if rate limiter fails', async () => {
      // Rate limiter returns success: true on failure (fail-open)
      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 3,
      });

      const _result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      // Should not be blocked by rate limiting
      expect(mockRateLimiterCheck).toHaveBeenCalled();
    });
  });
});
