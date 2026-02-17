# `@repo/rate-limit`

Redis-based rate limiting package for React Masters.

## Features

- ✅ **Dual Redis Support** - Local Redis (dev) + Upstash (production)
- ✅ **Sliding Window** - Atomic INCR-based rate limiting
- ✅ **Fail-Open** - Gracefully handles Redis outages
- ✅ **Case Insensitive** - Normalizes identifiers (email, IP, etc.)
- ✅ **TypeScript** - Full type safety
- ✅ **Tested** - 20 comprehensive tests
- ✅ **Flexible** - Works with any action and identifier

## Installation

```bash
pnpm add @repo/rate-limit
```

## Environment Variables

### Development (Local Redis)

```env
REDIS_URL="redis://localhost:6379"  # Optional, defaults to this
NODE_ENV="development"
```

Requires Docker Redis container running (see `docker/docker-compose.yml`).

### Production (Upstash)

```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXXXxxxxxxxxx"
```

See `docs/setup/upstash-redis-setup.md` for complete setup guide.

## Auto-Detection

The rate limiter automatically chooses the appropriate Redis client:

- **Development** (`NODE_ENV=development`): Uses local Redis via `ioredis`
- **Production**: Uses Upstash Redis via REST API
- **Explicit Configuration**: Can override with constructor options

## Usage

### Basic Rate Limiting

```typescript
import { RedisRateLimiter } from '@repo/rate-limit';

const limiter = new RedisRateLimiter();

// Check rate limit
const result = await limiter.check({
  action: 'password-reset',
  identifier: 'user@example.com',
  limit: 3,
  window: 300, // 5 minutes in seconds
});

if (!result.success) {
  console.log(`Rate limited. Try again in ${result.retryAfter} seconds.`);
  return;
}

// Request allowed
console.log(`Allowed. ${result.remaining} attempts remaining.`);
```

### Different Actions

```typescript
// Password reset - 3 attempts per 5 minutes
await limiter.check({
  action: 'password-reset',
  identifier: 'user@example.com',
  limit: 3,
  window: 300,
});

// Login - 5 attempts per 15 minutes
await limiter.check({
  action: 'login',
  identifier: 'user@example.com',
  limit: 5,
  window: 900,
});

// API requests - 100 requests per hour
await limiter.check({
  action: 'api',
  identifier: request.ip,
  limit: 100,
  window: 3600,
});
```

### Manual Reset

```typescript
// Reset rate limit for a user (e.g., after successful password reset)
await limiter.reset('password-reset', 'user@example.com');
```

### Custom Configuration

```typescript
// Force Upstash (even in development)
const limiter = new RedisRateLimiter({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  prefix: 'myapp', // Default: 'ratelimit'
});
```

### Cleanup (Local Redis Only)

```typescript
// Disconnect when done (important for local Redis in scripts/tests)
await limiter.disconnect();
```

## API

### `RedisRateLimiter`

#### Constructor

```typescript
new RedisRateLimiter(options?: RateLimiterOptions)
```

**Options:**

- `url` - Redis URL (defaults to `UPSTASH_REDIS_REST_URL` or `REDIS_URL`)
- `token` - Redis REST token (for Upstash, defaults to `UPSTASH_REDIS_REST_TOKEN`)
- `prefix` - Key prefix (default: `'ratelimit'`)

#### `check(config: RateLimitConfig): Promise<RateLimitResult>`

Check if an action is allowed under rate limit.

**Config:**

- `action` - Action being rate limited (e.g., `'password-reset'`)
- `identifier` - Identifier for rate limiting (e.g., email, IP)
- `limit` - Maximum number of attempts allowed
- `window` - Time window in seconds

**Result:**

```typescript
{
  success: boolean;       // Whether request is allowed
  remaining: number;      // Remaining attempts in window
  retryAfter?: number;    // Seconds until reset (only when blocked)
  current?: number;       // Current attempt count (for debugging)
}
```

#### `reset(action: string, identifier: string): Promise<void>`

Manually reset rate limit for an identifier.

#### `disconnect(): Promise<void>`

Close Redis connection (important for local Redis in scripts/tests).

## How It Works

### Auto-Detection Logic

1. Checks if `NODE_ENV === 'development'` and no Upstash credentials
2. If true, uses local Redis (ioredis) → `redis://localhost:6379`
3. If Upstash credentials are set, uses Upstash REST API
4. Logs which Redis client is being used

### Rate Limiting Algorithm

1. **Atomic INCR**: Uses Redis `INCR` command for atomic counter increment
2. **Sliding Window**: Sets expiration on first request, subsequent requests only increment
3. **Normalization**: Identifiers are lowercased and trimmed for consistency
4. **Fail-Open**: If Redis is down, requests are allowed (configurable)

