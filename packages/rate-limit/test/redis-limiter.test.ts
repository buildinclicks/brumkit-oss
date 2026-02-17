import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RedisRateLimiter } from '../src/redis-limiter';
import type { RateLimitConfig } from '../src/types';

// Mock Upstash Redis
const mockRedis = {
  incr: vi.fn(),
  expire: vi.fn(),
  ttl: vi.fn(),
  del: vi.fn(),
};

vi.mock('@upstash/redis', () => {
  return {
    Redis: class {
      constructor() {
        return mockRedis;
      }
    },
  };
});

describe('🔴 RED: RedisRateLimiter', () => {
  let rateLimiter: RedisRateLimiter;

  const defaultConfig: RateLimitConfig = {
    action: 'password-reset',
    identifier: 'test@example.com',
    limit: 3,
    window: 300, // 5 minutes
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    rateLimiter = new RedisRateLimiter({
      url: 'http://localhost:8079',
      token: 'test-token',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('First Attempt', () => {
    it('should allow first attempt', async () => {
      // Mock Redis responses
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(-1);

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.current).toBe(1);
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com'
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com',
        300
      );
    });
  });

  describe('Multiple Attempts', () => {
    it('should allow up to 3 attempts', async () => {
      // Attempt 1
      mockRedis.incr.mockResolvedValueOnce(1);
      mockRedis.ttl.mockResolvedValue(300);
      const result1 = await rateLimiter.check(defaultConfig);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(2);

      // Attempt 2
      mockRedis.incr.mockResolvedValueOnce(2);
      const result2 = await rateLimiter.check(defaultConfig);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);

      // Attempt 3
      mockRedis.incr.mockResolvedValueOnce(3);
      const result3 = await rateLimiter.check(defaultConfig);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it('should block 4th attempt within window', async () => {
      mockRedis.incr.mockResolvedValue(4);
      mockRedis.ttl.mockResolvedValue(250); // 4 minutes 10 seconds remaining

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBe(250);
      expect(result.current).toBe(4);
    });
  });

  describe('Remaining Attempts', () => {
    it('should show correct remaining attempts', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      const result = await rateLimiter.check(defaultConfig);

      expect(result.remaining).toBe(2);
    });

    it('should show 0 remaining when at limit', async () => {
      mockRedis.incr.mockResolvedValue(3);
      mockRedis.ttl.mockResolvedValue(300);

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });
  });

  describe('Retry After', () => {
    it('should show retry-after time when blocked', async () => {
      mockRedis.incr.mockResolvedValue(4);
      mockRedis.ttl.mockResolvedValue(180); // 3 minutes

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(false);
      expect(result.retryAfter).toBe(180);
    });

    it('should not show retry-after when allowed', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });
  });

  describe('Window Expiration', () => {
    it('should reset after window expires', async () => {
      // First attempt - key doesn't exist (TTL = -1 or -2)
      mockRedis.incr.mockResolvedValueOnce(1);
      mockRedis.ttl.mockResolvedValueOnce(-1);

      const result = await rateLimiter.check(defaultConfig);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
      expect(mockRedis.expire).toHaveBeenCalled();
    });
  });

  describe('Case Sensitivity', () => {
    it('should be case-insensitive for email', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      // Try with different casing
      const config1 = { ...defaultConfig, identifier: 'User@Example.COM' };
      await rateLimiter.check(config1);

      const config2 = { ...defaultConfig, identifier: 'user@example.com' };
      await rateLimiter.check(config2);

      // Should use same key (normalized)
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:password-reset:user@example.com'
      );
      expect(mockRedis.incr).toHaveBeenCalledTimes(2);
    });

    it('should trim whitespace from identifier', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      const config = { ...defaultConfig, identifier: '  test@example.com  ' };
      await rateLimiter.check(config);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com'
      );
    });
  });

  describe('Different Actions', () => {
    it('should handle different actions separately', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      // Password reset action
      const resetConfig = { ...defaultConfig, action: 'password-reset' };
      await rateLimiter.check(resetConfig);

      // Login action
      const loginConfig = { ...defaultConfig, action: 'login' };
      await rateLimiter.check(loginConfig);

      // Should create different keys
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com'
      );
      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:login:test@example.com'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis connection errors gracefully (fail-open)', async () => {
      mockRedis.incr.mockRejectedValue(new Error('Redis connection failed'));

      const result = await rateLimiter.check(defaultConfig);

      // Should allow request (fail-open)
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(defaultConfig.limit);
    });

    it('should log errors when Redis fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockRedis.incr.mockRejectedValue(new Error('Network error'));

      await rateLimiter.check(defaultConfig);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Rate limit check failed, allowing request (fail-open):',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Atomic Operations', () => {
    it('should use atomic INCR operation', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      await rateLimiter.check(defaultConfig);

      // INCR is atomic in Redis
      expect(mockRedis.incr).toHaveBeenCalledTimes(1);
    });

    it('should set TTL after first increment', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(-1); // Key has no expiration

      await rateLimiter.check(defaultConfig);

      expect(mockRedis.expire).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com',
        300
      );
    });

    it('should not reset TTL on subsequent requests', async () => {
      mockRedis.incr.mockResolvedValue(2);
      mockRedis.ttl.mockResolvedValue(250); // Already has TTL

      await rateLimiter.check(defaultConfig);

      // Should not call expire again
      expect(mockRedis.expire).not.toHaveBeenCalled();
    });
  });

  describe('Reset Functionality', () => {
    it('should allow manual reset of rate limit', async () => {
      mockRedis.del.mockResolvedValue(1);

      await rateLimiter.reset('password-reset', 'test@example.com');

      expect(mockRedis.del).toHaveBeenCalledWith(
        'ratelimit:password-reset:test@example.com'
      );
    });

    it('should normalize identifier when resetting', async () => {
      mockRedis.del.mockResolvedValue(1);

      await rateLimiter.reset('password-reset', 'User@Example.COM');

      expect(mockRedis.del).toHaveBeenCalledWith(
        'ratelimit:password-reset:user@example.com'
      );
    });
  });

  describe('Key Generation', () => {
    it('should generate correct Redis key format', async () => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      await rateLimiter.check({
        action: 'login',
        identifier: 'user@test.com',
        limit: 5,
        window: 600,
      });

      expect(mockRedis.incr).toHaveBeenCalledWith(
        'ratelimit:login:user@test.com'
      );
    });

    it('should support custom prefix', async () => {
      const customLimiter = new RedisRateLimiter({
        url: 'http://localhost:8079',
        token: 'test-token',
        prefix: 'myapp',
      });

      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(300);

      await customLimiter.check(defaultConfig);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        'myapp:password-reset:test@example.com'
      );
    });
  });
});
