# Release 0.1 - Dependency Updates and Codebase Modernization

**Status**: In Progress  
**Started**: February 17, 2026  
**Target Completion**: February 24, 2026

---

## Overview

Release 0.1 focuses on modernizing the BrumKit codebase through systematic dependency updates, version alignment, and quality improvements while maintaining stability and avoiding major breaking changes.

### Goals

1. ✅ **Audit & Analysis**: Complete codebase audit and dependency analysis
2. 🔄 **Version Alignment**: Fix all dependency version inconsistencies
3. 🔄 **ESLint Migration**: Upgrade to ESLint 10 with modern configuration
4. 🔄 **Safe Updates**: Apply minor and patch updates to dependencies
5. 🔄 **Quality Assurance**: Comprehensive testing and verification
6. 🔄 **Documentation**: Update all documentation and prepare release

### Non-Goals (Deferred to 0.2+)

- ❌ Next.js 15 → 16 upgrade (incompatibility issues)
- ❌ Prisma 6 → 7 upgrade (major architectural changes)
- ❌ Admin app scaffold
- ❌ Workers app scaffold

---

## Milestones

### [Milestone 1: Codebase Audit and Dependency Analysis](./milestone-1.md) ✅

**Status**: COMPLETE  
**Duration**: 1 day  
**Completed**: February 17, 2026

**Deliverables**:

- ✅ Complete audit of all 13 packages
- ✅ Version inconsistency analysis
- ✅ Latest versions research
- ✅ Compatibility assessments
- ✅ [Comprehensive audit report](./audit-report.md)
- ✅ Testing strategy
- ✅ Risk assessment
- ✅ Upgrade roadmap

**Key Findings**:

- 4 critical version inconsistencies identified
- ESLint 10 ready for migration
- Next.js 16 and Prisma 7 should be deferred
- Overall codebase health: GOOD

---

### [Milestone 2: Dependency Version Alignment](./milestone-2.md) 🔄

**Status**: Not Started  
**Estimated Duration**: 1-2 days  
**Risk Level**: LOW

**Objectives**:

- Align @types/node to ^25.0.6 across all packages
- Update zod to ^3.23.8 in auth package
- Align React dev dependencies to ^19.2.3
- Update @repo/email version from 0.0.0 to 0.1.0
- Verify workspace dependencies consistency

**Success Criteria**:

- All @types/node versions match
- All zod versions match
- All React dev dependencies aligned
- All builds succeed
- All tests pass
- No type errors

---

### [Milestone 3: ESLint 10 Migration](./milestone-3.md) 🔄

**Status**: Not Started  
**Estimated Duration**: 1-2 days  
**Risk Level**: LOW-MEDIUM

**Objectives**:

- Update ESLint to v10 across monorepo
- Update Node.js requirement to >=20.19.0
- Verify plugin compatibility
- Adapt to new eslint:recommended rules
- Test config lookup in monorepo context

**Success Criteria**:

- ESLint v10 installed everywhere
- All packages lint without errors
- Config lookup works correctly
- CI/CD passes
- No false positives

---

### [Milestone 4: Minor and Patch Updates](./milestone-4.md) 🔄

**Status**: Not Started  
**Estimated Duration**: 1-2 days  
**Risk Level**: LOW

**Objectives**:

- Update React to 19.2.4 (patch)
- Update @tanstack/react-query to 5.90.21 (patch)
- Update next-intl to 4.8.3 (minor)
- Update vitest to 4.0.18 (patch)
- Apply latest Next.js 15.x and Prisma 6.x patches

**Success Criteria**:

- All updates applied
- All builds succeed
- All tests pass
- No type errors
- Manual testing confirms functionality

---

### [Milestone 5: Test Suite Verification](./milestone-5.md) 🔄

**Status**: Not Started  
**Estimated Duration**: 1 day  
**Risk Level**: LOW

**Objectives**:

- Run comprehensive test suite
- Verify 80%+ coverage maintained
- Integration testing
- Performance regression testing
- Type checking verification

**Success Criteria**:

- All tests passing
- Coverage ≥80% maintained
- No linting errors
- No type errors
- All builds successful
- No performance regressions

