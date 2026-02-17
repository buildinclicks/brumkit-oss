# Milestone 1: Codebase Audit and Cleanup Foundation

**Status**: Completed  
**Prerequisites**: None  
**Estimated Effort**: 2 days

---

## Goal

Establish a clean baseline by identifying and documenting all code that needs to be modified or removed for the open-source version of BrumKit.

---

## Context

Before making any changes to the codebase, we need to thoroughly audit what exists and create a comprehensive removal checklist. This milestone focuses on identifying:

- All OAuth-related code (Google and GitHub providers)
- All CASL permission references to unimplemented features
- All documentation that needs updating

This audit will guide all subsequent milestones and ensure we don't miss any code that needs to be cleaned up.

---

## Tasks

### Task 1.1: Create Audit Documentation Structure

**Objective**: Set up the documentation folder structure for this release.

**Actions**:

1. Create directory structure:

```bash
mkdir -p docs/open-source-version
mkdir -p docs/open-source-version/release-0.0
```

2. Verify structure created:

```bash
ls -la docs/open-source-version/release-0.0/
```

**Expected Result**: Directory structure exists and is ready for milestone documentation.

---

### Task 1.2: Audit OAuth Implementation

**Objective**: Document all OAuth-related code that needs to be removed.

**Actions**:

1. **Identify OAuth Provider Configuration**
   - Open `packages/auth/src/config/providers.ts`
   - Document Google OAuth provider (lines ~21-25)
   - Document GitHub OAuth provider (lines ~31-35)
   - Note that Credentials provider should be kept

2. **Identify OAuth Hooks**
   - Open `apps/web/lib/hooks/use-auth.ts`
   - Document `useGoogleLogin()` function
   - Document `useGitHubLogin()` function
   - Note which hooks to keep (useLogin, useLogout, etc.)

3. **Identify OAuth UI Components**
   - Open `apps/web/app/(auth)/login/page.tsx`
   - Document OAuth button section
   - Document separator with "Or continue with" text
   - Document OAuth hook imports
   - Document `handleOAuthSignIn` function

4. **Identify OAuth Tests**
   - Open `apps/web/app/(auth)/login/page.test.tsx`
   - Document "OAuth Login" test section
   - Document OAuth button assertions
   - Document OAuth mock setups in beforeEach

5. **Identify OAuth Environment Variables**
   - Search for files containing OAuth env vars:

   ```bash
   rg -l "GOOGLE_CLIENT|GITHUB_CLIENT"
   ```

   - Document each file found:
     - `.env.example` or `env.example`
     - `apps/web/env.template`
     - `packages/auth/README.md`
     - Deployment documentation files

6. **Create OAuth Removal Checklist**

Create a checklist in this document or a separate file:

```markdown
## OAuth Code Removal Checklist

### Auth Package

- [ ] `packages/auth/src/config/providers.ts` - Remove Google provider
- [ ] `packages/auth/src/config/providers.ts` - Remove GitHub provider
- [ ] `packages/auth/src/config/providers.ts` - Remove imports for Google/GitHub

### Web App Code

- [ ] `apps/web/lib/hooks/use-auth.ts` - Remove `useGoogleLogin()`
- [ ] `apps/web/lib/hooks/use-auth.ts` - Remove `useGitHubLogin()`
- [ ] `apps/web/app/(auth)/login/page.tsx` - Remove OAuth imports
- [ ] `apps/web/app/(auth)/login/page.tsx` - Remove OAuth hooks initialization
- [ ] `apps/web/app/(auth)/login/page.tsx` - Remove `handleOAuthSignIn` function
- [ ] `apps/web/app/(auth)/login/page.tsx` - Remove OAuth buttons section
- [ ] `apps/web/app/(auth)/login/page.tsx` - Remove Separator import
- [ ] `apps/web/app/(auth)/login/page.test.tsx` - Remove OAuth test section
- [ ] `apps/web/app/(auth)/login/page.test.tsx` - Remove OAuth mock setups
- [ ] `apps/web/messages/en.json` - Remove "google" translation
- [ ] `apps/web/messages/en.json` - Remove "github" translation
- [ ] `apps/web/messages/en.json` - Remove "or_continue_with" (if exists)

### Environment & Documentation

- [ ] `.env.example` - Remove `GOOGLE_CLIENT_ID`
- [ ] `.env.example` - Remove `GOOGLE_CLIENT_SECRET`
- [ ] `.env.example` - Remove `GITHUB_CLIENT_ID`
- [ ] `.env.example` - Remove `GITHUB_CLIENT_SECRET`
- [ ] `apps/web/env.template` - Remove OAuth variables
- [ ] `packages/auth/README.md` - Remove OAuth setup instructions
- [ ] `docs/deployment/vercel-deployment-guide.md` - Remove OAuth setup
- [ ] `docs/deployment/deployment-checklist.md` - Remove OAuth references
- [ ] `docs/deployment/quick-reference.md` - Remove OAuth references
```

