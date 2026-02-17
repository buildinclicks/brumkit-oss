# BrumKit Open Source Release - Milestone Overview

**Project**: BrumKit Open Source Edition  
**Version**: 0.1.0  
**Documentation Date**: February 16, 2026

---

## Quick Navigation

| Milestone                                                         | Status      | Effort | Document                         |
| ----------------------------------------------------------------- | ----------- | ------ | -------------------------------- |
| [Milestone 1](#milestone-1-codebase-audit-and-cleanup-foundation) | ✅ Complete | 2 days | [milestone-1.md](milestone-1.md) |
| [Milestone 2](#milestone-2-oauth-removal)                         | Pending     | 3 days | [milestone-2.md](milestone-2.md) |
| [Milestone 3](#milestone-3-permissions-system-simplification)     | Pending     | 2 days | [milestone-3.md](milestone-3.md) |
| [Milestone 4](#milestone-4-basic-notification-ui)                 | Pending     | 4 days | [milestone-4.md](milestone-4.md) |
| [Milestone 5](#milestone-5-documentation-and-branding)            | Pending     | 2 days | [milestone-5.md](milestone-5.md) |
| [Milestone 6](#milestone-6-final-quality-assurance-and-release)   | Pending     | 2 days | [milestone-6.md](milestone-6.md) |

**Total Estimated Effort**: 15 days

---

## Overview

This is the implementation plan for creating the open-source version of BrumKit. The plan follows a milestone-based approach with clear goals, testable tasks, and strict adherence to TDD principles.

### Key Decisions

Based on user input, the open-source version:

- ✅ **Removes OAuth providers** (Google, GitHub) - credentials-only auth
- ✅ **Skips Article system** - focuses on Auth + Profile + Notifications
- ✅ **Removes all unused permissions** - keeps only User + Notification subjects
- ✅ **Implements Notification UI** - basic list with mark-as-read functionality

---

## Milestone 1: Codebase Audit and Cleanup Foundation

**Goal**: Establish a clean baseline by identifying and documenting all code that needs to be modified or removed.

**Status**: ✅ **COMPLETED**

**Key Deliverables**:

- ✅ Documentation structure created
- ✅ OAuth implementation audited
- ✅ CASL permissions audited
- ✅ Code removal checklist created

**Next Action**: Proceed to Milestone 2

[📄 View Full Documentation](milestone-1.md)

---

## Milestone 2: OAuth Removal

**Goal**: Remove Google and GitHub OAuth providers to create a credentials-only authentication system.

**Status**: 🔄 **PENDING**

**Key Tasks**:

1. Update auth tests (TDD - Red)
2. Remove OAuth providers from auth config
3. Remove OAuth hooks
4. Remove OAuth UI from login page
5. Remove OAuth i18n strings
6. Update environment variable documentation
7. Verify Account model (no changes needed)
8. Run tests and verify (TDD - Green/Refactor)

**Prerequisites**: Milestone 1 completed

**Estimated Effort**: 3 days

**Key Files to Modify**:

- `packages/auth/src/config/providers.ts`
- `apps/web/lib/hooks/use-auth.ts`
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/app/(auth)/login/page.test.tsx`
- `apps/web/messages/en.json`
- `.env.example`
- Documentation files

[📄 View Full Documentation](milestone-2.md)

---

## Milestone 3: Permissions System Simplification

**Goal**: Clean up the CASL permissions system to only include User and Notification subjects.

**Status**: 🔄 **PENDING**

**Key Tasks**:

1. Write tests for simplified permissions (TDD - Red)
2. Simplify Subject types in abilities.ts
3. Simplify ability rules for each role
4. Add role permissions documentation
5. Update permission exports
6. Update and verify tests (TDD - Green/Refactor)

**Prerequisites**: Milestone 2 completed

**Estimated Effort**: 2 days

**Key Files to Modify**:

- `packages/auth/src/permissions/abilities.ts`
- `packages/auth/src/permissions/index.ts`
- `packages/auth/test/abilities.test.ts`

**Subjects to Remove**: Article, Comment, Tag, Follow, Bookmark, Reaction  
**Subjects to Keep**: User, Notification, all

[📄 View Full Documentation](milestone-3.md)

---

## Milestone 4: Basic Notification UI

**Goal**: Implement a simple notification list UI with mark-as-read functionality.

**Status**: 🔄 **PENDING**

**Key Tasks**:

1. Write notification validation schemas (TDD - Red)
2. Write notification server action tests (TDD - Red)
3. Implement notification server actions (TDD - Green)
4. Write notification component tests (TDD - Red)
5. Implement notification UI components (TDD - Green)
6. Implement notification page
7. Add notification indicator to header
8. Add i18n translations
9. Refactor and polish (TDD - Refactor)

**Prerequisites**: Milestone 3 completed

**Estimated Effort**: 4 days

**Key Files to Create**:

- `packages/validation/src/schemas/notification.schema.ts`
- `apps/web/app/actions/notification.ts`
- `apps/web/components/notifications/notification-item.tsx`
- `apps/web/components/notifications/notification-list.tsx`
- `apps/web/components/skeletons/notification-skeleton.tsx`
- `apps/web/app/(dashboard)/notifications/page.tsx`

[📄 View Full Documentation](milestone-4.md)

---

## Milestone 5: Documentation and Branding

**Goal**: Update all documentation and branding for the open-source release.

**Status**: 🔄 **PENDING**

**Key Tasks**:

1. Update README.md
2. Create CONTRIBUTING.md
3. Update package.json files
4. Clean up docs/ folder
5. Create LICENSE file
6. Update environment example
7. Update open-source spec document

**Prerequisites**: Milestone 4 completed

**Estimated Effort**: 2 days

**Key Files to Create/Modify**:

- `README.md`
- `CONTRIBUTING.md`
- `LICENSE`
- `.env.example`
- `package.json`
- `docs/release/00-open-source-version.md`

[📄 View Full Documentation](milestone-5.md)

---

## Milestone 6: Final Quality Assurance and Release

**Goal**: Ensure all code meets quality standards and prepare for the v0.1.0 release.

**Status**: 🔄 **PENDING**

**Key Tasks**:

1. Run full test suite
2. Run linting and formatting
3. Manual testing checklist (comprehensive)
4. Security review
5. Final cleanup
6. Create release (tag v0.1.0 + release notes)

**Prerequisites**: Milestone 5 completed

**Estimated Effort**: 2 days

**Key Deliverables**:

- Test results documented
- Manual test results documented
- Security review documented
- Release notes created
- Git tag created (v0.1.0)

[📄 View Full Documentation](milestone-6.md)

---

## Global Acceptance Criteria

All milestones must satisfy:

### 1. Cursor Rules Compliance

- Follow all rules in `.cursor/rules`
- Use Tailwind CSS v4 configuration (CSS-first, no tailwind.config.ts)
- Use Server Actions for mutations (not REST APIs)
- Use `useServerActionForm` hook pattern for forms
- Use `<FieldError>` component for validation errors
- Use `ValidationMessages` constants for validation messages

### 2. TDD First Approach

- Write failing tests FIRST (Red)
- Implement minimal code to pass (Green)
- Refactor while keeping tests green (Refactor)
- Maintain 80%+ code coverage

### 3. ESLint and Prettier Rules

- Zero ESLint errors on `pnpm lint`
- Zero Prettier issues on `pnpm format:check`
- Single quotes, 2-space indentation, semicolons (per `.prettierrc`)

### 4. Codebase Consistency

- Follow existing patterns in codebase
- Use `@repo/` imports for monorepo packages
- Use `@/` imports for web app internal imports
- Follow AAA (Arrange-Act-Assert) test pattern
- Use "should" convention for test names

### 5. Best Practices

- TypeScript strict mode compliance
- Proper error handling with `ActionResult<T>` pattern
- Loading states with skeleton components
- Accessibility (role queries in tests, ARIA attributes)
- i18n for all user-facing strings

---

## How to Use These Documents

### For AI/Cursor Implementation

Each milestone document is designed as a complete prompt for Cursor's AI assistant:

1. **Open the milestone document** you want to implement
2. **Read the entire document** to understand context and goals
3. **Follow tasks sequentially** - they build on each other
4. **Verify acceptance criteria** after each task
5. **Mark tasks complete** as you progress
6. **Document any deviations** or issues encountered

### For Human Developers

1. **Review the milestone overview** to understand the big picture
2. **Read the specific milestone document** before starting work
3. **Follow TDD strictly** - write tests first
4. **Check acceptance criteria** regularly
5. **Update status** in this overview document as milestones complete

---

## Progress Tracking

Update this section as milestones are completed:

- [x] Milestone 1: Codebase Audit - **COMPLETED** ✅
- [ ] Milestone 2: OAuth Removal - **IN PROGRESS** 🔄
- [ ] Milestone 3: Permissions Simplification - **PENDING** ⏳
- [ ] Milestone 4: Notification UI - **PENDING** ⏳
- [ ] Milestone 5: Documentation - **PENDING** ⏳
- [ ] Milestone 6: QA and Release - **PENDING** ⏳

---

## Key Files Reference

| Purpose            | Location                                     |
| ------------------ | -------------------------------------------- |
| Cursor Rules       | `.cursor/rules`                              |
| Prisma Schema      | `packages/database/prisma/schema.prisma`     |
| Auth Config        | `packages/auth/src/config/auth.ts`           |
| Auth Providers     | `packages/auth/src/config/providers.ts`      |
| CASL Permissions   | `packages/auth/src/permissions/abilities.ts` |
| Validation Schemas | `packages/validation/src/schemas/`           |
| i18n Messages      | `apps/web/messages/en.json`                  |
| Server Actions     | `apps/web/app/actions/`                      |
| Test Utilities     | `apps/web/lib/test/`                         |
| ESLint Config      | `eslint.config.js`                           |
| Prettier Config    | `.prettierrc`                                |

---

## Support and Questions

- **Documentation Issues**: Create issue in repository
- **Implementation Questions**: Reference specific milestone document
- **Cursor Rules**: See `.cursor/rules` for coding standards

---

## Timeline Visualization

```
Milestone 1: Codebase Audit          [==] 2 days   ✅ COMPLETE
Milestone 2: OAuth Removal            [===] 3 days  🔄 PENDING
Milestone 3: Permissions              [==] 2 days   ⏳ PENDING
Milestone 4: Notification UI          [====] 4 days ⏳ PENDING
Milestone 5: Documentation            [==] 2 days   ⏳ PENDING
Milestone 6: QA and Release           [==] 2 days   ⏳ PENDING
                                      ─────────────
                                      Total: 15 days
```

---

**Last Updated**: February 16, 2026  
**Version**: 1.0  
**Maintained By**: BuildInClicks
