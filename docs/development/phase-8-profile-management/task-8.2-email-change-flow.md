# Task 8.2: Email Change Flow (Request + Verification)

**Goal:** Implement secure email change functionality with password confirmation and dual email notifications.

**Status:** 🔴 RED Phase - Writing Tests

---

## Requirements

### Functional Requirements

1. **Password Confirmation**
   - User must enter current password to request email change
   - Password validation before processing request

2. **Email Verification**
   - Send verification link to NEW email
   - Token-based verification (expires in 1 hour)
   - Email change only completes after verification

3. **Dual Notifications**
   - **Old Email:** Security notification that email is being changed
   - **New Email:** Verification link to confirm change

4. **Rate Limiting**
   - Action: `email-change`
   - Limit: 3 attempts per hour per user
   - Separate from other rate limits

5. **Security**
   - Invalidate existing sessions after email change
   - Prevent changing to already-used email
   - Token single-use only

### Non-Functional Requirements

- ✅ Follow TDD workflow
- ✅ Use `.cursor/rules` patterns
- ✅ Comprehensive test coverage
- ✅ Accessible UI
- ✅ Clear user feedback

---

## Technical Design

### Database Schema Changes

```prisma
model User {
  // ... existing fields
  emailChangeToken: String?   @unique
  emailChangeTokenExpiry: DateTime?
  newEmail: String?
}
```

### Validation Schemas

```typescript
// Request email change
requestEmailChangeSchema = z.object({
  newEmail: z.string().email(),
  password: z.string(),
});

// Verify email change
verifyEmailChangeSchema = z.object({
  token: z.string(),
});
```

### Server Actions

1. `requestEmailChange(newEmail, password)` → Send verification email
2. `verifyEmailChange(token)` → Complete email change

### Email Templates

1. `email-change-verification.tsx` → Sent to NEW email
2. `email-change-notification.tsx` → Sent to OLD email

---

## 🔴 RED: Test Plan

### Component Tests

**File:** `apps/web/app/(dashboard)/profile/email-change-form.test.tsx`

1. **Rendering**
   - [ ] Should render email change form
   - [ ] Should show current email (read-only)
   - [ ] Should have new email and password inputs
   - [ ] Should have submit button

2. **Form Validation**
   - [ ] Should validate new email format
   - [ ] Should require password
   - [ ] Should prevent changing to same email
   - [ ] Should show validation errors

3. **Form Submission**
   - [ ] Should show loading state during submission
   - [ ] Should show success message on request
   - [ ] Should show error message on failure
   - [ ] Should handle rate limit errors
   - [ ] Should handle "email already in use" error

4. **Accessibility**
   - [ ] Should have proper labels
   - [ ] Should show errors with alerts
   - [ ] Should disable inputs during loading

### Server Action Tests

**File:** `apps/web/app/actions/email-change.test.ts`

1. **Request Email Change**
   - [ ] Should send verification email to new email
   - [ ] Should send notification to old email
   - [ ] Should generate secure token
   - [ ] Should set token expiry (1 hour)
   - [ ] Should validate password
   - [ ] Should reject invalid password
   - [ ] Should reject same email
   - [ ] Should reject already-used email
   - [ ] Should apply rate limiting

2. **Verify Email Change**
   - [ ] Should update user email
   - [ ] Should clear token fields
   - [ ] Should invalidate old sessions
   - [ ] Should reject invalid token
   - [ ] Should reject expired token
   - [ ] Should reject already-used token

### Email Template Tests

**Files:**

- `packages/email/src/templates/email-change-verification.test.tsx`
- `packages/email/src/templates/email-change-notification.test.tsx`

1. **Verification Email**
   - [ ] Should render with verification link
   - [ ] Should include new email address
   - [ ] Should show expiry time

2. **Notification Email**
   - [ ] Should render to old email
   - [ ] Should show new email address
   - [ ] Should include security message

---

## 🟢 GREEN: Implementation Plan

1. **Database Migration**
   - Add email change fields to User model
   - Generate and apply migration

2. **Validation Schemas**
   - Create in `packages/validation`
   - Add error messages to i18n

3. **Server Actions**
   - Implement `requestEmailChange`
   - Implement `verifyEmailChange`
   - Add rate limiting

4. **Email Templates**
   - Create React Email templates
   - Add email service functions

5. **UI Components**
   - Create `EmailChangeForm` component
   - Add to profile page
   - Create verification page

---

## 🔵 REFACTOR: Improvement Areas

_To be identified after GREEN phase_

---

## Testing Strategy

1. **Unit Tests:** Validation schemas, utilities
2. **Integration Tests:** Server actions with mocked database
3. **Component Tests:** Form behavior and user interactions
4. **E2E Considerations:** Token generation, email sending

---

## Files to Create

### Tests (RED Phase)

- `apps/web/app/(dashboard)/profile/email-change-form.test.tsx`
- `apps/web/app/actions/email-change.test.ts`
- `packages/email/src/templates/email-change-verification.test.tsx`
- `packages/email/src/templates/email-change-notification.test.tsx`

### Implementation (GREEN Phase)

- `packages/database/prisma/migrations/xxx-add-email-change-fields.sql`
- `packages/validation/src/schemas/email-change.schema.ts`
- `apps/web/app/actions/email-change.ts`
- `packages/email/src/templates/email-change-verification.tsx`
- `packages/email/src/templates/email-change-notification.tsx`
- `apps/web/app/(dashboard)/profile/email-change-form.tsx`
- `apps/web/app/(auth)/verify-email-change/page.tsx`
- `apps/web/messages/en.json` (add email change messages)

---

## Success Criteria

- [ ] All tests passing
- [ ] TDD cycle completed (RED → GREEN → REFACTOR)
- [ ] Password confirmation working
- [ ] Dual email notifications sent
- [ ] Rate limiting applied
- [ ] Token expiry working
- [ ] Sessions invalidated after change
- [ ] Accessible UI
- [ ] Documentation updated

---

**Status:** Ready to start 🔴 RED Phase