**Files to Review**:

- `packages/auth/src/config/providers.ts`
- `apps/web/lib/hooks/use-auth.ts`
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/app/(auth)/login/page.test.tsx`
- `apps/web/messages/en.json`
- `.env.example`
- `apps/web/env.template`
- `packages/auth/README.md`
- All deployment documentation

**Expected Result**: Complete list of all OAuth-related code locations.

---

### Task 1.3: Audit CASL Permissions System

**Objective**: Document all permission subjects that reference unimplemented features.

**Actions**:

1. **Review Subject Types**
   - Open `packages/auth/src/permissions/abilities.ts`
   - Document the Subject type definition (around lines 26-35)
   - Identify subjects to KEEP:
     - `User`
     - `Notification`
     - `all`
   - Identify subjects to REMOVE:
     - `Article`
     - `Comment`
     - `Tag`
     - `Follow`
     - `Bookmark`
     - `Reaction`

2. **Review Subject Type Definitions**
   - Document types to remove:
     - `ArticleSubject` (around line 40)
     - `CommentSubject` (around line 41)
   - Document types to keep:
     - `UserSubject`
     - `NotificationSubject`

3. **Review Permission Rules by Role**
   - Document which rules reference removed subjects in:
     - SUPER_ADMIN role (line ~78-80) - NO CHANGES NEEDED
     - ADMIN role (line ~83-97) - Remove Article/Tag/Comment/Follow/Bookmark/Reaction
     - MODERATOR role (line ~99-120) - Remove Article/Comment/Tag/Follow/Bookmark/Reaction
     - USER role (line ~122-157) - Remove Article/Comment/Follow/Bookmark/Reaction

4. **Create Permissions Cleanup Checklist**

```markdown
## CASL Permissions Cleanup Checklist

### Type Definitions

- [ ] Remove `Article` from Subject type
- [ ] Remove `Comment` from Subject type
- [ ] Remove `Tag` from Subject type
- [ ] Remove `Follow` from Subject type
- [ ] Remove `Bookmark` from Subject type
- [ ] Remove `Reaction` from Subject type
- [ ] Remove `ArticleSubject` type definition
- [ ] Remove `CommentSubject` type definition
- [ ] Keep `User`, `Notification`, `all` subjects
- [ ] Keep `UserSubject`, `NotificationSubject` type definitions

### Permission Rules - ADMIN Role

- [ ] Remove Article management rules
- [ ] Remove Tag management rules
- [ ] Remove Comment management rules
- [ ] Remove Follow management rules
- [ ] Remove Bookmark management rules
- [ ] Remove Reaction management rules
- [ ] Keep User management rules
- [ ] Keep Notification management rules

### Permission Rules - MODERATOR Role

- [ ] Remove Article moderation rules
- [ ] Remove Comment moderation rules
- [ ] Remove Tag management rules
- [ ] Remove Follow management rules
- [ ] Remove Bookmark management rules
- [ ] Remove Reaction management rules
- [ ] Keep User read rules
- [ ] Keep Notification rules

### Permission Rules - USER Role

