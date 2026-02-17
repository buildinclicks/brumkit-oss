import { Redis as UpstashRedis } from '@upstash/redis';
import type {
  RateLimitConfig,
  RateLimitResult,
  RateLimiterOptions,
} from './types';

// Type for Redis client (either Upstash or ioredis)
type RedisClient = UpstashRedis | any;

/**
 * Redis-based rate limiter
 * Supports both Upstash (production) and local Redis (development)
 */
export class RedisRateLimiter {
  private redis: RedisClient;
  private prefix: string;
  private isUpstash: boolean;

  constructor(options: RateLimiterOptions = {}) {
    this.prefix = options.prefix || 'ratelimit';

    // Try to use local Redis in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    const localRedisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const upstashUrl = options.url || process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = options.token || process.env.UPSTASH_REDIS_REST_TOKEN;

    // Prefer local Redis in development if available
    if (isDevelopment && !upstashUrl && !upstashToken) {
      try {
        // Dynamically import ioredis (only if needed)
        const Redis = require('ioredis');
        this.redis = new Redis(localRedisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy(times: number) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
        this.isUpstash = false;
        console.log('📦 Using local Redis for rate limiting');
      } catch (error) {
        throw new Error(
          'Local Redis is not configured. Install ioredis: pnpm add ioredis'
        );
      }
    } else if (upstashUrl && upstashToken) {
      // Use Upstash in production or if explicitly configured
      this.redis = new UpstashRedis({ url: upstashUrl, token: upstashToken });
      this.isUpstash = true;
      console.log('☁️  Using Upstash Redis for rate limiting');
    } else {
      throw new Error(
        'Redis not configured. Either:\n' +
          '1. Set REDIS_URL for local Redis (development)\n' +
          '2. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (production)'
      );
    }
  }

  /**
   * Check if an action is allowed under rate limit
   */
  async check(config: RateLimitConfig): Promise<RateLimitResult> {
    try {
      const key = this.getKey(config.action, config.identifier);

      let count: number;
      let ttl: number;

      if (this.isUpstash) {
        // Upstash Redis (REST API)
        count = await this.redis.incr(key);
        ttl = await this.redis.ttl(key);

        if (ttl === -1 || ttl === -2) {
          await this.redis.expire(key, config.window);
        }
      } else {
        // Local Redis (ioredis)
        count = await this.redis.incr(key);
        ttl = await this.redis.ttl(key);

        if (ttl === -1 || ttl === -2) {
          await this.redis.expire(key, config.window);
        }
      }

      // Calculate remaining attempts
      const remaining = Math.max(0, config.limit - count);

      // Check if rate limit exceeded
      if (count > config.limit) {
        // Get actual TTL for retry-after
        const currentTTL = this.isUpstash
          ? await this.redis.ttl(key)
          : await this.redis.ttl(key);

        return {
          success: false,
          remaining: 0,
          retryAfter: currentTTL > 0 ? currentTTL : config.window,
          current: count,
        };
      }

      // Request allowed
      return {
        success: true,
        remaining,
        current: count,
      };
    } catch (error) {
      // Fail-open: allow request if Redis is down
      console.error(
        'Rate limit check failed, allowing request (fail-open):',
        error
      );
      return {
        success: true,
        remaining: config.limit,
      };
    }
  }

  /**
   * Manually reset rate limit for an identifier
   */
  async reset(action: string, identifier: string): Promise<void> {
    const key = this.getKey(action, identifier);
    await this.redis.del(key);
  }

  /**
   * Close Redis connection (important for local Redis)
   */
  async disconnect(): Promise<void> {
    if (!this.isUpstash && this.redis.disconnect) {
      await this.redis.disconnect();
    }
  }

  /**
   * Generate Redis key for rate limiting
   */
  private getKey(action: string, identifier: string): string {
    const normalized = this.normalizeIdentifier(identifier);
    return `${this.prefix}:${action}:${normalized}`;
  }

  /**
   * Normalize identifier (lowercase, trim)
   */
  private normalizeIdentifier(identifier: string): string {
    return identifier.toLowerCase().trim();
  }
}
