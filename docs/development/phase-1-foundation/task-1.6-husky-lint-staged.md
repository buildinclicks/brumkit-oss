# Task 1.6: Husky + lint-staged Setup

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Phase**: Foundation

---

## 📋 Task Description

Set up Git hooks using Husky and lint-staged to:

- Automatically lint and format code before commits
- Enforce conventional commit messages
- Run linters before pushing
- Maintain code quality across the entire team

---

## ✅ What Was Implemented

### 1. Dependencies Installed

```json
{
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7"
  }
}
```

### 2. Husky Configuration

Initialized Husky in `.husky/` directory with three hooks:

#### Pre-Commit Hook (`.husky/pre-commit`)

```bash
pnpm lint-staged
```

**Purpose**: Lint and format staged files before commit

**What it does**:

- Runs ESLint on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Auto-fixes fixable issues
- Formats all staged files with Prettier
- Prevents commit if unfixable errors exist

#### Pre-Push Hook (`.husky/pre-push`)

```bash
#!/bin/sh

echo "🔍 Running linters before push..."

pnpm lint

if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before pushing."
  exit 1
fi

echo "✅ All checks passed!"
```

**Purpose**: Run full lint check before pushing to remote

**What it does**:

- Runs `pnpm lint` (lints all packages via Turborepo)
- Prevents push if any linting errors exist
- Catches issues before they reach the remote repository

#### Commit Message Hook (`.husky/commit-msg`)

```bash
#!/bin/sh

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Conventional commit pattern
pattern="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Commit message must follow conventional commits:"
  echo "  <type>(<scope>): <subject>"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
  exit 1
fi
```

**Purpose**: Enforce conventional commit message format

**Valid examples**:

- `feat: add user authentication`
- `fix(api): resolve database connection issue`
- `docs: update README with setup instructions`
- `refactor(auth): simplify token validation`

### 3. lint-staged Configuration

Added to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**What this means**:

- **JS/TS files**: Lint with ESLint → Auto-fix → Format with Prettier
- **JSON/Markdown/YAML**: Format with Prettier only

### 4. Package.json Scripts

Added/updated scripts:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\"",
    "prepare": "husky"
  }
}
```

- `prepare`: Automatically runs when `pnpm install` is executed (sets up Husky)
- `format:check`: Check formatting without making changes

### 5. Documentation

Created `docs/git-hooks-guide.md` with:

- Explanation of Git hooks
- Description of each hook
- lint-staged configuration details
- How to bypass hooks (emergency only)
- Troubleshooting guide
- Best practices
- IDE integration tips
- Team workflow recommendations

---

## 🧪 How to Verify

### 1. Check Husky Installation

```powershell
cd D:\PRODUCTS\react-masters
ls .husky
```

**Expected files**:

- `_/` (Husky internals)
- `pre-commit`
- `pre-push`
- `commit-msg`

### 2. Test Pre-Commit Hook

Create a test file with intentional issues:

```powershell
# Create test file with formatting issues
echo "const  x  =  1" > test-file.js

# Stage it
git add test-file.js

# Try to commit (hook should run)
git commit -m "test: verify pre-commit hook"
```

**Expected**:

- Prettier formats the file
- ESLint checks for errors
- Commit succeeds if no unfixable errors

### 3. Test Commit Message Hook

```powershell
# Try invalid commit message
git commit -m "updated code"
```

**Expected**:

```
❌ Invalid commit message format!

Commit message must follow conventional commits:
  <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

```powershell
# Try valid commit message
git commit -m "test: verify commit message hook"
```

**Expected**: Commit succeeds

### 4. Test Pre-Push Hook

```powershell
# Try to push (will run lint on all packages)
git push origin main
```

**Expected**:

```
🔍 Running linters before push...
✅ All checks passed!
```

### 5. Verify lint-staged Works

```powershell
# Run lint-staged manually
pnpm lint-staged
```

**Expected**: Runs on staged files only

---

## 🎓 Key Concepts Learned

### 1. Git Hooks Lifecycle

```
┌─────────────────────────────────────────┐
│         Git Commit Workflow             │
└─────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   git add files      │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   git commit -m ""   │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  pre-commit hook     │◄─── lint-staged runs
         │  (lint & format)     │
         └──────────────────────┘
                    │
            ┌───────┴────────┐
            │                │
            ▼                ▼
       [Errors?]         [Success]
            │                │
            ▼                ▼
      ❌ Abort          commit-msg hook
                        (validate format)
                             │
                     ┌───────┴────────┐
                     │                │
                     ▼                ▼
                [Invalid?]       [Valid]
                     │                │
                     ▼                ▼
                ❌ Abort         ✅ Commit created
```

### 2. lint-staged Philosophy

**Why lint-staged?**

