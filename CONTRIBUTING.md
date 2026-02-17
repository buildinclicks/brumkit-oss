# Contributing to BrumKit

Thank you for your interest in contributing to BrumKit! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Development Setup

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/brumkit.git
cd brumkit
```

3. Install dependencies:

```bash
pnpm install
```

4. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Follow TDD (Test-Driven Development)

We strictly follow the TDD cycle:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up code while keeping tests green

### 2. Code Style

We use ESLint and Prettier for code formatting:

- Single quotes
- 2-space indentation
- Semicolons required
- Run `pnpm lint` to check for issues
- Run `pnpm format` to auto-format code

### 3. Commit Messages

Use conventional commit format:

```
feat: add notification badge to header
fix: resolve login redirect issue
docs: update README installation steps
test: add tests for notification actions
refactor: simplify permission logic
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Testing

- All new features must have tests
- Maintain 80%+ test coverage
- Run tests before committing: `pnpm test`
- Component tests should use Testing Library best practices

### 5. Code Review

- Keep pull requests focused and small
- Reference related issues
- Respond to feedback constructively
- Update documentation as needed

## Cursor Rules

This project follows specific coding patterns defined in `.cursor/rules`. Key points:

- Use Server Actions for mutations (not REST APIs)
- Use `ActionResult<T>` pattern for server action returns
- Use React Hook Form + Zod for form validation
- Use `<FieldError>` component for validation errors
- Use Tailwind CSS v4 (CSS-first configuration)
- Follow Next.js App Router patterns
- Use i18n for all user-facing strings

## Pull Request Process

1. Update tests to cover your changes
2. Ensure all tests pass: `pnpm test`
3. Run linting: `pnpm lint`
4. Run type checking: `pnpm type-check`
5. Update documentation if needed
6. Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (for UI changes)

## Project Structure

- `apps/web/` - Main Next.js application
- `packages/auth/` - Authentication & authorization
- `packages/database/` - Prisma schema & database logic
- `packages/ui/` - Shared UI components
- `packages/validation/` - Zod validation schemas

## Questions?

- Check existing issues and discussions
- Open a new issue for bugs or feature requests
- Join our community discussions

Thank you for contributing! 🎉