### Redis Key Format

```
{prefix}:{action}:{normalized_identifier}
```

Examples:

- `ratelimit:password-reset:user@example.com`
- `ratelimit:login:admin@test.com`
- `myapp:api:192.168.1.1`

## Error Handling

The limiter uses a **fail-open** strategy:

- If Redis is unreachable, requests are **allowed**
- Errors are logged to console
- Your app stays available even if Redis is down

```typescript
// This won't throw - it returns success: true on Redis errors
const result = await limiter.check(config);
```

## Local Development Setup

1. **Start Docker Redis:**

```bash
docker compose -f docker/docker-compose.yml up -d redis
```

2. **Set environment variable (optional):**

```env
NODE_ENV=development
REDIS_URL=redis://localhost:6379  # Default
```

3. **Test connection:**

```bash
docker compose -f docker/docker-compose.yml exec redis redis-cli ping
# Should return: PONG
```

## Production Setup (Upstash)

1. Create Upstash Redis database at https://upstash.com
2. Copy REST API credentials
3. Add to environment variables:

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxx
```

4. Deploy to Vercel (auto-detects production)

## Testing

```bash
pnpm test              # Run tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## Best Practices

### 1. Choose Appropriate Limits

```typescript
// Security-critical actions - stricter limits
password-reset: 3 attempts / 5 minutes
login: 5 attempts / 15 minutes
account-deletion: 1 attempt / 24 hours

// User experience - more lenient
profile-update: 10 attempts / hour
search: 100 requests / minute
```

### 2. Use Meaningful Identifiers

```typescript
// For user actions - use email
identifier: user.email;

// For public endpoints - use IP
identifier: request.headers.get('x-forwarded-for') || request.ip;

// For API keys - use key hash
identifier: hashApiKey(apiKey);
```

### 3. Reset After Success

```typescript
// Reset rate limit after successful password reset
await resetPassword(token, newPassword);
await limiter.reset('password-reset', email);
```

### 4. Show User-Friendly Messages

```typescript
if (!result.success) {
  const minutes = Math.ceil(result.retryAfter! / 60);
  throw new Error(`Too many requests. Try again in ${minutes} minutes.`);
}
```

## Examples

### Next.js Server Action

```typescript
'use server';

import { RedisRateLimiter } from '@repo/rate-limit';

const limiter = new RedisRateLimiter();

export async function requestPasswordReset(email: string) {
  // Check rate limit
  const result = await limiter.check({
    action: 'password-reset',
    identifier: email,
    limit: 3,
    window: 300,
  });

  if (!result.success) {
    return {
      success: false,
      error: 'Too many requests. Try again in 5 minutes.',
    };
  }

  // Process password reset...
  await sendPasswordResetEmail(email);

  return { success: true };
}
```

## Monitoring

### Local Redis (Development)

```bash
# View all rate limit keys
docker compose -f docker/docker-compose.yml exec redis redis-cli KEYS "ratelimit:*"

# Check specific key
docker compose -f docker/docker-compose.yml exec redis redis-cli GET "ratelimit:login:user@example.com"

# Monitor real-time
docker compose -f docker/docker-compose.yml exec redis redis-cli MONITOR
```

### Upstash (Production)

Use Upstash Console to monitor:

- Request counts
- Latency
- Error rates
- Active keys

## Troubleshooting

### "Redis not configured"

**Development:**

- Ensure Docker Redis is running: `docker compose -f docker/docker-compose.yml ps`
- Set `NODE_ENV=development`
- Or set `REDIS_URL=redis://localhost:6379`

**Production:**

- Add Upstash credentials to Vercel environment variables

### "Cannot find module 'ioredis'"

```bash
pnpm install  # Installs ioredis automatically
```

### Rate limit not working

**Local:**

1. Check Redis is running: `docker compose -f docker/docker-compose.yml ps`
2. Test connection: `docker compose -f docker/docker-compose.yml exec redis redis-cli ping`
3. Check keys: `docker compose -f docker/docker-compose.yml exec redis redis-cli KEYS "*"`

**Production:**

1. Check Upstash console for errors
2. Verify environment variables are loaded
3. Check Data Browser for keys

### Wrong Redis being used

Check logs on app start:

- `📦 Using local Redis for rate limiting` → Local
- `☁️  Using Upstash Redis for rate limiting` → Upstash

## Links

- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [ioredis Docs](https://github.com/redis/ioredis)
- [Rate Limiting Strategies](https://redis.io/glossary/rate-limiting/)
- [Setup Guide](../../docs/setup/upstash-redis-setup.md)
