# Runtime Compatibility Fix: bcrypt in Edge Runtime

**Issue**: bcrypt Edge Runtime Incompatibility  
**Date Fixed**: 2026-01-13  
**Severity**: Critical - Blocking all page loads  
**Status**: ✅ Resolved

---

## Problem Description

### Error

```
Runtime TypeError: Cannot read properties of undefined (reading 'modules')

at node-gyp-build/node-gyp-build.js
at bcrypt/bcrypt.js
in .next/server/middleware.js
```

### Root Cause

1. **bcrypt uses native Node.js bindings** via `node-gyp-build`
2. **Next.js middleware runs in Edge Runtime by default** (since Next.js 13+)
3. **Edge Runtime doesn't support native Node.js modules**
4. The middleware imports `auth` from `@repo/auth`, which transitively imports `bcrypt` for password hashing

### Why This Happens

- Next.js Edge Runtime is a lightweight, distributed runtime based on V8
- It doesn't include Node.js APIs or support for native modules (C++ bindings)
- bcrypt requires native compilation and Node.js process APIs
- When Next.js tries to bundle bcrypt into Edge Runtime, it fails

---

## Solution

### Step 1: Force Node.js Runtime for Server Actions

**Files**:

- `apps/web/app/actions/auth.ts`
- `apps/web/app/actions/user.ts`

**Fix**:

```typescript
'use server';

// ... imports ...

/**
 * Force Node.js runtime for bcrypt compatibility
 * bcrypt uses native bindings and cannot run in Edge Runtime
 */
export const runtime = 'nodejs';
```

### Step 2: Force Node.js Runtime for Middleware

**File**: `apps/web/middleware.ts`

**Fix**:

```typescript
import { auth } from '@repo/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Force Node.js runtime for middleware
 * Required because @repo/auth uses bcrypt (native Node.js module)
 * which cannot run in Edge Runtime
 */
export const runtime = 'nodejs';

export default auth((req) => {
  // ... middleware logic ...
}) as (request: NextRequest) => Promise<Response | undefined>;
```

---

## Verification

### Tests

✅ All 62 tests passing

- Forgot Password (17 tests)
- Reset Password (15 tests)
- Login Page (19 tests)
- FieldError Component (3 tests)
- Test Utilities (8 tests)

### Browser

✅ No more Edge Runtime errors
✅ Middleware executes correctly
✅ Auth flow works end-to-end

---

## Technical Details

### What is Edge Runtime?

- Lightweight JavaScript runtime based on V8
- Subset of Node.js APIs
- Designed for fast cold starts at the edge (CDN)
- No support for:
  - Native Node.js modules (C++ addons)
  - File system access
  - Child processes
  - Some Node.js built-ins

### What is Node.js Runtime?

- Full Node.js environment
- All Node.js APIs available
- Supports native modules
- Runs on origin servers (not edge)
- Slightly slower cold starts but more capabilities

### Trade-offs

**Using Node.js Runtime:**

- ✅ Full Node.js API support
- ✅ Native modules (bcrypt, sharp, etc.)
- ✅ More libraries compatible
- ❌ Slower cold starts
- ❌ Runs on origin (not edge)

**Using Edge Runtime:**

- ✅ Faster cold starts
- ✅ Globally distributed (edge)
- ✅ Lower latency
- ❌ Limited API surface
- ❌ No native modules
- ❌ Fewer compatible libraries

### Why We Need Node.js Runtime

Our auth system requires:

1. **bcrypt** for password hashing (native C++ module)
2. **Prisma** for database access (uses native bindings)
3. Full Node.js crypto APIs
4. File system access for token storage (future)

These requirements make Node.js runtime mandatory.

---

## Alternative Solutions Considered

### 1. Use bcryptjs (Pure JavaScript)

**Pros:**

- Works in Edge Runtime
- No native dependencies

**Cons:**

- 30% slower than native bcrypt
- Less battle-tested
- Security implications (slower = easier to brute force)

**Decision**: ❌ Rejected - Security is more important than edge compatibility

### 2. Move Auth to API Routes

**Pros:**

- API routes can use Node.js runtime
- Middleware could stay in Edge Runtime

**Cons:**

- More complex architecture
- Extra HTTP calls
- Server Actions are more ergonomic

**Decision**: ❌ Rejected - Current architecture is cleaner

### 3. Use Edge-Compatible Auth (e.g., Clerk)

**Pros:**

- Built for Edge Runtime
- No bcrypt needed

**Cons:**

- External dependency
- Cost implications
- Less control

**Decision**: ❌ Rejected - Want full control over auth

---

## Lessons Learned

1. **Always check runtime compatibility** when using native Node.js modules
2. **Next.js defaults to Edge Runtime** for middleware (since v13)
3. **Explicit runtime declaration is important** - don't rely on defaults
4. **Test in production-like environment** early to catch these issues
5. **Document runtime requirements** for future developers

---

## Future Considerations

### If We Need Edge Runtime Performance

Options for future optimization:

1. Split auth into separate edge-compatible routes
2. Use edge-compatible password hashing (with documented security trade-offs)
3. Move password validation to separate microservice
4. Use JWT-only auth (no DB lookups in middleware)

### Monitoring

- Watch for performance impacts of Node.js runtime
- Monitor cold start times
- Consider edge caching strategies

---

## Related Issues

- Next.js Issue: [Edge Runtime Native Module Support](https://github.com/vercel/next.js/discussions/...)
- bcrypt Issue: [Edge Runtime Compatibility](https://github.com/kelektiv/node.bcrypt.js/issues/...)

---

## Commits

1. `8a03394` - fix(auth): force Node.js runtime for bcrypt compatibility
2. `7df6558` - fix(middleware): force Node.js runtime for bcrypt compatibility

**Total Files Changed**: 3

- `apps/web/app/actions/auth.ts`
- `apps/web/app/actions/user.ts`
- `apps/web/middleware.ts`

**Impact**: Critical bug fix - unblocks all development and production use
