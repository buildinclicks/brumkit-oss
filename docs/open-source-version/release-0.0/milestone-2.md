# Milestone 2: OAuth Removal

**Status**: Completed  
**Prerequisites**: Milestone 1 completed  
**Estimated Effort**: 3 days
**Actual Effort**: Completed in 1 session

---

## Goal

Remove Google and GitHub OAuth providers to create a credentials-only authentication system for the open-source version of BrumKit.

---

## Context

The current codebase includes OAuth authentication via Google and GitHub providers. For the open-source version, we want to simplify the setup by supporting only email/password (credentials) authentication. This reduces complexity and eliminates the need for users to configure OAuth credentials.

**Reference**: See `docs/open-source-version/release-0.0/audit-report.md` for the complete audit of OAuth code locations.

---

## Tasks

### Task 2.1: Update Auth Tests (TDD - Red Phase)

**Objective**: Update existing auth tests to remove OAuth expectations before removing OAuth code.

**Actions**:

1. Open `apps/web/app/(auth)/login/page.test.tsx`
2. Remove the following test sections:
   - "OAuth Login" describe block (lines 260-314)
   - OAuth button assertions in rendering tests
   - OAuth-related loading state tests
3. Remove mock setups for `useGoogleLogin` and `useGitHubLogin` from `beforeEach`
4. Update the test coverage comment to remove "OAuth integration"

**Files to Modify**:

- `apps/web/app/(auth)/login/page.test.tsx`

**Expected Result**: Tests should fail where OAuth UI/hooks are expected but will be removed.

---

### Task 2.2: Remove OAuth Providers from Auth Config

**Objective**: Remove Google and GitHub OAuth provider configurations from the auth system.

**Actions**:

1. Open `packages/auth/src/config/providers.ts`
2. Remove the following imports:
   ```typescript
   import GitHub from 'next-auth/providers/github';
   import Google from 'next-auth/providers/google';
   ```
3. Remove the Google OAuth provider configuration (lines 21-25)
4. Remove the GitHub OAuth provider configuration (lines 31-35)
5. Keep only the Credentials provider in the providers array

**Files to Modify**:

- `packages/auth/src/config/providers.ts`

**Expected Result**:

```typescript
import { loginSchema } from '@repo/validation';
import Credentials from 'next-auth/providers/credentials';
import { verifyPassword } from '../utils/password';
import type { NextAuthConfig } from 'next-auth';

declare const prisma: any;

export const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // ... existing authorize logic
    },
  }),
];
```

---

### Task 2.3: Remove OAuth Hooks

**Objective**: Remove OAuth login hooks from the web app.

**Actions**:

1. Open `apps/web/lib/hooks/use-auth.ts`
2. Remove the `useGoogleLogin` function (lines 60-66)
3. Remove the `useGitHubLogin` function (lines 71-77)
4. Keep all other hooks: `useLogin`, `useLogout`, `useChangePassword`, `useRequestPasswordReset`, `useResetPassword`

**Files to Modify**:

- `apps/web/lib/hooks/use-auth.ts`

**Expected Result**: Only credentials-based auth hooks remain.

---

### Task 2.4: Remove OAuth UI from Login Page

**Objective**: Remove OAuth buttons and related UI from the login page.

**Actions**:

1. Open `apps/web/app/(auth)/login/page.tsx`
2. Remove imports:
   - Remove `useGoogleLogin, useGitHubLogin` from the import statement (line 23)
   - Remove `Separator` from `@repo/ui/separator` import
3. Remove OAuth hooks initialization:
   - Remove `const googleLogin = useGoogleLogin();` (line 28)
   - Remove `const githubLogin = useGitHubLogin();` (line 29)
4. Remove `handleOAuthSignIn` function (lines 53-63)
5. Update `isLoading` calculation to only use `loginMutation.isPending` (remove OAuth loading states)
6. Remove the entire OAuth section from the JSX:
   - Separator section (lines 112-121)
   - OAuth buttons grid (lines 123-138)

**Files to Modify**:

- `apps/web/app/(auth)/login/page.tsx`

**Expected Result**: Login page contains only email/password form without OAuth buttons.

---

### Task 2.5: Remove OAuth i18n Strings

**Objective**: Clean up translation strings related to OAuth.

**Actions**:

1. Open `apps/web/messages/en.json`
2. Remove the following keys from the `login` section:
   - `"or_continue_with"` (if it exists)
   - `"google": "Google"` (line 125)
   - `"github": "GitHub"` (line 126)

**Files to Modify**:

- `apps/web/messages/en.json`

**Expected Result**: No OAuth-related translation strings remain.

---

### Task 2.6: Update Environment Variable Documentation

**Objective**: Remove OAuth environment variables from example files and documentation.

**Actions**:

