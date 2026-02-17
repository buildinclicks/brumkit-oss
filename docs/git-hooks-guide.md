# Git Hooks Guide

This project uses **Husky** and **lint-staged** to enforce code quality through Git hooks.

## What Are Git Hooks?

Git hooks are scripts that run automatically at specific points in the Git workflow (before commit, before push, etc.). They help catch issues early and maintain code quality.

## Installed Hooks

### 1. Pre-Commit Hook (`.husky/pre-commit`)

**Runs**: Before every commit  
**Purpose**: Lint and format staged files

**What it does**:

- Runs ESLint on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Fixes auto-fixable issues
- Formats all staged files with Prettier
- **Prevents commit** if unfixable errors exist

**Example**:

```bash
git add src/component.tsx
git commit -m "feat: add new component"
# Hook runs automatically:
# ✅ ESLint checks component.tsx
# ✅ Prettier formats component.tsx
# ✅ Commit proceeds if no errors
```

### 2. Pre-Push Hook (`.husky/pre-push`)

**Runs**: Before pushing to remote  
**Purpose**: Run linters across all packages

**What it does**:

- Runs `pnpm lint` (lints all packages via Turborepo)
- **Prevents push** if linting fails
- Catches issues before they reach the remote repository

**Example**:

```bash
git push origin main
# Hook runs automatically:
# 🔍 Running linters before push...
# ✅ All checks passed!
# Push proceeds
```

### 3. Commit Message Hook (`.husky/commit-msg`)

**Runs**: After entering commit message  
**Purpose**: Enforce conventional commit format

**What it does**:

- Validates commit message format
- **Prevents commit** if format is invalid
- Ensures consistent commit history

**Valid formats**:

```
<type>(<scope>): <subject>

Types:
  - feat:     New feature
  - fix:      Bug fix
  - docs:     Documentation changes
  - style:    Code style (formatting, semicolons, etc.)
  - refactor: Code refactoring
  - test:     Adding/updating tests
  - chore:    Maintenance tasks
  - perf:     Performance improvements
  - ci:       CI/CD changes
  - build:    Build system changes
  - revert:   Revert previous commit
```

**Examples**:

```bash
# ✅ Valid
git commit -m "feat: add user authentication"
git commit -m "fix(api): resolve database connection issue"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(auth): simplify token validation"

# ❌ Invalid
git commit -m "added new feature"           # Wrong: no type
git commit -m "feat add feature"            # Wrong: missing colon
git commit -m "updated code"                # Wrong: no type
```

## lint-staged Configuration

Defined in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**What this means**:

- **JavaScript/TypeScript files**: Lint with ESLint, then format with Prettier
- **JSON/Markdown/YAML files**: Format with Prettier only

## Bypassing Hooks (Emergency Only)

⚠️ **Use only when absolutely necessary!**

### Skip pre-commit and commit-msg:

```bash
git commit --no-verify -m "emergency fix"
```

### Skip pre-push:

```bash
git push --no-verify
```

**When to bypass**:

- Emergency hotfixes
- Work-in-progress commits for backup
- CI/CD issues

**Never bypass for**:

- Regular development
- Code reviews
- Production deployments

## Troubleshooting

### Hook not running

**Cause**: Husky not initialized  
**Solution**:

```bash
pnpm prepare
```

### Permission errors on Windows

**Cause**: Git bash script execution  
**Solution**: Hooks should work in PowerShell. If issues persist:

```bash
git config core.hooksPath .husky
```

### ESLint errors can't be fixed

**Cause**: Code violates ESLint rules  
**Solution**:

1. Read the error message
2. Fix the issue manually
3. Try committing again

**Example**:

```
❌ error  'useState' is not defined  no-undef

Fix: import { useState } from "react";
```

### Prettier formatting conflicts

**Cause**: Manual formatting vs. Prettier  
**Solution**: Let Prettier handle all formatting

```bash
pnpm format
```

### Commit message rejected

**Cause**: Doesn't follow conventional commits  
**Solution**: Use correct format

```bash
# ❌ Bad
git commit -m "fixed bug"

# ✅ Good
git commit -m "fix: resolve authentication bug"
```

## Manual Commands

Run the same checks manually:

```bash
# Format all files
pnpm format

# Check formatting (no changes)
pnpm format:check

# Lint all packages
pnpm lint

# Lint and format staged files (like pre-commit)
pnpm lint-staged
```

## Best Practices

### 1. Commit Small, Logical Changes

```bash
# ✅ Good - single feature
git add src/auth/login.tsx
git commit -m "feat(auth): add login form"

# ❌ Bad - multiple unrelated changes
git add .
git commit -m "feat: various updates"
```

### 2. Fix Issues Immediately

When a hook fails, fix the issue right away. Don't bypass unless emergency.

### 3. Use Descriptive Commit Messages

```bash
# ✅ Good - clear and specific
git commit -m "fix(api): handle null response from database"

# ❌ Bad - vague
git commit -m "fix: bug fix"
```

### 4. Stage Related Files Together

```bash
# ✅ Good
git add src/components/Button.tsx src/components/Button.test.tsx
git commit -m "feat: add Button component with tests"
```

### 5. Use Scopes for Context

```bash
git commit -m "feat(admin): add user management dashboard"
git commit -m "fix(api): resolve CORS configuration"
git commit -m "docs(setup): add Docker installation guide"
```

## IDE Integration

### VS Code

Install extensions:

- **ESLint** - Shows linting errors in editor
- **Prettier** - Formats on save

Settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Cursor

Same as VS Code (Cursor is VS Code-based).

## Team Workflow

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feat/user-authentication
   ```

3. **Make changes and commit** (hooks run automatically)

   ```bash
   git add src/auth/
   git commit -m "feat(auth): implement JWT authentication"
   ```

4. **Push to remote** (pre-push hook runs)

   ```bash
   git push origin feat/user-authentication
   ```

5. **Create pull request**
   - Hooks ensure code quality before PR
   - Reviewers see clean, formatted code
   - CI/CD runs additional checks

## Benefits

✅ **Consistent Code Style** - Prettier ensures uniform formatting  
✅ **Catch Errors Early** - ESLint catches bugs before commit  
✅ **Clean Git History** - Conventional commits improve readability  
✅ **Faster Reviews** - Pre-formatted, pre-linted code  
✅ **Prevent Bad Commits** - Hooks stop problematic code from entering repo  
✅ **Team Alignment** - Everyone follows same standards

## FAQ

**Q: Can I customize the rules?**  
A: Yes! Edit `.eslintrc` and `.prettierrc` configs.

**Q: Why is my commit so slow?**  
A: Hooks run linting/formatting. Larger changesets take longer.

**Q: Can I disable hooks temporarily?**  
A: Yes, but not recommended. Use `--no-verify` flag.

**Q: What if I disagree with an ESLint rule?**  
A: Discuss with team. If consensus, disable in `.eslintrc`.

**Q: Do hooks run in CI?**  
A: No, but CI runs similar checks. Hooks prevent bad commits locally.

---

**Remember**: Hooks are your friends! They catch issues early and save time in code review.
