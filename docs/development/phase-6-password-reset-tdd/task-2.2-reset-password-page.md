# Phase 6, Task 2.2: Reset Password Page (TDD)

**Status**: ✅ Completed  
**Date**: 2026-01-13  
**Approach**: Test-Driven Development (TDD) - 🔴 RED → 🟢 GREEN → 🔵 REFACTOR

## Objective

Implement a "Reset Password" page (the page users land on from the email link) following TDD principles, allowing users to set a new password using a secure token.

## Implementation Summary

### 🔴 RED Phase: Write Failing Tests First

Created comprehensive test file with 15 test cases covering:

1. **Rendering** (3 tests)
   - Form structure with password fields
   - Helpful instructions
   - Error state for missing token

2. **Password Validation** (3 tests)
   - Weak password detection
   - Password mismatch detection
   - No errors on initial render

3. **Form Submission** (5 tests)
   - Successful password reset
   - Button disabled while submitting
   - Invalid/expired token handling
   - Server error handling
   - Token verification

4. **Accessibility** (3 tests)
   - Proper labels for inputs
   - Error messages with `role="alert"`
   - Descriptive button text

5. **UX** (2 tests)
   - Password requirements hint
   - Redirect to login after success

**Test File**: `apps/web/app/(auth)/reset-password/page.test.tsx`

### 🟢 GREEN Phase: Make Tests Pass

1. **Created Reset Password Page Component**
   - File: `apps/web/app/(auth)/reset-password/page.tsx`
   - Uses React Hook Form with Zod validation
   - Validates token from URL query params
   - Shows error state if token is missing
   - Proper loading states and UX
   - Field error mapping for password validation

2. **Enhanced Server Action**
   - File: `apps/web/app/actions/auth.ts`
   - Function: `resetPassword(data: ResetPasswordInput)`
   - Returns `ActionResult<{ message: string }>`
   - Full `ResetPasswordInput` validation (password + confirmPassword)
   - Token verification with `verifyMagicLinkToken`
   - Password hashing with bcrypt
   - Comprehensive error handling with Zod

3. **i18n Messages**
   - Section: `auth.reset_password`
   - Keys: title, subtitle, password_label, confirm_password_label, success, invalid_token, expired_token

4. **URL Structure**
   - Route: `/reset-password?token=xxx`
   - Wrapped in `Suspense` for `useSearchParams`
   - Token extracted from query params

### Test Results

```
✓ app/(auth)/reset-password/page.test.tsx (15 tests) - ALL PASSED
  ✓ Rendering (3/3)
  ✓ Password Validation (3/3)
  ✓ Form Submission (5/5)
  ✓ Accessibility (3/3)
  ✓ UX (2/2)

Total: 62/62 tests passing across all suites
```

## Key Design Decisions

### 1. Token Validation in Component

The component checks for the token before rendering the form:

```tsx
const token = searchParams.get('token');

if (!token) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Invalid Reset Link</CardTitle>
        ...
      </CardHeader>
      <CardFooter>
        <Button onClick={() => router.push('/forgot-password')}>
          Request New Reset Link
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 2. Comprehensive Validation

The server action validates:

- Password strength (Zod schema)
- Password match (confirmPassword)
- Token validity (magic link verification)
- User existence

```typescript
const validated = resetPasswordSchema.parse(data);
const email = await verifyMagicLinkToken(token);
```

### 3. Field Error Mapping

Zod validation errors are automatically mapped to form fields:

```typescript
if (error instanceof z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    }
  });
  return { success: false, error: 'Validation failed', fieldErrors };
}
```

### 4. Redirect After Success

After successful password reset, user is redirected to login:

```typescript
onSuccess: () => {
  toast.success('Password Reset Successfully');
  router.push('/login');
};
```

## Files Modified

### Created

- `apps/web/app/(auth)/reset-password/page.tsx` - Main component
- `apps/web/app/(auth)/reset-password/page.test.tsx` - TDD tests

### Modified

- `apps/web/app/actions/auth.ts` - Enhanced `resetPassword` function
- `apps/web/messages/en.json` - Added reset_password i18n messages

## Complete Password Reset Flow

### User Journey:

1. User clicks "Forgot password?" on login page
2. User enters email on forgot-password page
3. System sends reset link via email (TODO: integrate Resend)
4. User clicks link in email → lands on `/reset-password?token=xxx`
5. If token is valid, user sees password reset form
6. User enters new password (validated for strength)
7. User confirms password (must match)
8. System updates password in database
9. User is redirected to login page with success message

### Current Status:

- ✅ Forgot Password Page (17 tests)
- ✅ Reset Password Page (15 tests)
- 🚧 Email sending (TODO: integrate Resend)
- 🚧 Rate limiting (TODO)

## TDD Benefits Observed

1. ✅ **Edge Cases Covered**: Token missing, invalid, expired - all tested
2. ✅ **Confidence**: 32 tests (17 + 15) ensure password reset flow works
3. ✅ **Documentation**: Tests explain expected behavior clearly
4. ✅ **Refactoring Safety**: Can improve code without breaking functionality
5. ✅ **Better API Design**: TDD led to proper error handling and field error mapping

## Accessibility Compliance

- ✅ Proper labels for password inputs
- ✅ Error messages use `role="alert"` for screen readers
- ✅ Descriptive button text
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Password requirements clearly stated

## Security Considerations

- ✅ Token verification (magic link)
- ✅ Password strength validation (Zod)
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection (Next.js Server Actions)
- ✅ Input sanitization
- 🚧 Token expiration (1 hour - TODO: enforce in DB)
- 🚧 Rate limiting (TODO)

## Performance

- Uses React 19 Server Actions for optimal performance
- Client-side validation with React Hook Form
- Tanstack Query for mutation management
- Suspense for `useSearchParams` (Next.js requirement)
- Minimal re-renders

---

**Next Steps**:

1. Task 2.3 - Integrate Resend for email sending
2. Task 2.4 - Add rate limiting for password reset requests
3. Task 3 - Profile/Settings Page (TDD)
4. Task 4 - Error Pages (TDD)