- [ ] Remove Article CRUD rules
- [ ] Remove Comment CRUD rules
- [ ] Remove Follow rules
- [ ] Remove Bookmark rules
- [ ] Remove Reaction rules
- [ ] Keep User profile rules
- [ ] Keep Notification rules

### Exports & Tests

- [ ] Update `packages/auth/src/permissions/index.ts` exports
- [ ] Remove exports for ArticleSubject, CommentSubject
- [ ] Update `packages/auth/test/abilities.test.ts`
- [ ] Remove tests for removed subjects
```

**Files to Review**:

- `packages/auth/src/permissions/abilities.ts`
- `packages/auth/src/permissions/index.ts`
- `packages/auth/test/abilities.test.ts`

**Expected Result**: Complete understanding of permission system simplification needs.

---

### Task 1.4: Create Code Removal Checklist

**Objective**: Consolidate all findings into a master checklist for subsequent milestones.

**Actions**:

1. Create a comprehensive removal checklist combining OAuth and Permissions audits
2. Organize by milestone:
   - Milestone 2: OAuth Removal items
   - Milestone 3: Permissions Simplification items
3. Add priority levels if needed
4. Document any dependencies between items

**Example Format**:

```markdown
## Master Code Removal Checklist

### Milestone 2: OAuth Removal

**Priority: High**

Auth Configuration:

- [ ] Remove Google provider from providers.ts
- [ ] Remove GitHub provider from providers.ts

Hooks:

- [ ] Remove useGoogleLogin() from use-auth.ts
- [ ] Remove useGitHubLogin() from use-auth.ts

UI:

- [ ] Remove OAuth buttons from login page
- [ ] Remove OAuth imports from login page
- [ ] Remove handleOAuthSignIn function

Tests:

- [ ] Remove OAuth test section from login tests
- [ ] Remove OAuth mock setups

i18n:

- [ ] Remove OAuth translation strings

Environment:

- [ ] Remove OAuth env vars from all docs

### Milestone 3: Permissions Simplification

**Priority: High**

Type Definitions:

- [ ] Simplify Subject type (remove 6 subjects)
- [ ] Remove ArticleSubject type
- [ ] Remove CommentSubject type

Permission Rules:

- [ ] Simplify ADMIN rules
- [ ] Simplify MODERATOR rules
- [ ] Simplify USER rules

Exports & Tests:

- [ ] Update permission exports
- [ ] Update permission tests
```

**Expected Result**: Clear roadmap for code removal in subsequent milestones.

---

### Task 1.5: Verify Database Schema

**Objective**: Confirm the Prisma schema matches our open-source requirements.

**Actions**:

1. Open `packages/database/prisma/schema.prisma`
2. Verify the following models exist:
   - User ✓
   - Account ✓
   - Session ✓
   - VerificationToken ✓
   - Notification ✓

3. Confirm the following models do NOT exist:
   - Article ✗
   - Comment ✗
   - Tag ✗
   - Follow ✗
   - Bookmark ✗
   - Reaction ✗

4. Document findings:

```markdown
## Database Schema Status

### Existing Models (Keep)

- ✅ User - Complete with profile fields
- ✅ Account - Auth.js session management
- ✅ Session - Auth.js sessions
- ✅ VerificationToken - Email verification
- ✅ Notification - Basic notification system

### Non-Existent Models (As Expected)

- ❌ Article - Not implemented
- ❌ Comment - Not implemented
- ❌ Tag - Not implemented
- ❌ Follow - Not implemented
- ❌ Bookmark - Not implemented
- ❌ Reaction - Not implemented

**Conclusion**: Database schema is already simplified for open-source version. No migrations needed.
```

**Files to Review**:

- `packages/database/prisma/schema.prisma`

**Expected Result**: Confirmation that database schema is ready.

---

### Task 1.6: Document Findings

**Objective**: Create the final audit report document.

**Actions**:

1. Compile all findings into a comprehensive audit report
2. Include:
   - Executive summary
   - OAuth implementation details
   - Permissions system details
   - Database schema status
   - File-by-file breakdown
   - Removal checklists
   - Risk assessment

3. Save as this milestone document or as a separate audit report

**Template Structure**:

```markdown
# BrumKit Open Source - Codebase Audit Report

