# Task 7.2: Login & Register Rate Limiting

**Status:** ✅ Completed  
**Date:** 2026-01-14  
**Approach:** TDD (Test-Driven Development)

## Overview

Implemented comprehensive rate limiting for login and register actions to prevent brute-force attacks and abuse. Both actions enforce dual-layer rate limiting (email + IP) with different thresholds.

## Objectives

1. ✅ Implement rate limiting for `registerUser` action
2. ✅ Implement rate limiting for `loginUser` action (new)
3. ✅ Test email-based and IP-based rate limits
4. ✅ Test time formatting (minutes/seconds)
5. ✅ Test fail-open strategy

## Rate Limit Configuration

### Register (`registerUser`)

- **Email-based:** 3 attempts per 1 hour (strict)
- **IP-based:** 10 attempts per 1 hour (lenient)
- **Rationale:** Prevent repeated registration attempts with same email; allow multiple users from same network

### Login (`loginUser`)

- **Email-based:** 5 attempts per 15 minutes
- **IP-based:** 20 attempts per 15 minutes
- **Rationale:** Balance security with UX; allow legitimate users to retry with typos

## Implementation Details

### 1. `registerUser` Rate Limiting

**Location:** `apps/web/app/actions/auth.ts`

Already existed with rate limiting logic:

- Checks email-based limit first (3 attempts / 1 hour)
- Then checks IP-based limit (10 attempts / 1 hour)
- Returns error with dynamic time message if rate limited
- Uses `formatRetryAfter()` helper for user-friendly messages

### 2. `loginUser` Server Action

**Location:** `apps/web/app/actions/auth.ts` (new function)

Created a new server action for login with rate limiting:

```typescript
export async function loginUser(data: LoginInput): Promise<ActionResult>;
```

**Key features:**

- Validates input with `loginSchema` from `@repo/validation`
- Gets client IP with `getClientIp()` helper
- Checks email-based rate limit (5 attempts / 15 min)
- Checks IP-based rate limit (20 attempts / 15 min)
- Verifies credentials against database
- Returns `ActionResult` for consistent error handling

**Flow:**

1. Validate input with Zod schema
2. Extract client IP from headers
3. Check email rate limit → block if exceeded
4. Check IP rate limit → block if exceeded
5. Verify password against database
6. Return success or error

### 3. Test Files

**Register Rate Limiting Tests:**  
`apps/web/app/actions/auth-register-rate-limit.test.ts`

Tests:

- ✅ Email rate limit check (3 attempts / 1 hour)
- ✅ Blocks when email rate limit exceeded
- ✅ IP rate limit check (10 attempts / 1 hour)
- ✅ Blocks when IP rate limit exceeded
- ✅ Time formatting (minutes)
- ✅ Fail-open strategy

**Login Rate Limiting Tests:**  
`apps/web/app/actions/auth-login-rate-limit.test.ts`

Tests:

- ✅ Email rate limit check (5 attempts / 15 min)
- ✅ Blocks when email rate limit exceeded
- ✅ IP rate limit check (20 attempts / 15 min)
- ✅ Blocks when IP rate limit exceeded
- ✅ Time formatting (minutes when >= 60 seconds)
- ✅ Time formatting (seconds when < 60 seconds)
- ✅ Fail-open strategy

**Password Reset Rate Limiting Tests:**  
`apps/web/app/actions/auth-rate-limit.test.ts`

Tests (from Task 7.1):

- ✅ Rate limit check before processing
- ✅ Blocks when rate limit exceeded
- ✅ Allows when rate limit not exceeded
- ✅ Rate limits even for non-existent emails (prevents enumeration)
- ✅ Normalizes email case for rate limiting
- ✅ Fail-open strategy

### 4. Mock Improvements

All test files now use consistent mocking patterns:

**next/headers mock:**

```typescript
let mockHeadersMap = new Map<string, string>();

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => mockHeadersMap.get(name.toLowerCase()) ?? null,
    has: (name: string) => mockHeadersMap.has(name.toLowerCase()),
    forEach: (callback: (value: string, key: string) => void) => {
      mockHeadersMap.forEach(callback);
    },
  })),
}));
```

**Why this works:**

- Returns a proper `ReadonlyHeaders`-like object
- Supports `get()`, `has()`, `forEach()` methods
- Allows setting headers via `mockHeadersMap.set()` in tests

## TDD Process

### 🔴 RED Phase

1. Created failing tests for register rate limiting
2. Created failing tests for login rate limiting
3. Tests expected `loginUser` function that didn't exist

### 🟢 GREEN Phase

1. Fixed mock issues in `auth-register-rate-limit.test.ts`
   - Added `confirmPassword` to test data
   - Fixed `next/headers` mock
2. Implemented `loginUser` server action
   - Added dual-layer rate limiting
   - Added input validation
   - Added credential verification
3. Fixed mock issues in `auth-login-rate-limit.test.ts`
4. Fixed mock issues in `auth-rate-limit.test.ts`

### 🔵 REFACTOR Phase

- Ensured consistent mocking across all test files
- Used `vi.mocked()` for type-safe mocking
- Separated mock declarations from imports

## Test Results

```bash
✓ auth-register-rate-limit.test.ts (6 tests)
✓ auth-rate-limit.test.ts (6 tests)
✓ auth-login-rate-limit.test.ts (7 tests)

Test Files  3 passed (3)
Tests       19 passed (19)
```

## Files Changed

### New Files

- `apps/web/app/actions/auth-login-rate-limit.test.ts` - Login rate limiting tests

### Modified Files

- `apps/web/app/actions/auth.ts` - Added `loginUser` server action
- `apps/web/app/actions/auth-register-rate-limit.test.ts` - Fixed mocks
- `apps/web/app/actions/auth-rate-limit.test.ts` - Fixed mocks

## Error Messages

### Register Rate Limited

```
"Too many registration attempts. Try again in X minutes."
```

### Login Rate Limited

```
"Too many login attempts. Try again in X minutes."
```

or

```
"Too many login attempts. Try again in X seconds."
```

## Next Steps

✅ Task 7.2 Complete  
→ Next: Task 7.3 - 404 Not Found Page

## Security Considerations

1. **Dual-Layer Protection:** Both email and IP limits prevent various attack vectors
2. **Enumeration Protection:** Rate limits apply even for non-existent emails
3. **Fail-Open Strategy:** System remains available if Redis fails
4. **Email Normalization:** Case-insensitive email matching prevents bypass
5. **Generic Error Messages:** Don't reveal whether email exists

## Lessons Learned

1. **Mock Headers Properly:** `next/headers` returns a complex object, not a plain Map
2. **Module Imports:** Import after mocks to avoid hoisting issues
3. **Type Safety:** Use `vi.mocked()` for better TypeScript support
4. **Consistent Patterns:** Reuse mock patterns across test files
5. **Test Data Completeness:** Ensure all required fields are present (e.g., `confirmPassword`)

## Dependencies

- `@repo/rate-limit` - Redis rate limiter
- `@repo/validation` - Login/Register schemas
- `@repo/database` - User queries
- `@repo/auth` - Password verification
- `next/headers` - Client IP detection
- `@/lib/utils/rate-limit-helpers` - IP detection and time formatting

---

**Task 7.2 Completed Successfully** ✅
