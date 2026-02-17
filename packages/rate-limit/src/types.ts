/**
 * Rate Limit Package Types
 */

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean;

  /**
   * Number of remaining attempts in the current window
   */
  remaining: number;

  /**
   * Seconds until the rate limit resets (only present when blocked)
   */
  retryAfter?: number;

  /**
   * Current attempt count (for debugging)
   */
  current?: number;
}

/**
 * Configuration for rate limit check
 */
export interface RateLimitConfig {
  /**
   * Action being rate limited (e.g., 'password-reset', 'login')
   */
  action: string;

  /**
   * Identifier for rate limiting (e.g., email, IP address)
   * Will be normalized (lowercased, trimmed)
   */
  identifier: string;

  /**
   * Maximum number of attempts allowed
   */
  limit: number;

  /**
   * Time window in seconds
   */
  window: number;
}

/**
 * Options for creating a rate limiter
 */
export interface RateLimiterOptions {
  /**
   * Redis REST URL from Upstash
   */
  url?: string;

  /**
   * Redis REST token from Upstash
   */
  token?: string;

  /**
   * Key prefix for all rate limit keys (default: 'ratelimit')
   */
  prefix?: string;
}