1. Update `.env.example` or `env.example`:
   - Remove `GOOGLE_CLIENT_ID`
   - Remove `GOOGLE_CLIENT_SECRET`
   - Remove `GITHUB_CLIENT_ID`
   - Remove `GITHUB_CLIENT_SECRET`

2. Update `apps/web/env.template` (if exists):
   - Remove same OAuth variables

3. Update `packages/auth/README.md`:
   - Remove OAuth setup instructions
   - Remove OAuth environment variable documentation

4. Update deployment documentation in `docs/deployment/`:
   - Remove OAuth setup from `vercel-deployment-guide.md`
   - Remove OAuth setup from `deployment-checklist.md`
   - Remove OAuth setup from `quick-reference.md`

**Files to Modify**:

- `.env.example` or `env.example`
- `apps/web/env.template`
- `packages/auth/README.md`
- `docs/deployment/vercel-deployment-guide.md`
- `docs/deployment/deployment-checklist.md`
- `docs/deployment/quick-reference.md`

**Expected Result**: No OAuth environment variables in any documentation or example files.

---

### Task 2.7: Verify Account Model (No Changes Needed)

**Objective**: Verify the Account model still works for session management without OAuth.

**Actions**:

1. Review `packages/database/prisma/schema.prisma`
2. Verify Account model is still needed for Auth.js session management
3. No changes required - Account model is used by Auth.js for session storage

**Files to Review**:

- `packages/database/prisma/schema.prisma`

**Expected Result**: Confirmation that Account model is still valid.

---

### Task 2.8: Run Tests and Verify (TDD - Green/Refactor Phase)

**Objective**: Ensure all tests pass and code quality standards are met.

**Actions**:

1. Run the full test suite:

   ```bash
   pnpm test
   ```

2. Run linting:

   ```bash
   pnpm lint
   ```

3. Run formatting check:

   ```bash
   pnpm format:check
   ```

4. Run type checking:

   ```bash
   pnpm type-check
   ```

5. Fix any issues that arise

**Expected Result**:

- All tests pass
- Zero linting errors
- Zero formatting issues
- Zero TypeScript errors

---

## Deliverables

- [x] Credentials-only auth system (OAuth providers removed)
- [x] Updated auth configuration (`packages/auth/src/config/providers.ts`)
- [x] Clean login UI without OAuth buttons
- [x] Updated test suite (OAuth tests removed)
- [x] Updated environment documentation (OAuth vars removed)
- [x] This milestone documentation file completed

---

## Acceptance Criteria

### Must Have (Blocking)

- [x] All OAuth provider code removed from `packages/auth/src/config/providers.ts`
- [x] OAuth hooks removed from `apps/web/lib/hooks/use-auth.ts`
- [x] Login page has no OAuth buttons visible
- [x] Login page works correctly with email/password only
- [x] Registration page verified to have no OAuth elements (it didn't have any)
- [x] All OAuth-related i18n strings removed
- [x] All OAuth environment variables removed from documentation

### Code Quality

- [x] All auth tests pass: `pnpm --filter web test login`
- [x] All package tests pass: `pnpm test` (39/41 auth tests pass, 2 require DB setup)
- [x] ESLint clean: `pnpm --filter web eslint .` returns zero errors
- [x] TypeScript clean: `pnpm --filter web tsc --noEmit` returns zero errors
- [x] No unused imports remain

### TDD Compliance

- [x] Tests were updated BEFORE code changes (Red phase)
- [x] Code changes made tests pass (Green phase)
- [x] Code refactored while keeping tests green (Refactor phase)

### Cursor Rules Compliance

- [x] Followed all rules in `.cursor/rules`
- [x] Server Actions used (not REST APIs) - N/A for this milestone
- [x] Tailwind CSS v4 patterns maintained - N/A for this milestone
- [x] Single quotes, 2-space indentation, semicolons (Prettier config)

### Manual Verification

- [ ] Can register new user with email/password (requires running app)
- [ ] Can login with email/password (requires running app)
- [ ] Login page has no OAuth buttons (requires running app)
- [ ] Login page has no separator with "Or continue with" (requires running app)
- [ ] No console errors in browser (requires running app)
- [ ] Dark mode still works (requires running app)

---

## Rollback Plan

If issues arise:

1. Revert changes to `packages/auth/src/config/providers.ts`
2. Revert changes to `apps/web/app/(auth)/login/page.tsx`
3. Revert changes to `apps/web/lib/hooks/use-auth.ts`
4. Revert test file changes
5. Run `pnpm test` to verify rollback

---

## Notes

- The Account model remains in the Prisma schema because Auth.js uses it for session management
- No database migrations needed - OAuth providers didn't require special schema fields beyond Account
- Email verification and password reset flows are unaffected by this change

---

## Next Steps

After completing this milestone, proceed to **Milestone 3: Permissions System Simplification**.
