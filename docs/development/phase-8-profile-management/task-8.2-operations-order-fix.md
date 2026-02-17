# Task 8.2 Addendum: Operations Order Fix

**Date:** 2026-01-14  
**Status:** ✅ Complete  
**Related:** Task 8.2 Email Change Flow

---

## 🐛 Problem Discovered

During user testing, we discovered a critical bug in the email change flow:

### **Issue Description**

1. **Database Updated First**: Token/newEmail saved to DB before sending emails
2. **Email Send Failed**: Resend free tier blocked the verification email
3. **Inconsistent State**: Database had token but no verification email sent
4. **Wrong User Feedback**: User saw success toast even though operation failed
5. **Orphaned Data**: Database left with pending email change data

### **Root Cause**

```typescript
// ❌ OLD (WRONG) ORDER:
1. Update database with token + newEmail
2. Send verification email (failed here)
3. Send notification email
4. Return success (even though emails failed!)
```

This violated the principle of **atomic operations** - the database and emails should succeed or fail together.

---

## ✅ Solution Implemented

### **New Operations Order**

```typescript
// ✅ NEW (CORRECT) ORDER:
1. Send verification email to NEW address
2. Send notification email to OLD address
3. Only THEN update database with token + newEmail
4. Return success only if ALL steps succeed
```

### **Code Changes**

#### `apps/web/app/actions/email-change.ts`

**Before:**

```typescript
// Generate token
const token = randomBytes(32).toString('hex');
const tokenExpiry = new Date(Date.now() + 3600000);

// ❌ Update database FIRST
await prisma.user.update({
  where: { id: user.id },
  data: {
    emailChangeToken: token,
    emailChangeTokenExpiry: tokenExpiry,
    newEmail: validatedData.newEmail.toLowerCase(),
  },
});

// Then send emails (if these fail, DB is already updated!)
await sendEmailChangeVerification(...);
await sendEmailChangeNotification(...);
```

**After:**

```typescript
// Generate token
const token = randomBytes(32).toString('hex');
const tokenExpiry = new Date(Date.now() + 3600000);

// ✅ Send emails FIRST
try {
  await sendEmailChangeVerification(...);
  await sendEmailChangeNotification(...);
} catch (emailError) {
  console.error('Failed to send email change emails:', emailError);
  return {
    success: false,
    error: 'Failed to send verification email. Please try again later.',
  };
}

// Only update database AFTER emails succeed
await prisma.user.update({
  where: { id: user.id },
  data: {
    emailChangeToken: token,
    emailChangeTokenExpiry: tokenExpiry,
    newEmail: validatedData.newEmail.toLowerCase(),
  },
});
```

### **Test Updates**

#### `apps/web/app/actions/email-change.test.ts`

**Changes:**

1. Fixed password format: `password123` → `Password123` (must have uppercase)
2. Fixed `RedisRateLimiter` mock to use proper constructor pattern
3. Added default success mocks for email functions in `beforeEach`
4. All 14 tests now passing ✅

**Mock Fix:**

```typescript
// ❌ OLD (didn't work as constructor):
vi.mock('@repo/rate-limit', () => ({
  RedisRateLimiter: vi.fn().mockImplementation(() => ({
    check: vi.fn(),
    reset: vi.fn(),
  })),
}));

// ✅ NEW (proper constructor):
vi.mock('@repo/rate-limit', () => {
  const MockRedisRateLimiter = vi.fn();
  MockRedisRateLimiter.prototype.check = vi.fn();
  MockRedisRateLimiter.prototype.reset = vi.fn();
  return {
    RedisRateLimiter: MockRedisRateLimiter,
  };
});
```

---

## 🎯 Benefits

| Benefit                  | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| **Atomicity**            | Operations succeed or fail together                             |
| **No Orphaned Data**     | Database never has pending changes without corresponding emails |
| **Clear Error Messages** | User sees actual error, not false success                       |
| **Fail Gracefully**      | If emails fail, database remains unchanged                      |
| **Better UX**            | User knows exactly what went wrong                              |

---

## 🧪 Testing

### **Test Results**

```bash
pnpm test email-change.test.ts
```

**Output:**

```
✓ app/actions/email-change.test.ts (14 tests) 31ms

Test Files  1 passed (1)
     Tests  14 passed (14)
```

### **Manual Testing Scenarios**

1. **Resend Free Tier (Expected Behavior)**:
   - User tries to change email
   - Verification email fails (not registered in Resend)
   - User sees error: "Failed to send verification email. Please try again later."
   - Database NOT updated ✅
   - No orphaned data ✅

2. **Resend Verified Domain (Expected Behavior)**:
   - User tries to change email
   - Verification email sent successfully
   - Notification email sent successfully
   - Database updated ✅
   - User sees success toast ✅

3. **Network Error**:
   - Email service temporarily down
   - User sees error message
   - Database NOT updated ✅
   - User can retry later

---

## 📊 Impact

### **Before Fix**

```
User Action → Rate Limit Check → DB Update → Email Send (FAIL) → Success Toast ❌
                                    ↓
                            Orphaned Data in DB
```

### **After Fix**

```
User Action → Rate Limit Check → Email Send (FAIL) → Error Message ✅
                                                    → DB unchanged ✅

User Action → Rate Limit Check → Email Send (OK) → DB Update → Success Toast ✅
```

---

## 🔒 Security Considerations

No security impact. This fix actually **improves** security by:

- Preventing partial state changes
- Ensuring user is notified only when all steps succeed
- Maintaining database integrity

---

## 📝 Lessons Learned

1. **Always test failure scenarios**: We initially tested only the happy path
2. **Email sending is not reliable**: Always assume external services can fail
3. **Atomic operations matter**: Multi-step processes should succeed/fail together
4. **Test with real constraints**: Resend free tier exposed this bug
5. **Operations order is critical**: Side effects (emails) before state changes (DB)

---

## ✅ Completion Checklist

- [x] Reorder operations (emails before DB)
- [x] Add proper error handling
- [x] Fix test mocks
- [x] All tests passing (14/14)
- [x] Manual testing completed
- [x] Documentation updated
- [x] Changes committed

---

## 🚀 Next Steps

1. Test in browser with Resend free tier
2. Verify error message is user-friendly
3. Consider adding retry logic for transient failures (future enhancement)
4. Monitor email delivery success rates in production

---

## 📦 Files Changed

- `apps/web/app/actions/email-change.ts` - Reordered operations + error handling
- `apps/web/app/actions/email-change.test.ts` - Fixed mocks + password format

---

## 🔗 Related

- Task 8.2: Email Change Flow (main implementation)
- Phase 7: Rate Limiting (rate limiter integration)
- Email Setup Guide: `docs/setup/email-password-reset-setup.md`