---

### [Milestone 6: Documentation and Release](./milestone-6.md) 🔄

**Status**: Not Started  
**Estimated Duration**: 1 day  
**Risk Level**: NONE

**Objectives**:

- Update all READMEs
- Create comprehensive CHANGELOG
- Update deployment documentation
- Final verification
- Release preparation

**Success Criteria**:

- All documentation updated
- CHANGELOG.md created
- Configuration current
- All verification checks pass
- Release ready

---

## Key Documents

### Primary Documentation

- **[audit-report.md](./audit-report.md)**: Complete codebase audit with detailed findings
- **[milestone-1.md](./milestone-1.md)**: Audit milestone (COMPLETE)
- **[milestone-2.md](./milestone-2.md)**: Dependency alignment (TODO)
- **[milestone-3.md](./milestone-3.md)**: ESLint 10 migration (TODO)
- **[milestone-4.md](./milestone-4.md)**: Minor/patch updates (TODO)
- **[milestone-5.md](./milestone-5.md)**: Test verification (TODO)
- **[milestone-6.md](./milestone-6.md)**: Documentation & release (TODO)

### Quick Reference

- **Total Packages**: 13 (1 app + 12 packages)
- **Critical Issues**: 4 version inconsistencies
- **Major Updates**: 1 (ESLint 10)
- **Deferred Updates**: 2 (Next.js 16, Prisma 7)
- **Overall Risk**: LOW-MEDIUM

---

## Progress Tracking

### Overall Status

```
[████████░░░░░░░░░░░░░░░░░░░░░░░░] 20% Complete

Milestone 1: ████████████████████ 100% ✅
Milestone 2: ░░░░░░░░░░░░░░░░░░░░   0% 🔄
Milestone 3: ░░░░░░░░░░░░░░░░░░░░   0% 🔄
Milestone 4: ░░░░░░░░░░░░░░░░░░░░   0% 🔄
Milestone 5: ░░░░░░░░░░░░░░░░░░░░   0% 🔄
Milestone 6: ░░░░░░░░░░░░░░░░░░░░   0% 🔄
```

### Timeline

| Milestone     | Status      | Start Date | Target End | Actual End |
| ------------- | ----------- | ---------- | ---------- | ---------- |
| 1 - Audit     | ✅ Complete | Feb 17     | Feb 17     | Feb 17     |
| 2 - Alignment | 🔄 Pending  | -          | -          | -          |
| 3 - ESLint 10 | 🔄 Pending  | -          | -          | -          |
| 4 - Updates   | 🔄 Pending  | -          | -          | -          |
| 5 - Testing   | 🔄 Pending  | -          | -          | -          |
| 6 - Release   | 🔄 Pending  | -          | -          | -          |

---

## Critical Findings from Audit

### Version Inconsistencies (Must Fix)

1. **@types/node**: 3 packages outdated (auth, email, validation)
   - Expected: ^25.0.6
   - Found: ^20.11.5, ^22.0.0, ^22.10.5

2. **zod**: auth package outdated
   - Expected: ^3.23.8
   - Found: ^3.22.4

3. **React dev dependencies**: UI package outdated
   - Expected: ^19.2.3
   - Found: ^19.0.0

4. **@repo/email version**: Incorrect package version
   - Expected: 0.1.0
   - Found: 0.0.0

### Recommended Updates

| Package               | Current      | Latest  | Action    |
| --------------------- | ------------ | ------- | --------- |
| eslint                | 9.0.0/9.39.2 | 10.0.0  | UPDATE ✅ |
| react                 | 19.2.3       | 19.2.4  | UPDATE ✅ |
| @tanstack/react-query | 5.90.16      | 5.90.21 | UPDATE ✅ |
| next-intl             | 4.7.0        | 4.8.3   | UPDATE ✅ |
| vitest                | 4.0.16       | 4.0.18  | UPDATE ✅ |
| next                  | 15.5.10      | 16.1.6  | DEFER ❌  |
| @prisma/client        | 6.1.0        | 7.4.0   | DEFER ❌  |

### Deferred to Release 0.2+