- Only checks **staged files** (fast)
- Doesn't waste time on unchanged files
- Works well in large monorepos
- Catches issues at commit time

**Without lint-staged**:

```bash
# Slow - lints entire codebase
eslint .
```

**With lint-staged**:

```bash
# Fast - lints only staged files
lint-staged
```

### 3. Conventional Commits

**Format**: `<type>(<scope>): <subject>`

**Why?**

- ✅ Clear, consistent commit history
- ✅ Auto-generate changelogs
- ✅ Semantic versioning automation
- ✅ Easy to understand what changed

**Types**:

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation only
- `style`: Code style (no logic change)
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

---

## 📝 Best Practices Established

### 1. Commit Small, Logical Changes

```bash
# ✅ Good - focused change
git add src/components/Button.tsx
git commit -m "feat: add Button component"

# ❌ Bad - too broad
git add .
git commit -m "feat: various updates"
```

### 2. Write Descriptive Messages

```bash
# ✅ Good
git commit -m "fix(api): handle null response from database query"

# ❌ Bad
git commit -m "fix: bug"
```

### 3. Use Scopes for Context

```bash
git commit -m "feat(admin): add user management dashboard"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(docker): add setup instructions"
```

### 4. Don't Bypass Hooks

```bash
# ❌ Avoid (unless emergency)
git commit --no-verify -m "quick fix"

# ✅ Good - fix issues properly
# Fix linting errors, then commit normally
git commit -m "fix: resolve linting errors"
```

---

## 🔧 Troubleshooting Reference

### Hook Not Running

**Symptom**: Commits succeed without running hooks

**Solutions**:

1. Run `pnpm prepare` to initialize Husky
2. Check `.husky/` directory exists
3. Ensure Git hooks path is correct: `git config core.hooksPath .husky`

### ESLint Errors Can't Be Fixed

**Symptom**: Pre-commit fails with ESLint errors

**Solutions**:

1. Read the error message carefully
2. Fix the issue manually
3. Try committing again
4. If rule is wrong, discuss with team

### Prettier Conflicts

**Symptom**: Files keep changing format

**Solutions**:

1. Run `pnpm format` to format all files
2. Commit the formatted files
3. Let Prettier handle all formatting (don't fight it)

### Commit Message Rejected

**Symptom**: "Invalid commit message format!"

**Solution**: Use conventional commits format:

```bash
git commit -m "feat: add new feature"
git commit -m "fix(api): resolve bug"
```

---

## 🎯 Integration with Other Tools

### IDE (VS Code / Cursor)

Install extensions:

- **ESLint** - Show linting errors inline
- **Prettier** - Format on save

Recommended settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### CI/CD (Future)

Hooks complement CI/CD:

- **Hooks**: Fast feedback locally
- **CI/CD**: Complete validation remotely

Both run similar checks for defense in depth.

---

## 📊 Benefits Achieved

✅ **Code Quality**: Catch errors before they enter the repository  
✅ **Consistency**: Uniform code style across the entire team  
✅ **Clean History**: Readable, semantic commit messages  
✅ **Fast Feedback**: Issues caught immediately, not in code review  
✅ **Time Savings**: Fewer review cycles, less back-and-forth  
✅ **Best Practices**: Enforced automatically, no manual policing

---

## 📝 Notes & Considerations

### Performance

- lint-staged only checks staged files (fast even in large repos)
- Pre-push hook checks all packages (slower, but prevents bad pushes)

### Team Adoption

- Hooks help new team members follow standards
- Clear error messages guide developers
- Documentation helps troubleshoot issues

### Escape Hatches

- `--no-verify` flag exists for emergencies
- Should be rarely used
- Team should discuss if hooks are too strict

### Future Enhancements

- Add commit linting with `@commitlint/cli`
- Add type checking in pre-commit hook
- Add test running for changed files
- Add branch name validation

---

## ✅ Task Complete!

**Files Created/Modified**:

- `.husky/pre-commit` (lint and format staged files)
- `.husky/pre-push` (run linters before push)
- `.husky/commit-msg` (enforce conventional commits)
- `package.json` (added lint-staged config and scripts)
- `docs/git-hooks-guide.md` (comprehensive guide)
- `docs/development/phase-1-foundation/task-1.6-husky-lint-staged.md` (this file)

**Dependencies Installed**:

- `husky@9.1.7`
- `lint-staged@16.2.7`

**Ready for**: Task 1.7 (Vitest setup)

---

## 🚀 Next Steps

Git hooks are now protecting our codebase! Next tasks:

1. Task 1.7: Setup Vitest for testing
2. Task 1.8: Create `@repo/types` package
3. Task 1.9: Create `@repo/utils` package

The foundation is getting stronger! 🪝
