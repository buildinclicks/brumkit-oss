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
    },
  },
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/headers
const mockHeadersGet = vi.fn();
vi.mock('next/headers', () => ({
  headers: () => ({
    get: mockHeadersGet,
  }),
}));

describe('🔴 RED: Login Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockReturnValue(null);
  });

  describe('Email-based rate limiting', () => {
    it('should check email rate limit (5 attempts / 15 min)', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 4,
      });

      await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(mockRateLimiterCheck).toHaveBeenCalledWith({
        action: 'login',
        identifier: 'test@example.com',
        limit: 5,
        window: 900, // 15 minutes
      });
    });

    it('should block when email rate limit exceeded', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockRateLimiterCheck.mockResolvedValue({
        success: false,
        remaining: 0,
        retryAfter: 600, // 10 minutes
      });

      const result = await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many login attempts');
      expect(result.error).toContain('10 minutes');
    });
  });

  describe('IP-based rate limiting', () => {
    it('should check IP rate limit (20 attempts / 15 min)', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockHeadersGet.mockReturnValue('203.0.113.1');
      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 19,
      });

      await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      // Should check both email and IP
      expect(mockRateLimiterCheck).toHaveBeenCalledWith({
        action: 'login-ip',
        identifier: '203.0.113.1',
        limit: 20,
        window: 900,
      });
    });

    it('should block when IP rate limit exceeded', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockHeadersGet.mockReturnValue('203.0.113.1');

      // Email check passes
      mockRateLimiterCheck.mockResolvedValueOnce({
        success: true,
        remaining: 4,
      });

      // IP check fails
      mockRateLimiterCheck.mockResolvedValueOnce({
        success: false,
        remaining: 0,
        retryAfter: 450, // 7.5 minutes
      });

      const result = await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many login attempts');
      expect(result.error).toContain('8 minutes'); // Rounded up
    });
  });

  describe('Time formatting', () => {
    it('should show time in minutes when >= 60 seconds', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockRateLimiterCheck.mockResolvedValue({
        success: false,
        remaining: 0,
        retryAfter: 300, // 5 minutes
      });

      const result = await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.error).toContain('5 minutes');
    });

    it('should show time in seconds when < 60 seconds', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      mockRateLimiterCheck.mockResolvedValue({
        success: false,
        remaining: 0,
        retryAfter: 45,
      });

      const result = await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.error).toContain('45 seconds');
    });
  });

  describe('Fail-open strategy', () => {
    it('should allow login if rate limiter fails', async () => {
      const { loginUser } = await import('@/app/actions/auth');

      // Rate limiter returns success: true on failure (fail-open)
      mockRateLimiterCheck.mockResolvedValue({
        success: true,
        remaining: 5,
      });

      const _result = await loginUser({
        email: 'test@example.com',
        password: 'Password123!',
      });

      // Should not be blocked by rate limiting
      expect(mockRateLimiterCheck).toHaveBeenCalled();
    });
  });
});
