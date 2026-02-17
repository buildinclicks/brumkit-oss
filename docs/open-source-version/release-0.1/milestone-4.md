# Milestone 4: Minor and Patch Updates

**Status**: Not Started  
**Prerequisites**: Milestone 3 Complete  
**Estimated Effort**: 1-2 days  
**Risk Level**: LOW

---

## Goal

Apply safe minor and patch version updates to dependencies across the monorepo, improving security, performance, and bug fixes while maintaining stability.

---

## Context

The audit identified several safe updates available:

**Patch Updates** (bug fixes only):

- react: 19.2.3 → 19.2.4
- react-dom: 19.2.3 → 19.2.4
- @tanstack/react-query: 5.90.16 → 5.90.21
- vitest: 4.0.16 → 4.0.18

**Minor Updates** (backward compatible features):

- next-intl: 4.7.0 → 4.8.3

**Staying Current**:

- Next.js: Stay on latest 15.x patch
- Prisma: Stay on latest 6.x patch

All updates are low-risk with backward compatibility guaranteed by semver.

---

## Tasks

### Task 4.1: Update React Ecosystem

**Objective**: Update React and React DOM to latest patch

**Current**: ^19.2.3  
**Target**: ^19.2.4

**Packages to Update**:

- apps/web (dependencies)
- packages/email (dependencies)
- packages/ui (devDependencies)

**Actions**:

1. Update package.json files:

   ```json
   {
     "dependencies": {
       "react": "^19.2.4",
       "react-dom": "^19.2.4"
     }
   }
   ```

2. Run `pnpm install`

3. Check React changelog for changes

4. Test React components:

   ```bash
   pnpm --filter web test
   pnpm --filter @repo/ui test
   pnpm --filter @repo/email test
   ```

5. Manual testing in development:

   ```bash
   pnpm dev:web
   ```

6. Verify no console warnings

**Expected Result**: React 19.2.4 across all packages

---

### Task 4.2: Update TanStack React Query

**Objective**: Update React Query to latest patch

**Current**:

- @tanstack/react-query: ^5.90.16
- @tanstack/react-query-devtools: ^5.91.2

**Target**:

- @tanstack/react-query: ^5.90.21
- @tanstack/react-query-devtools: ^5.90.21 (align versions)

**Package**: apps/web

**Actions**:

1. Update apps/web/package.json:

   ```json
   {
     "dependencies": {
       "@tanstack/react-query": "^5.90.21",
       "@tanstack/react-query-devtools": "^5.90.21"
     }
   }
   ```

2. Run `pnpm install`

3. Review changelog for bug fixes

4. Test query hooks:

   ```bash
   pnpm --filter web test
   ```

5. Test in development with devtools

6. Verify cache behavior

**Expected Result**: React Query 5.90.21 with aligned devtools

---

### Task 4.3: Update next-intl

**Objective**: Update internationalization library

**Current**: ^4.7.0  
**Target**: ^4.8.3

**Package**: apps/web

**Actions**:

1. Update apps/web/package.json:

   ```json
   {
     "dependencies": {
       "next-intl": "^4.8.3"
     }
   }
   ```

2. Run `pnpm install`

3. Review migration guide: https://next-intl-docs.vercel.app/blog/next-intl-4-8

4. Test i18n functionality:
   - Check translations load
   - Test locale switching
   - Verify routing works
   - Test server/client components

5. Run tests:
   ```bash
   pnpm --filter web test
   ```

**Expected Result**: next-intl 4.8.3 working correctly

---

### Task 4.4: Update Vitest

**Objective**: Update test framework to latest patch

**Current**: ^4.0.16  
**Target**: ^4.0.18

**Packages to Update**:

- Root package.json (devDependencies)
- All packages with vitest devDependency

**Actions**:

1. Update all package.json files:

   ```json
   {
     "devDependencies": {
       "vitest": "^4.0.18"
     }
   }
   ```

2. Run `pnpm install`

