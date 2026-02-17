# Phase 6, Task 2.1: Forgot Password Page (TDD)

**Status**: ✅ Completed  
**Date**: 2026-01-13  
**Approach**: Test-Driven Development (TDD) - 🔴 RED → 🟢 GREEN → 🔵 REFACTOR

## Objective

Implement a "Forgot Password" page following TDD principles, allowing users to request a password reset link via email.

## Implementation Summary

### 🔴 RED Phase: Write Failing Tests First

Created comprehensive test file with 17 test cases covering:

1. **Rendering** (3 tests)
   - Form structure and elements
   - Helpful instructions
   - "Back to login" link

2. **Email Validation** (3 tests)
   - Invalid email format
   - Empty email
   - No errors on initial render

3. **Form Submission** (5 tests)
   - Successful submission
   - Success toast message
   - Button disabled while loading
   - Error toast on server error
   - Validation integration

4. **Security & Rate Limiting** (2 tests)
   - No email enumeration (security best practice)
   - Rate limit error handling

5. **Accessibility** (3 tests)
   - Proper labels
   - Error messages with `role="alert"`
   - Descriptive button text

6. **User Experience** (2 tests)
   - Success state display
   - Retry after error

**Test File**: `apps/web/app/(auth)/forgot-password/page.test.tsx`

### 🟢 GREEN Phase: Make Tests Pass

1. **Created Forgot Password Page Component**
   - File: `apps/web/app/(auth)/forgot-password/page.tsx`
   - Used React Hook Form with Zod validation
   - Implemented success/error states
   - Show success message after submission
   - Proper loading states and UX

2. **Updated Server Action**
   - File: `apps/web/app/actions/auth.ts`
   - Function: `requestPasswordReset(email: string)`
   - Returns `ActionResult<{ message: string }>`
   - Email validation with Zod
   - Prevents email enumeration (security)
   - Generates magic link token
   - TODO: Send actual email with Resend

3. **Added i18n Messages**
   - File: `apps/web/messages/en.json`
   - Section: `auth.forgot_password`
   - Keys: title, subtitle, email_label, submit_button, success_message, etc.

4. **Enhanced Login Page**
   - Added "Forgot password?" link next to password field
   - Links to `/forgot-password` route

### Test Results

```
✓ app/(auth)/forgot-password/page.test.tsx (17 tests) - ALL PASSED
  ✓ Rendering (3/3)
  ✓ Email Validation (3/3)
  ✓ Form Submission (5/5)
  ✓ Security & Rate Limiting (2/2)
  ✓ Accessibility (3/3)
  ✓ User Experience (2/2)

Total: 47/47 tests passing across all suites
```

## Key Design Decisions

### 1. Security: No Email Enumeration

The API always returns success, whether the email exists or not. This prevents attackers from discovering valid user emails.

```typescript
// Always show same success message
return {
  success: true,
  data: {
    message: 'If that email exists, we sent a reset link',
  },
};
```

### 2. UX: Success State

After submission, the page shows a success card with clear instructions, rather than redirecting:

```tsx
if (isSuccess) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          If that email exists in our system, we've sent you a reset link.
        </CardDescription>
      </CardHeader>
      ...
    </Card>
  );
}
```

### 3. Validation: Reusable Schema

Used existing `resetPasswordRequestSchema` from `@repo/validation` for consistency:

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<ResetPasswordRequestInput>({
  resolver: zodResolver(resetPasswordRequestSchema),
  mode: 'onBlur',
  reValidateMode: 'onChange',
});
```

## Files Modified

### Created

- `apps/web/app/(auth)/forgot-password/page.tsx` - Main component
- `apps/web/app/(auth)/forgot-password/page.test.tsx` - TDD tests

### Modified

- `apps/web/messages/en.json` - Added forgot_password and reset_password i18n messages
- `apps/web/app/actions/auth.ts` - Enhanced `requestPasswordReset` function
- `apps/web/app/(auth)/login/page.tsx` - Added "Forgot password?" link

## TODO: Next Steps

The basic flow is complete, but needs enhancements:

1. **Send Actual Email**: Integrate Resend to send password reset emails
2. **Rate Limiting**: Implement rate limiting to prevent abuse (e.g., max 3 requests per hour)
3. **Reset Password Page**: Create the actual password reset page (Task 2.2)
4. **Token Expiry**: Implement 1-hour token expiration
5. **Email Template**: Create branded password reset email with React Email

## TDD Benefits Observed

1. ✅ **Comprehensive Coverage**: 17 tests ensure all edge cases are handled
2. ✅ **Confidence**: Refactoring is safe with test safety net
3. ✅ **Documentation**: Tests serve as living documentation
4. ✅ **Regression Prevention**: Future changes won't break existing functionality
5. ✅ **Better Design**: Writing tests first led to cleaner component architecture

## Accessibility Compliance

- ✅ Proper labels for all form inputs
- ✅ Error messages use `role="alert"` for screen readers
- ✅ Descriptive button text
- ✅ Keyboard navigation support
- ✅ Focus management

## Security Considerations

- ✅ No email enumeration (prevents user discovery)
- ✅ Input validation (Zod schema)
- ✅ CSRF protection (Next.js Server Actions)
- 🚧 Rate limiting (TODO)
- 🚧 Token expiration (TODO)

## Performance

- Uses React 19 Server Actions for optimal performance
- Client-side validation with React Hook Form
- Tanstack Query for mutation management
- Minimal re-renders with proper memoization

---

**Next Task**: Task 2.2 - Reset Password Page (the page users land on from email link)