## Executive Summary

- Total files to modify: X
- OAuth-related files: Y
- Permission-related files: Z
- Documentation files: W
- Risk level: LOW/MEDIUM/HIGH

## Detailed Findings

### OAuth Implementation

[Details from Task 1.2]

### CASL Permissions

[Details from Task 1.3]

### Database Schema

[Details from Task 1.5]

## Removal Checklists

[Consolidated from Tasks 1.2-1.4]

## Risk Assessment

- Low Risk: Clean, isolated code removal
- Medium Risk: Test updates needed
- High Risk: None identified

## Next Steps

Proceed to Milestone 2: OAuth Removal
```

**Expected Result**: Complete audit documentation ready for implementation.

---

## Deliverables

- [ ] Documentation structure created (`docs/open-source-version/release-0.0/`)
- [ ] OAuth implementation fully documented
- [ ] CASL permissions fully documented
- [ ] Database schema verified
- [ ] OAuth removal checklist created
- [ ] Permissions cleanup checklist created
- [ ] Master removal checklist created
- [ ] Audit report completed
- [ ] This milestone documentation file completed

---

## Acceptance Criteria

### Must Have (Blocking)

- [ ] Documentation structure exists at `docs/open-source-version/release-0.0/`
- [ ] All OAuth code locations identified and documented
- [ ] All permission subjects documented (keep vs remove)
- [ ] Complete OAuth removal checklist created
- [ ] Complete permissions cleanup checklist created
- [ ] Database schema verified and documented
- [ ] No code changes made (audit only)

### Documentation Quality

- [ ] All file paths are accurate and complete
- [ ] Line numbers referenced (where helpful)
- [ ] Clear distinction between "keep" and "remove" items
- [ ] Checklists are actionable (can be used in subsequent milestones)
- [ ] Risk assessment included

### Completeness

- [ ] All OAuth providers documented
- [ ] All OAuth UI components documented
- [ ] All OAuth tests documented
- [ ] All OAuth environment variables documented
- [ ] All 6 removed permission subjects documented
- [ ] All 4 role permission rules documented

---

## Tools & Commands

Useful commands for this audit:

```bash
# Search for OAuth references
rg -i "google|github" --glob "*.ts" --glob "*.tsx"

# Search for OAuth environment variables
rg "GOOGLE_CLIENT|GITHUB_CLIENT"

# List auth-related files
fd . packages/auth --type f

# Search for permission subjects
rg "Article|Comment|Tag|Follow|Bookmark|Reaction" packages/auth/src/permissions/

# Check test files
fd test.ts apps/web --type f | head -20
```

---

## Verification

After completing all tasks, verify:

```bash
# Check documentation exists
ls -la docs/open-source-version/release-0.0/

# Count OAuth references (should be documented)
rg -c "google|github" apps/web/ | wc -l

# Count permission subjects (should be documented)
rg -c "Article|Comment|Tag" packages/auth/src/permissions/ | wc -l
```

---

## Notes

- This is an audit-only milestone - NO code changes should be made
- All findings should be documented for use in subsequent milestones
- Be thorough - missing items now means cleanup later
- Focus on accuracy over speed
- Document file paths and line numbers for easy reference

---

## Next Steps

After completing this milestone:

1. Review audit report for completeness
2. Ensure all checklists are actionable
3. Proceed to **Milestone 2: OAuth Removal**

---

## Rollback Plan

Not applicable - this milestone makes no code changes.

---

## Success Criteria

The milestone is successful when:

- [ ] All OAuth code locations documented
- [ ] All permission subjects documented
- [ ] Complete removal checklists created
- [ ] Documentation ready to guide Milestone 2 and 3
- [ ] No code changes made (audit only)

---

**Status**: This milestone establishes the foundation for all subsequent work. Thoroughness here saves time later!