3. Review changelog for bug fixes

4. Run full test suite:

   ```bash
   pnpm test
   ```

5. Check coverage generation:

   ```bash
   pnpm test:coverage
   ```

6. Verify test performance

**Expected Result**: Vitest 4.0.18 across all packages

---

### Task 4.5: Check Next.js Patches

**Objective**: Ensure latest Next.js 15.x patch is installed

**Current**: ^15.5.10  
**Target**: Latest 15.x patch (check npm)

**Package**: apps/web

**Actions**:

1. Check latest 15.x version:

   ```bash
   npm show next versions --json | grep "^15"
   ```

2. If newer patch available, update apps/web/package.json

3. Run `pnpm install`

4. Review changelog for security fixes

5. Test application:

   ```bash
   pnpm dev:web
   pnpm build:web
   ```

6. Check for deprecation warnings

**Expected Result**: Latest stable Next.js 15.x patch

---

### Task 4.6: Check Prisma Patches

**Objective**: Ensure latest Prisma 6.x patch is installed

**Current**: ^6.1.0  
**Target**: Latest 6.x patch (check npm)

**Package**: packages/database

**Actions**:

1. Check latest 6.x version:

   ```bash
   npm show @prisma/client versions --json | grep "^6"
   ```

2. If newer patch available, update:
   - packages/database/package.json (@prisma/client)
   - packages/database/package.json (prisma devDep)

3. Run `pnpm install`

4. Regenerate Prisma Client:

   ```bash
   cd packages/database && pnpm db:generate
   ```

5. Review changelog for fixes

6. Test database operations:
   ```bash
   pnpm --filter @repo/database test
   ```

**Expected Result**: Latest stable Prisma 6.x patch

---

### Task 4.7: Run Full Test Suite

**Objective**: Verify all updates work together

**Actions**:

1. Run all tests:

   ```bash
   pnpm test
   ```

2. Check for failures or warnings

3. Investigate any issues

4. Verify coverage maintained:

   ```bash
   pnpm test:coverage
   ```

5. Check coverage report for each package

**Expected Result**: All tests pass, ≥80% coverage

---

### Task 4.8: Type Check All Packages

**Objective**: Ensure no type errors from updates

**Actions**:

1. Run type-check:

   ```bash
   pnpm type-check
   ```

2. Check for any new type errors

3. Fix legitimate issues

4. Document any type-related changes

**Expected Result**: No type errors

---

### Task 4.9: Build All Packages

**Objective**: Verify builds succeed with updates

**Actions**:

1. Clean build:

   ```bash
   pnpm clean
   pnpm install
   ```

2. Build all packages:

   ```bash
   pnpm build
   ```

3. Check build times (performance)

4. Verify Turborepo cache works

5. Check build outputs

**Expected Result**: All builds successful

---

### Task 4.10: Manual Testing

**Objective**: Verify application functionality

**Actions**:

1. Start development server:

   ```bash
   pnpm dev:web
   ```

2. Test key features:
   - [ ] Authentication (sign in/up)
   - [ ] Authorization (role checks)
   - [ ] Data fetching (React Query)
   - [ ] Internationalization (locale switching)
   - [ ] Form validation
   - [ ] Database operations
   - [ ] Email sending (if testable)
   - [ ] Rate limiting (if testable)

3. Check browser console for errors

4. Test performance (no regressions)

5. Test on production build:
   ```bash
   pnpm build:web
   pnpm --filter web start
   ```

**Expected Result**: All features working correctly

---

## Deliverables

- [ ] React updated to 19.2.4
- [ ] React DOM updated to 19.2.4
- [ ] React Query updated to 5.90.21
- [ ] next-intl updated to 4.8.3
- [ ] Vitest updated to 4.0.18
- [ ] Next.js on latest 15.x patch
- [ ] Prisma on latest 6.x patch
- [ ] All tests passing
- [ ] No type errors
- [ ] All builds successful
- [ ] Manual testing complete
- [ ] Changes documented

