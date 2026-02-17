# Milestone 2: Dependency Version Alignment

**Status**: Not Started  
**Prerequisites**: Milestone 1 Complete  
**Estimated Effort**: 1-2 days  
**Risk Level**: LOW

---

## Goal

Fix all dependency version inconsistencies across the BrumKit monorepo to ensure consistency, eliminate type conflicts, and establish a solid foundation for subsequent updates.

---

## Context

The audit identified 4 critical version inconsistencies that must be resolved:

1. @types/node scattered across 3 different versions
2. zod version mismatch between packages
3. React dev dependencies outdated in UI package
4. @repo/email package version incorrect (0.0.0)

These inconsistencies can lead to:

- Type checking errors
- Build failures
- Runtime bugs from API differences
- Developer confusion

---

## Tasks

### Task 2.1: Align @types/node Versions

**Objective**: Update all packages to use @types/node ^25.0.6

**Current State**:

- ✅ Correct (^25.0.6): database, types, utils, rate-limit, config-typescript, web
- ❌ Outdated: auth (^20.11.5), email (^22.0.0), validation (^22.10.5)

**Actions**:

1. Update packages/auth/package.json
2. Update packages/email/package.json
3. Update packages/validation/package.json
4. Run `pnpm install`
5. Run type-check for each updated package
6. Run full type-check across monorepo
7. Verify builds succeed

**Expected Result**: All packages use @types/node ^25.0.6

---

### Task 2.2: Align zod Versions

**Objective**: Update auth package to use zod ^3.23.8

**Current State**:

- ✅ Correct (^3.23.8): validation, web
- ❌ Outdated: auth (^3.22.4)

**Actions**:

1. Update packages/auth/package.json
2. Run `pnpm install`
3. Run tests in auth package
4. Check for any API changes in zod 3.22.4 → 3.23.8
5. Verify validation still works correctly

**Expected Result**: All packages use zod ^3.23.8

---

### Task 2.3: Align React Dev Dependencies

**Objective**: Update UI package React dev dependencies to latest

**Current State**:

- ❌ Outdated: packages/ui react (^19.0.0), @types/react (^19.0.8), @types/react-dom (^19.0.3)
- ✅ Correct: web, email, config-typescript all use latest

**Actions**:

1. Update packages/ui/package.json devDependencies:
   - react: ^19.0.0 → ^19.2.3
   - @types/react: ^19.0.8 → ^19.2.8
   - @types/react-dom: ^19.0.3 → ^19.2.3
2. Run `pnpm install`
3. Run tests in UI package
4. Verify components render correctly
5. Check for any breaking changes

**Expected Result**: UI package uses latest React dev dependencies

---

### Task 2.4: Update @repo/email Package Version

**Objective**: Change package version from 0.0.0 to 0.1.0

**Current State**:

- packages/email/package.json: "version": "0.0.0"

**Actions**:

1. Update packages/email/package.json version field
2. Run `pnpm install` (updates lockfile)
3. Verify no breaking changes
4. Build email package

**Expected Result**: Email package version is 0.1.0

---

### Task 2.5: Verify Workspace Dependencies

**Objective**: Ensure all workspace dependencies use workspace:\* protocol

**Actions**:

1. Review all package.json files
2. Check workspace dependency declarations
3. Verify pnpm-workspace.yaml configuration
4. Run `pnpm install` to verify lockfile
5. Check for any hoisting issues

**Expected Result**: All internal dependencies use workspace:\* correctly

---

### Task 2.6: Run Full Test Suite

**Objective**: Verify all changes don't break functionality

**Actions**:

1. Generate Prisma client: `cd packages/database && pnpm db:generate`
2. Run full test suite: `pnpm test`
3. Check coverage reports
4. Verify all tests pass
5. Document any failures

**Expected Result**: All tests pass with ≥80% coverage

---

### Task 2.7: Type Check All Packages

**Objective**: Verify no type errors introduced

**Actions**:

1. Run type-check across all packages: `pnpm type-check`
2. Check each package individually if errors
3. Fix any type errors
4. Document changes made

**Expected Result**: No type errors in any package

---

### Task 2.8: Build All Packages

**Objective**: Verify builds succeed after alignment

**Actions**:

1. Run full build: `pnpm build`
2. Check build outputs
3. Verify Turborepo cache works
4. Check for any build warnings

**Expected Result**: All packages build successfully

---

## Deliverables

- [ ] All @types/node versions aligned to ^25.0.6
- [ ] All zod versions aligned to ^3.23.8
- [ ] React dev dependencies updated in UI package
- [ ] @repo/email version updated to 0.1.0
- [ ] All workspace dependencies verified
- [ ] Full test suite passing
- [ ] No type errors
- [ ] All builds successful
- [ ] Changes documented

---

## Acceptance Criteria

### Version Consistency

- [ ] All @types/node dependencies are ^25.0.6
- [ ] All zod dependencies are ^3.23.8
- [ ] All React dev dependencies aligned
- [ ] All package versions follow 0.1.0 convention

### Quality Gates

- [ ] All tests pass
- [ ] Coverage ≥80% maintained
- [ ] No type errors
- [ ] No linting errors
- [ ] All builds succeed
- [ ] No runtime errors in dev mode

### Documentation

- [ ] Changes documented
- [ ] Migration notes recorded
- [ ] Any issues documented

---

## Testing Strategy

### Test Types

1. **Type Checking**: Verify no type errors from version updates
2. **Unit Tests**: All package tests must pass
3. **Build Tests**: All packages must build successfully
4. **Integration Tests**: Cross-package functionality verified

### Test Commands

```bash
# Type checking
pnpm type-check

# Full test suite
pnpm test

# Build verification
pnpm build

# Specific package tests
pnpm --filter @repo/auth test
pnpm --filter @repo/email test
pnpm --filter @repo/validation test
pnpm --filter @repo/ui test

# Prisma client generation
cd packages/database && pnpm db:generate
```

---

## Risk Assessment

| Risk                                | Probability | Impact | Mitigation                     |
| ----------------------------------- | ----------- | ------ | ------------------------------ |
| Type errors from @types/node update | Medium      | Low    | Test each package individually |
| API changes in zod 3.22.4 → 3.23.8  | Low         | Low    | Review changelog, run tests    |
| React type changes                  | Low         | Low    | UI package tests               |
| Build failures                      | Low         | Medium | Update incrementally           |

**Overall Risk**: LOW

---

## Rollback Plan

If critical issues arise:

1. Revert package.json changes
2. Run `pnpm install`
3. Verify rollback successful
4. Document issue for investigation

Each package can be reverted independently.

---

## Success Criteria

The milestone is successful when:

- [ ] All version inconsistencies resolved
- [ ] All tests passing
- [ ] No type errors
- [ ] All builds successful
- [ ] Coverage maintained
- [ ] No regressions identified

---

## Next Steps

After completing this milestone:

1. Review all changes
2. Create PR for review
3. Merge to main
4. Proceed to **Milestone 3: ESLint 10 Migration**

---

**Status**: Ready to start after Milestone 1 completion ✅
