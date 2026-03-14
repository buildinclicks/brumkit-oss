# BrumKit - Project Status & Developer Guide (Open Source Edition)

> **Version:** 0.1.0 - Open Source Edition  
> **Last Updated:** February 2026  
> **Purpose:** A comprehensive guide for developers joining the BrumKit open-source project

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current Features](#current-features)
3. [Monorepo Architecture](#monorepo-architecture)
4. [Package Dependencies](#package-dependencies)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [Development Rules & Conventions](#development-rules--conventions)
8. [Cursor AI Integration](#cursor-ai-integration)
9. [Development Workflow](#development-workflow)
10. [Docker Setup](#docker-setup)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [In-Progress Features](#in-progress-features)
14. [Future Roadmap](#future-roadmap)
15. [Known Gaps & Missing Functionality](#known-gaps--missing-functionality)

---

## Project Overview

BrumKit is a **production-ready Next.js 15 starter kit** designed for building modern web applications. This open-source edition focuses on authentication, authorization, and core features without OAuth providers or advanced content management systems.

### Key Characteristics

- **Monorepo Architecture**: Turborepo + pnpm workspaces
- **Full-Stack Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Email/password with Auth.js (NextAuth v5)
- **Authorization**: Role-based + Attribute-based access control with CASL
- **UI Components**: Tailwind CSS v4 + shadcn/ui
- **Testing**: TDD-first approach with Vitest

### Project Goals

| Goal                     | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Reusability**          | Serve as a foundation for web applications                  |
| **Production-Ready**     | Secure auth, migrations, CI-friendly                        |
| **Developer Experience** | Excellent DX with TypeScript, hot-reload, and great tooling |
| **Learning-Friendly**    | Well-documented Docker setup for local development          |
| **Modularity**           | Pluggable packages under `@repo/*` namespace                |

---

## Current Features

### ✅ Implemented Features

#### Authentication & Security

- [x] Email/Password authentication with bcryptjs hashing
- [x] JWT-based sessions
- [x] Email verification flow (soft verification)
- [x] Password reset with secure tokens
- [x] Rate limiting (Redis-based) for all auth endpoints
- [x] Route protection via Next.js middleware

> **Note**: OAuth providers (Google, GitHub) are not included in the open-source edition.

#### User Management

- [x] User registration with validation
- [x] Profile management (name, username, bio, image)
- [x] Password change functionality
- [x] Email change with verification
- [x] Account deletion with 30-day grace period
- [x] Soft delete pattern implementation

#### Authorization

- [x] Role-based access control (SUPER_ADMIN, ADMIN, MODERATOR, USER)
- [x] CASL-based permission system
- [x] Server-side permission guards

#### Email System

- [x] SMTP integration for production
- [x] Email templates with React Email:
  - Verification email
  - Welcome email
  - Password reset email
  - Password changed notification

#### UI Components

- [x] shadcn/ui components
- [x] Dark mode support via next-themes
- [x] Form components with React Hook Form + Zod
- [x] Loading skeletons
- [x] Toast notifications (Sonner)

#### Infrastructure

- [x] Docker Compose for local services
- [x] Rate limiting package with Redis
- [x] Validation schemas with Zod
- [x] Shared configuration packages (ESLint, TypeScript, Tailwind, Vitest)
- [x] Vercel deployment configuration
- [x] Cron job for account cleanup

---

## Monorepo Architecture

```
brumkit/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App Router pages and API routes
│       │   ├── (auth)/         # Auth pages (login, register, etc.)
│       │   ├── (dashboard)/    # Protected pages (dashboard, profile)
│       │   ├── actions/        # Server Actions
│       │   └── api/            # API routes (auth, cron, user)
│       ├── components/         # App-specific components
│       ├── lib/                # Utilities, hooks, services
│       └── messages/           # i18n messages
│
├── packages/
│   ├── auth/                   # @repo/auth - Authentication & authorization
│   ├── config-eslint/          # @repo/config-eslint - ESLint configurations
│   ├── config-tailwind/        # @repo/config-tailwind - Tailwind preset
│   ├── config-typescript/      # @repo/config-typescript - TS configs
│   ├── config-vitest/          # @repo/config-vitest - Vitest configurations
│   ├── database/               # @repo/database - Prisma client & schema
│   ├── email/                  # @repo/email - Email service & templates
│   ├── rate-limit/             # @repo/rate-limit - Redis rate limiter
│   ├── types/                  # @repo/types - Shared TypeScript types
│   ├── ui/                     # @repo/ui - UI component library
│   ├── utils/                  # @repo/utils - Shared utilities
│   └── validation/             # @repo/validation - Zod schemas
│
├── docker/                     # Docker Compose configuration
├── docs/                       # Project documentation
│   ├── deployment/             # Deployment guides
│   ├── development/            # Phase-by-phase development docs
│   ├── setup/                  # Setup guides (Redis, Email)
│   └── open-source-version/    # Open-source release documentation
└── scripts/                    # Utility scripts
```

### Package Naming Convention

All internal packages use the `@repo/<name>` namespace:

```typescript
// Importing from packages
import { auth } from '@repo/auth';
import { db } from '@repo/database';
import { Button } from '@repo/ui';
import { loginSchema } from '@repo/validation';
```

---

## Package Dependencies

### Dependency Flow

```
┌─────────────────────────────────────────────────────┐
│                    apps/web                          │
│                       │                              │
│    ┌─────────────────┴────────────────────┐        │
│    │            Uses All Packages          │        │
│    └─────────────────┬────────────────────┘        │
└──────────────────────┼──────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│  @repo/  │    │  @repo/  │    │  @repo/  │
│   auth   │    │    ui    │    │   email  │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     ▼               │               │
┌──────────┐         │               │
│  @repo/  │◄────────┘               │
│ database │                         │
└────┬─────┘                         │
     │                               │
     └───────────────┬───────────────┘
                     ▼
              ┌──────────────┐
              │   @repo/     │
              │  validation  │
              └──────────────┘
                     │
                     ▼
         ┌────────────────────┐
         │   Config Packages  │
         │ (eslint, ts, etc.) │
         └────────────────────┘
```

### Package Descriptions

| Package            | Purpose                        | Key Exports                                       |
| ------------------ | ------------------------------ | ------------------------------------------------- |
| `@repo/auth`       | Authentication & authorization | `auth`, `signIn`, `signOut`, `defineAbilitiesFor` |
| `@repo/database`   | Prisma client & types          | `db`, `prisma`, Prisma types                      |
| `@repo/validation` | Zod validation schemas         | `loginSchema`, `registerSchema`, etc.             |
| `@repo/ui`         | UI components                  | shadcn/ui components, `cn()` utility              |
| `@repo/email`      | Email service                  | `sendVerificationEmail`, templates                |
| `@repo/rate-limit` | Rate limiting                  | `RedisRateLimiter`                                |
| `@repo/types`      | Shared types                   | Common TypeScript interfaces                      |
| `@repo/utils`      | Utility functions              | Helper functions                                  |

---

## Database Schema

### High-Level Overview

The database uses **PostgreSQL** with **Prisma ORM**. The schema is designed for a community-style application with future expansion in mind.

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AUTH MODELS (Auth.js Compatible)                               │
│  ┌──────────┐     ┌──────────┐     ┌───────────────────┐       │
│  │   User   │────►│ Account  │     │ VerificationToken │       │
│  │          │────►│ Session  │     │                   │       │
│  └──────────┘     └──────────┘     └───────────────────┘       │
│       │                                                          │
│       │  SYSTEM MODELS                                          │
│       │  ┌──────────────┐                                       │
│       └─►│ Notification │                                       │
│          └──────────────┘                                       │
│                                                                  │
│  ENUMS                                                          │
│  ┌────────────────────────────────────────────┐                 │
│  │ UserRole: SUPER_ADMIN, ADMIN, MODERATOR,   │                 │
│  │           USER                              │                 │
│  │ NotificationType: SYSTEM, ACCOUNT, SECURITY│                 │
│  └────────────────────────────────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Models

#### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  username      String?   @unique  // Public handle (@username)
  password      String?             // Hashed with bcryptjs
  image         String?
  bio           String?   @db.Text
  role          UserRole  @default(USER)

  // Email change flow
  emailChangeToken       String?   @unique
  emailChangeTokenExpiry DateTime?
  newEmail               String?

  // Soft delete (30-day grace period)
  deletedAt DateTime?
  isDeleted Boolean   @default(false)

  // Relations
  accounts      Account[]
  sessions      Session[]
  notifications Notification[]
}
```

#### Roles & Permissions

| Role            | Permissions                                     |
| --------------- | ----------------------------------------------- |
| **SUPER_ADMIN** | Full control over all resources                 |
| **ADMIN**       | Manage users, articles, tags; moderate comments |
| **MODERATOR**   | Read all, moderate content, manage tags         |
| **USER**        | Read public content, manage own resources       |

### Database Commands

```bash
# Generate Prisma client
pnpm --filter @repo/database db:generate

# Push schema changes (development)
pnpm --filter @repo/database db:push

# Create migration
pnpm --filter @repo/database db:migrate

# Open Prisma Studio
pnpm --filter @repo/database db:studio

# Seed database
pnpm --filter @repo/database db:seed

# Reset database (WARNING: deletes data)
pnpm --filter @repo/database db:reset
```

---

## Authentication System

### Auth Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REGISTRATION                                                    │
│  ┌────────┐   ┌───────────┐   ┌──────────┐   ┌─────────────┐   │
│  │  User  │──►│  Validate │──►│  Hash    │──►│   Create    │   │
│  │  Input │   │  + Rate   │   │ Password │   │   Account   │   │
│  └────────┘   │  Limit    │   └──────────┘   └──────┬──────┘   │
│               └───────────┘                          │          │
│                                                      ▼          │
│                                    ┌──────────────────────────┐ │
│                                    │ Send Verification Email  │ │
│                                    └──────────────────────────┘ │
│                                                                  │
│  LOGIN                                                          │
│  ┌────────┐   ┌───────────┐   ┌──────────┐   ┌─────────────┐   │
│  │  User  │──►│  Validate │──►│  Verify  │──►│   Create    │   │
│  │  Input │   │  + Rate   │   │ Password │   │   Session   │   │
│  └────────┘   │  Limit    │   └──────────┘   └─────────────┘   │
│               └───────────┘                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Rate Limiting

All authentication endpoints are protected with Redis-based rate limiting:

| Action                     | Limit       | Window     |
| -------------------------- | ----------- | ---------- |
| Login (per email)          | 5 attempts  | 15 minutes |
| Login (per IP)             | 20 attempts | 15 minutes |
| Register (per email)       | 3 attempts  | 1 hour     |
| Register (per IP)          | 10 attempts | 1 hour     |
| Password Reset (per email) | 3 attempts  | 5 minutes  |
| Password Reset (per IP)    | 10 attempts | 5 minutes  |

### Middleware Protection

```typescript
// apps/web/middleware.ts
export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Protected routes require authentication
  if (isProtectedRoute && !isLoggedIn) {
    redirect('/login');
  }

  // Auth routes redirect logged-in users
  if (isAuthRoute && isLoggedIn) {
    redirect('/dashboard');
  }
});
```

### Using Authentication in Components

```typescript
// Server Component
import { auth } from '@repo/auth';

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.name}</div>;
}
```

```typescript
// Server Action
'use server';
import { getCurrentUser, requireAuth } from '@repo/auth';

export async function myAction() {
  const user = await requireAuth(); // Throws if not authenticated
  // ... action logic
}
```

---

## Development Rules & Conventions

### Code Style & Formatting

| Rule          | Tool         | Configuration                     |
| ------------- | ------------ | --------------------------------- |
| Formatting    | Prettier     | Default config                    |
| Linting       | ESLint 9     | Flat config in `eslint.config.js` |
| Type Checking | TypeScript 5 | Strict mode enabled               |

### File Naming Conventions

```
components/
  my-component.tsx       # Kebab-case for files
  my-component.test.tsx  # Test files alongside source

lib/
  utils/
    some-utility.ts      # Kebab-case for utility files

app/
  (group)/               # Route groups in parentheses
  page.tsx               # Page components
  layout.tsx             # Layout components
  loading.tsx            # Loading states
  error.tsx              # Error boundaries
```

### Import Organization

```typescript
// 1. External packages (React, Next.js, third-party)
import { NextResponse } from 'next/server';
import { useForm } from 'react-hook-form';

// 2. Internal packages (@repo/*)
import { auth } from '@repo/auth';
import { db } from '@repo/database';
import { Button } from '@repo/ui';

// 3. Local imports (relative paths)
import { MyComponent } from '@/components/my-component';
import { someUtil } from '@/lib/utils';
```

### Component Patterns

```typescript
// Use async Server Components for data fetching
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Use 'use client' directive only when needed
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // ...
}
```

### Validation Pattern

```typescript
// Always validate with Zod schemas from @repo/validation
import { loginSchema, type LoginInput } from '@repo/validation';

// Server-side validation
const result = loginSchema.safeParse(data);
if (!result.success) {
  return { error: 'Validation failed', fieldErrors: result.error.flatten() };
}

// Client-side with React Hook Form
const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

### Error Handling Pattern

```typescript
// Use consistent ActionResult type
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

// Example action
export async function myAction(data: Input): Promise<ActionResult<Output>> {
  try {
    // Validate
    const validated = schema.parse(data);

    // Check rate limits
    const rateLimit = await limiter.check({ ... });
    if (!rateLimit.success) {
      return { success: false, error: 'Too many requests' };
    }

    // Process
    const result = await processData(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
```

---

## Cursor AI Integration

### Using Cursor Rules

Cursor rules are stored in `.cursor/rules` directory (to be created if not present). These rules help maintain consistency when using AI assistance.

### Recommended Cursor Commands

When working with Cursor AI, use these patterns:

```
# For new features
"Implement [feature] following the existing patterns in the codebase.
Use @repo packages for shared functionality.
Follow TDD approach - write tests first."

# For bug fixes
"Fix [issue] in [file].
Don't change unrelated code.
Add a test case for this bug."

# For refactoring
"Refactor [component/function] to follow the patterns used in [similar file].
Maintain existing functionality.
Update related tests."
```

### Cursor Rules to Follow

1. **Always use `@repo/*` packages** for shared functionality
2. **Follow existing patterns** in the codebase
3. **Write tests first** (TDD approach)
4. **Use TypeScript** with strict types
5. **Validate all inputs** with Zod schemas
6. **Handle errors gracefully** with consistent patterns
7. **Document complex logic** with comments
8. **Keep components small** and focused

### Creating Cursor Rules File

Create `.cursor/rules/development.md`:

```markdown
# Broom Kit Development Rules

## Package Usage

- Use @repo/auth for authentication
- Use @repo/database for database queries
- Use @repo/validation for Zod schemas
- Use @repo/ui for UI components

## Code Patterns

- Server Actions for mutations
- Route Handlers for webhooks/uploads
- React Hook Form + Zod for forms
- Server Components by default

## Testing

- Write tests before implementation
- Use Vitest + React Testing Library
- Test file: component.test.tsx

## Git

- Follow conventional commits
- Small, focused commits
```

---

## Development Workflow

### Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd brumkit

# 2. Install dependencies
pnpm install

# 3. Start Docker services
docker compose -f docker/docker-compose.yml up -d

# 4. Setup environment
cp env.example .env.local
# Edit .env.local with your values

# 5. Setup database
pnpm --filter @repo/database db:push
pnpm --filter @repo/database db:seed

# 6. Start development
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:web          # Start only web app

# Building
pnpm build            # Build all apps
pnpm build:web        # Build only web app

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode

# Code Quality
pnpm lint             # Lint all packages
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check

# Cleaning
pnpm clean            # Remove build artifacts
```

### Git Workflow

#### Branching Strategy

```
main (production)
  └── develop (integration)
       ├── feat/feature-name
       ├── fix/bug-description
       └── refactor/improvement
```

#### Commit Convention

All commits must follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

Types:
  feat:     New feature
  fix:      Bug fix
  docs:     Documentation
  style:    Code style (formatting)
  refactor: Code refactoring
  test:     Adding/updating tests
  chore:    Maintenance tasks
  perf:     Performance improvements
  ci:       CI/CD changes
  build:    Build system changes
  revert:   Revert previous commit
```

**Examples:**

```bash
git commit -m "feat(auth): add email verification flow"
git commit -m "fix(profile): resolve avatar upload issue"
git commit -m "docs: update README with Docker instructions"
git commit -m "test(validation): add password schema tests"
```

#### Git Hooks (Husky)

| Hook         | When          | Action                                               |
| ------------ | ------------- | ---------------------------------------------------- |
| `pre-commit` | Before commit | Runs lint-staged (ESLint + Prettier on staged files) |
| `commit-msg` | After message | Validates conventional commit format                 |
| `pre-push`   | Before push   | Runs full lint across all packages                   |

**Bypassing Hooks (Emergency Only):**

```bash
git commit --no-verify -m "emergency fix"
git push --no-verify
```

### Development Task Flow

```
1. Pick a task
   │
2. Create feature branch
   │   git checkout -b feat/feature-name
   │
3. Write tests first (RED)
   │   npm run test:watch
   │
4. Implement feature (GREEN)
   │
5. Refactor if needed
   │
6. Commit changes
   │   git commit -m "feat(scope): description"
   │
7. Push and create PR
   │   git push origin feat/feature-name
   │
8. Code review and merge
```

---

## Docker Setup

### Services Overview

```yaml
# docker/docker-compose.yml

services:
  postgres: # Database (REQUIRED)
    image: postgres:16-alpine
    ports: ['5432:5432']

  redis: # Rate limiting (RECOMMENDED)
    image: redis:7-alpine
    ports: ['6379:6379']

  mailhog: # Email testing (RECOMMENDED)
    image: mailhog/mailhog:latest
    ports: ['1025:1025', '8025:8025']

  minio: # File storage (OPTIONAL)
    image: minio/minio:latest
    ports: ['9000:9000', '9001:9001']
```

### Quick Start Commands

```bash
# Start all services
docker compose -f docker/docker-compose.yml up -d

# Start specific services
docker compose -f docker/docker-compose.yml up -d postgres redis mailhog

# Check status
docker compose -f docker/docker-compose.yml ps

# View logs
docker compose -f docker/docker-compose.yml logs -f

# Stop services
docker compose -f docker/docker-compose.yml stop

# Reset all data
docker compose -f docker/docker-compose.yml down -v
```

### Service URLs

| Service       | URL                     | Purpose          |
| ------------- | ----------------------- | ---------------- |
| PostgreSQL    | `localhost:5432`        | Database         |
| Redis         | `localhost:6379`        | Rate limiting    |
| Mailhog UI    | `http://localhost:8025` | View test emails |
| MinIO Console | `http://localhost:9001` | File storage UI  |
| Next.js App   | `http://localhost:3000` | Application      |

### Environment Detection

The application automatically detects the environment:

- **Development**: Uses local Docker services
- **Production**: Uses cloud services (Upstash, Resend, etc.)

No code changes needed - just set appropriate environment variables.

---

## Testing Strategy

### Testing Stack

| Tool                      | Purpose           |
| ------------------------- | ----------------- |
| **Vitest**                | Test runner       |
| **React Testing Library** | Component testing |
| **MSW**                   | API mocking       |
| **happy-dom**             | DOM environment   |

### Test File Conventions

```
component.tsx       # Source file
component.test.tsx  # Test file (same directory)
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Test specific package
pnpm --filter @repo/auth test
pnpm --filter web test
```

### Test Patterns

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

```typescript
// Server Action test
import { describe, it, expect, vi } from 'vitest';
import { myAction } from './my-action';

vi.mock('@repo/database', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('myAction', () => {
  it('should succeed with valid input', async () => {
    const result = await myAction({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });
});
```

---

## Deployment

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Vercel                             │   │
│  │  • Next.js App (Serverless Functions)                │   │
│  │  • Edge Network (CDN)                                │   │
│  │  • Automatic SSL                                     │   │
│  │  • Cron Jobs                                         │   │
│  └────────────┬────────────┬────────────┬───────────────┘   │
│               │            │            │                    │
│       ┌───────▼──────┐ ┌───▼────┐ ┌────▼─────┐             │
│       │     Neon     │ │Upstash │ │  Resend  │             │
│       │ (PostgreSQL) │ │(Redis) │ │ (Email)  │             │
│       └──────────────┘ └────────┘ └──────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Required Environment Variables

```env
# Database (Neon)
DATABASE_URL="postgresql://..."

# Auth.js
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-32-char-secret"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Email (Resend)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@yourdomain.com"

# Cron Security
CRON_SECRET="your-cron-secret"
```

### Deployment Steps

1. **Connect GitHub repo to Vercel**
2. **Set root directory to `apps/web`**
3. **Configure environment variables**
4. **Deploy**

See `docs/deployment/README.md` for comprehensive deployment guide.

---

## In-Progress Features

### Currently Being Developed

This is the stable open-source release. Future enhancements will be community-driven.

| Feature                    | Status  | Notes               |
| -------------------------- | ------- | ------------------- |
| Community contributions    | 🟢 Open | See CONTRIBUTING.md |
| Documentation improvements | 🟢 Open | PRs welcome         |

### Phase Completion Status

| Phase    | Description                    | Status      |
| -------- | ------------------------------ | ----------- |
| Phase 1  | Foundation (monorepo, configs) | ✅ Complete |
| Phase 2  | Database & Auth                | ✅ Complete |
| Phase 3  | Permissions & Core Packages    | ✅ Complete |
| Phase 4  | UX Foundation                  | ✅ Complete |
| Phase 5  | Testing Infrastructure         | ✅ Complete |
| Phase 6  | Password Reset & TDD           | ✅ Complete |
| Phase 7  | Rate Limiting & Error Pages    | ✅ Complete |
| Phase 8  | Profile Management             | ✅ Complete |
| Phase 9  | Notifications System           | ✅ Complete |
| Phase 10 | Documentation & Release        | ✅ Complete |

---

## Future Roadmap

This open-source edition is feature-complete for its intended scope. Community contributions are welcome for:

### Potential Community Contributions

| Feature                  | Description                      | Priority         |
| ------------------------ | -------------------------------- | ---------------- |
| **OAuth Providers**      | Add Google/GitHub authentication | Community-driven |
| **Article System**       | Basic CRUD with markdown editor  | Community-driven |
| **Enhanced Testing**     | E2E tests with Playwright        | Medium           |
| **Internationalization** | Additional language translations | Low              |

---

## Known Gaps & Missing Functionality

### Not Included in Open-Source Edition

| Feature              | Status       | Notes                              |
| -------------------- | ------------ | ---------------------------------- |
| OAuth providers      | Not included | Email/password authentication only |
| Article management   | Not included | Focus on auth & user management    |
| Advanced admin panel | Not included | Basic user management via code     |
| Real-time features   | Not included | Polling-based notifications        |
| Image uploads        | Not included | Placeholder images used            |
| Search functionality | Not included | Database queries only              |

### Technical Debt

| Issue             | Description                     | Priority |
| ----------------- | ------------------------------- | -------- |
| E2E tests         | Playwright tests could be added | Low      |
| API documentation | OpenAPI spec would be helpful   | Low      |

### Known Limitations

1. **Credentials-Only Auth**: OAuth providers not included in open-source edition
2. **Local Redis Recommended**: Rate limiting works best with Redis
3. **Basic Notification System**: No real-time updates, polling-based
4. **Email Templates**: Limited to auth-related emails currently

---

## Test Credentials

For local development after seeding:

| Role          | Email                    | Password         |
| ------------- | ------------------------ | ---------------- |
| Super Admin   | `superadmin@brumkit.com` | `SuperAdmin123!` |
| Admin         | `admin@brumkit.com`      | `Admin123!`      |
| Moderator     | `moderator@brumkit.com`  | `Moderator123!`  |
| Regular Users | `user1-7@brumkit.com`    | `User123!`       |

---

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                                    # Start dev server
docker compose -f docker/docker-compose.yml up -d  # Start services

# Database
pnpm --filter @repo/database db:studio     # Open Prisma Studio
pnpm --filter @repo/database db:seed       # Seed test data

# Testing
pnpm test:watch                            # Test in watch mode

# Code Quality
pnpm lint && pnpm format                   # Fix all issues
```

### Important Files

| File                                     | Purpose                 |
| ---------------------------------------- | ----------------------- |
| `turbo.json`                             | Turborepo configuration |
| `pnpm-workspace.yaml`                    | Workspace packages      |
| `docker/docker-compose.yml`              | Local services          |
| `packages/database/prisma/schema.prisma` | Database schema         |
| `apps/web/middleware.ts`                 | Route protection        |
| `apps/web/app/actions/auth.ts`           | Auth server actions     |

### Need Help?

- **Documentation**: Check `docs/` folder
- **Setup Guides**: See `docs/setup/`
- **Development Phases**: See `docs/development/`
- **Deployment**: See `docs/deployment/`
- **Contributing**: See `CONTRIBUTING.md`
- **Issues**: Open a GitHub issue

---

_This document is maintained by the BrumKit community. Contributions and updates are welcome!_
