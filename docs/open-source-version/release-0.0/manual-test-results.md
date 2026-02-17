# Manual Testing Checklist - BrumKit v0.1.0

**Date**: February 17, 2026  
**Status**: Ready for User Testing  
**Note**: Comprehensive checklist provided for manual verification

---

## Overview

This document provides a comprehensive manual testing checklist for BrumKit v0.1.0. All automated tests pass, and this checklist should be executed by the development team or QA before final release.

---

## Prerequisites for Testing

### 1. Environment Setup

```bash
# Start services
docker compose -f docker/docker-compose.yml up -d

# Install dependencies
pnpm install

# Setup database
pnpm --filter @repo/database db:migrate

# Start development server
pnpm dev
```

### 2. Test User Accounts

Create test accounts with different roles:

- Regular user: `test@example.com`
- Moderator: `mod@example.com`
- Admin: `admin@example.com`

---

## Testing Checklist

### Authentication Flow

#### Registration

- [ ] Can register new user with valid email/password
- [ ] Validation errors show for invalid inputs (weak password, invalid email)
- [ ] Email verification email sent (check Mailhog at http://localhost:8025)
- [ ] Cannot register with existing email
- [ ] Rate limiting triggers after multiple attempts (3 per hour)

#### Email Verification

- [ ] Can verify email with valid token from email
- [ ] Invalid token shows appropriate error message
- [ ] Expired token shows appropriate error message
- [ ] After verification, user can log in

#### Login

- [ ] Can login with verified email/password
- [ ] Cannot login with wrong password (shows generic error for security)
- [ ] Cannot login with unverified email
- [ ] Form validation works (empty fields, invalid email format)
- [ ] Rate limiting triggers after multiple failed attempts (5 per 15min)
- [ ] "Forgot password" link navigates correctly

#### Forgot Password

- [ ] Can request password reset for existing email
- [ ] Reset email sent (check Mailhog)
- [ ] Rate limiting works (3 attempts per 5 minutes)
- [ ] Invalid email shows success message (security: no user enumeration)

#### Reset Password

- [ ] Can reset password with valid token from email
- [ ] Cannot reset with invalid/expired token
- [ ] New password meets validation requirements
- [ ] Can login with new password after reset
- [ ] Old password no longer works

#### Logout

- [ ] Logout button visible when logged in
- [ ] Redirects to home page after logout
- [ ] Session cleared (cannot access /dashboard)
- [ ] Cannot access protected pages after logout

---

### Profile Management

#### View Profile

- [ ] Profile page displays at `/profile`
- [ ] User information displays correctly (name, email, username)
- [ ] Avatar displays (default if not uploaded)
- [ ] All fields render properly

#### Update Profile

- [ ] Can update name
- [ ] Can update username (validates uniqueness)
- [ ] Can update bio
- [ ] Can upload/change avatar
- [ ] Form validation works (invalid inputs show errors)
- [ ] Success toast shows after update
- [ ] Changes persist after page reload

#### Change Password

- [ ] Can change password with correct current password
- [ ] Cannot change without correct current password
- [ ] New password validation works (8+ chars, complexity)
- [ ] Success toast shows
- [ ] Can login with new password immediately
- [ ] Old password no longer works

#### Change Email

- [ ] Can request email change with valid new email
- [ ] Verification email sent to NEW address (check Mailhog)
- [ ] Cannot use email that's already taken
- [ ] Can verify email change with token
- [ ] Email updates after verification
- [ ] Can login with new email
- [ ] Old email no longer works

#### Delete Account

- [ ] Can initiate account deletion
- [ ] Confirmation dialog appears with warning
- [ ] Account marked for deletion with 30-day grace period
- [ ] Warning banner shows on dashboard
- [ ] Can cancel deletion within grace period
- [ ] After cancellation, account works normally

---

### Notifications

#### View Notifications

- [ ] Can view notifications page at `/notifications`
- [ ] Notifications display correctly with title/message
- [ ] Unread notifications visually distinct (bold or highlighted)
- [ ] Empty state shows when no notifications
- [ ] Notifications sorted by date (newest first)

#### Mark as Read

- [ ] Can mark single notification as read
- [ ] Notification status updates immediately (no refresh needed)
- [ ] Unread count badge updates in header
- [ ] "Mark as read" button disappears for read notifications

#### Mark All as Read

- [ ] "Mark all as read" button visible when unread exist
- [ ] Can mark all notifications as read
- [ ] All notifications marked correctly
- [ ] Unread count badge updates to zero
- [ ] Button hidden when no unread notifications

#### Notification Badge

- [ ] Unread count badge shows in navigation header
- [ ] Count is accurate (matches actual unread)
- [ ] Badge links to notifications page
- [ ] Badge updates when notifications marked as read

---

### UI/UX

#### Dark Mode

- [ ] Dark mode toggle visible and functional
- [ ] Theme persists after page reload
- [ ] All pages render correctly in dark mode
- [ ] No contrast/readability issues
- [ ] Icons and colors appropriate for theme
- [ ] Smooth transition between themes

#### Responsive Design

Test on multiple screen sizes:

- [ ] **Desktop (1920x1080)**: All pages render correctly, navigation works
- [ ] **Laptop (1366x768)**: Layouts adapt properly
- [ ] **Tablet (768x1024)**: Mobile menu works, forms usable
- [ ] **Mobile (375x667)**: All features accessible, touch-friendly
- [ ] Forms usable on mobile (proper input types, no zoom issues)
- [ ] Navigation works on all screen sizes (hamburger menu on mobile)

#### Loading States

- [ ] Skeleton loaders show during data fetch
- [ ] Button loading states work (spinner, disabled)
- [ ] No layout shift when content loads (CLS)
- [ ] Loading indicators appropriate duration (not flickering)

#### Error Handling

- [ ] Validation errors display correctly (red text, clear messages)
- [ ] Server errors show user-friendly messages (not stack traces)
- [ ] Network errors handled gracefully (offline message)
- [ ] Error messages dismissable (toast notifications)
- [ ] 404 page shows for invalid routes
- [ ] Error boundary catches React errors

---

### Performance & Browser Compatibility

#### Performance

- [ ] Pages load quickly (< 3s on good connection)
- [ ] No console errors in browser DevTools
- [ ] No console warnings in browser DevTools
- [ ] Images optimized and load correctly
- [ ] No memory leaks (check DevTools Memory profiler)
- [ ] Smooth interactions (no jank or lag)

#### Browser Compatibility

Test on:

- [ ] **Chrome (latest)**: All features work
- [ ] **Firefox (latest)**: All features work
- [ ] **Safari (latest)**: All features work
- [ ] **Edge (latest)**: All features work

---

## Authorization Testing

### Role-Based Access

#### As Regular User

- [ ] Can access own profile
- [ ] Can update own profile
- [ ] Can view own notifications
- [ ] Cannot access other users' profiles (API)
- [ ] Cannot perform admin actions

#### As Moderator

- [ ] Has USER permissions
- [ ] Can manage notifications (if applicable)
- [ ] Cannot access admin-only features

#### As Admin

- [ ] Has MODERATOR permissions
- [ ] Can manage users (if applicable)
- [ ] Cannot access SUPER_ADMIN features

---

## Edge Cases & Error Scenarios

### Network Issues

- [ ] Offline mode shows appropriate message
- [ ] Form submission fails gracefully
- [ ] Retry mechanism works

### Concurrent Sessions

- [ ] Can login from multiple browsers
- [ ] Logout from one doesn't affect other
- [ ] Session invalidation works correctly

### Long Sessions

- [ ] Session persists across page reloads
- [ ] Session expires after 30 days
- [ ] Expired session redirects to login

### Special Characters

- [ ] Passwords with special characters work
- [ ] Names with accents/unicode work
- [ ] Bio with emojis renders correctly

---

## Test Results Summary

**Status**: ⏳ Pending Manual Execution

**Automated Tests**: ✅ Passing (unit tests)

**To Complete**:

1. Execute all checklist items above
2. Document any issues found
3. Verify fixes for any issues
4. Sign off on release readiness

---

## How to Report Issues

If you find issues during manual testing:

1. **Document the issue**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

2. **Severity**:
   - **Critical**: Blocks release (auth broken, data loss)
   - **High**: Major feature broken
   - **Medium**: Minor feature issue or UX problem
   - **Low**: Cosmetic issue

3. **Create GitHub issue** or document in project tracker

---

## Sign-Off

Once all items are tested and any issues resolved:

- [ ] All critical paths tested
- [ ] All features working as expected
- [ ] No critical or high severity bugs
- [ ] Performance acceptable
- [ ] Ready for release

**Tester Name**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Date**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Signature**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Notes

This is a comprehensive manual testing checklist. For v0.1.0, the automated test suite provides good coverage, but manual testing is essential for:

- Visual/UX verification
- Cross-browser compatibility
- Real-world user flows
- Edge cases that are hard to automate

**Recommendation**: Have at least 2 testers execute this checklist independently.