---

## Acceptance Criteria

### Version Requirements

- [ ] React ecosystem updated
- [ ] React Query updated
- [ ] next-intl updated
- [ ] Vitest updated
- [ ] Next.js and Prisma on latest patches

### Quality Gates

- [ ] All tests pass
- [ ] Coverage ≥80% maintained
- [ ] No type errors
- [ ] No linting errors
- [ ] All builds succeed
- [ ] No console errors/warnings
- [ ] No performance regressions

### Functionality

- [ ] Authentication works
- [ ] Data fetching works
- [ ] Internationalization works
- [ ] Forms and validation work
- [ ] Database operations work

### Documentation

- [ ] Updates documented
- [ ] Changelogs reviewed
- [ ] Any breaking changes noted
- [ ] Migration notes recorded

---

## Testing Strategy

### Test Matrix

| Package     | Unit Tests | Integration Tests | Manual Testing |
| ----------- | ---------- | ----------------- | -------------- |
| apps/web    | ✅         | ✅                | ✅             |
| @repo/ui    | ✅         | ❌                | ✅             |
| @repo/email | ✅         | ⚠️ (if possible)  | ❌             |
| All others  | ✅         | ❌                | ❌             |

### Test Commands

```bash
# Full test suite
pnpm test

# With coverage
pnpm test:coverage

# Specific packages
pnpm --filter web test
pnpm --filter @repo/ui test

# Type checking
pnpm type-check

# Build verification
pnpm build

# Development mode
pnpm dev:web

# Production build
pnpm build:web
pnpm --filter web start
```

---

## Risk Assessment

| Risk                                 | Probability | Impact | Mitigation                         |
| ------------------------------------ | ----------- | ------ | ---------------------------------- |
| Breaking changes in "minor" releases | Low         | Medium | Read changelogs, test thoroughly   |
| React Query API changes              | Very Low    | Low    | Patch release, backward compatible |
| next-intl breaking changes           | Low         | Medium | Review migration guide             |
| Vitest behavior changes              | Very Low    | Low    | Patch release, test suite          |
| Performance regressions              | Low         | Medium | Monitor build/test times           |
| Type compatibility issues            | Low         | Low    | Run type-check                     |

**Overall Risk**: LOW

---

## Update Checklist by Package

### React Updates

- [ ] apps/web dependencies
- [ ] packages/email dependencies
- [ ] packages/ui devDependencies
- [ ] Test all React components
- [ ] Verify no console warnings

### React Query Updates

- [ ] apps/web dependencies
- [ ] Align devtools version
- [ ] Test query hooks
- [ ] Test mutations
- [ ] Verify cache behavior

### next-intl Updates

- [ ] apps/web dependencies
- [ ] Review migration guide
- [ ] Test translations
- [ ] Test locale switching
- [ ] Test routing

### Vitest Updates

- [ ] Root package.json
- [ ] All package devDependencies
- [ ] Run full test suite
- [ ] Check coverage reports
- [ ] Verify performance

### Framework Patches

- [ ] Check Next.js latest 15.x
- [ ] Check Prisma latest 6.x
- [ ] Update if needed
- [ ] Test thoroughly

---

## Rollback Plan

If critical issues arise:

1. Identify problematic update
2. Revert specific package.json changes
3. Run `pnpm install`
4. Re-run tests
5. Document issue

Can roll back individual updates independently.

---

## Success Criteria

The milestone is successful when:

- [ ] All planned updates applied
- [ ] All tests passing
- [ ] Coverage maintained
- [ ] No type errors
- [ ] All builds successful
- [ ] Manual testing confirms functionality
- [ ] No performance regressions
- [ ] Team can develop normally

---

## Next Steps

After completing this milestone:

1. Review update experience
2. Document any issues encountered
3. Create PR for review
4. Merge to main
5. Proceed to **Milestone 5: Test Suite Verification**

---

**Status**: Ready to start after Milestone 3 completion ✅