#### Next.js 15 → 16

**Reason**: Multiple blocking issues

- Turbopack/next-intl incompatibility
- Auth.js peer dependency conflict
- Middleware → Proxy migration required

**Risk**: HIGH  
**Action**: Wait for ecosystem stability

#### Prisma 6 → 7

**Reason**: Major architectural changes

- ESM-only requirement
- Import path changes across codebase
- Generator provider changes
- Database adapter installation

**Risk**: MEDIUM-HIGH  
**Action**: Requires dedicated migration plan

---

## Testing Strategy

### TDD Approach

All changes follow Red-Green-Refactor:

1. 🔴 **RED**: Write failing test
2. 🟢 **GREEN**: Make it pass
3. 🔵 **REFACTOR**: Clean up

### Coverage Requirements

- **Minimum**: 80% coverage (line, function, branch, statement)
- **Critical paths**: 100% coverage
  - Authentication flows
  - Authorization checks
  - Data validation
  - Server actions

### Test Commands

```bash
# Full test suite
pnpm test

# With coverage
pnpm test:coverage

# Watch mode
pnpm test:watch

# Specific package
pnpm --filter @repo/auth test

# Type checking
pnpm type-check

# Build verification
pnpm build

# Linting
pnpm lint
```

---

## Risk Management

### Overall Risk Level: LOW-MEDIUM

| Milestone     | Risk Level | Mitigation                                  |
| ------------- | ---------- | ------------------------------------------- |
| 1 - Audit     | NONE       | Audit only, no changes                      |
| 2 - Alignment | LOW        | Type-only changes, incremental updates      |
| 3 - ESLint 10 | LOW-MEDIUM | Already using flat config, thorough testing |
| 4 - Updates   | LOW        | Patch/minor releases, comprehensive testing |
| 5 - Testing   | LOW        | Verification only                           |
| 6 - Release   | NONE       | Documentation updates                       |

### Mitigation Strategies

1. **Incremental Changes**: Update one package at a time
2. **Continuous Testing**: Run tests after each change
3. **Rollback Ready**: Each milestone is a separate branch/PR
4. **Staging First**: Test in staging before production
5. **Monitoring**: Set up error alerts and performance monitoring

---

## Success Criteria for Release 0.1

### Must Have

- [x] Complete codebase audit
- [ ] All version inconsistencies resolved
- [ ] ESLint 10 successfully migrated
- [ ] All safe updates applied
- [ ] 80%+ test coverage maintained
- [ ] All tests passing
- [ ] No linting errors
- [ ] No type errors
- [ ] All builds successful
- [ ] Documentation updated
- [ ] CHANGELOG created

### Quality Gates

- ✅ All automated tests pass
- ✅ Type checking passes
- ✅ Linting passes
- ✅ Build succeeds for all packages
- ✅ Coverage ≥80%
- ✅ No performance regressions
- ✅ Manual testing confirms functionality
- ✅ Documentation is current

---

## Team Guidelines

### Development Workflow

1. Start with failing test (TDD)
2. Make minimal changes to pass
3. Refactor with tests green
4. Run full test suite
5. Check for type errors
6. Run linting
7. Update documentation

### Before Committing

- [ ] All tests pass
- [ ] No linting errors
- [ ] No type errors
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] CHANGELOG entry added (if applicable)

### Code Review Checklist

- [ ] Tests included for changes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Follows TDD approach
- [ ] Maintains consistency
- [ ] Performance impact considered

---

## Resources

### Reference Documentation

- [Previous Release 0.0](../release-0.0/README.md)
- [BrumKit Root README](../../../README.md)
- [Contributing Guidelines](../../../CONTRIBUTING.md)

### External Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma 6 Documentation](https://www.prisma.io/docs)
- [ESLint 10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

## Contact & Support

For questions or issues with Release 0.1:

1. Review milestone documentation
2. Check audit report for details
3. Consult testing strategy
4. Refer to risk assessment

---

**Last Updated**: February 17, 2026  
**Next Milestone**: Milestone 2 - Dependency Version Alignment  
**Status**: Ready to proceed ✅
