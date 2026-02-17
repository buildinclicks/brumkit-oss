# BrumKit – Open Source Edition (Community)

## Overview

The **BrumKit Open Source Edition** is designed to be a **fully usable, production-safe foundation** for building modern web applications with Next.js.

This edition represents our commitment to:

- Open-source best practices
- Real-world production readiness
- Excellent developer experience (DX)

The open-source version is **not a demo** or a stripped-down sample.  
It is a solid base you can confidently ship to production.

---

## Core Philosophy

> **Build once. Build correctly. Build openly.**

The Community Edition focuses on:

- Strong architectural foundations
- Secure authentication and authorization
- Type safety across the stack
- Clean, maintainable, and extensible code

This layer forms the **credibility engine** of BrumKit.

---

## What’s Included in the Open Source Edition

### 1. Foundation

The core infrastructure and architectural setup:

- Monorepo architecture
- Turborepo + `pnpm` workspace
- Next.js 15 with App Router
- Prisma ORM with PostgreSQL
- Docker-based local development setup
- Type-safe shared packages across the monorepo

---

### 2. Authentication & Security (Full)

A complete, production-grade authentication and authorization system:

- Email & password authentication
- JWT-based session management
- Password reset flow
- Email verification flow
- Role-based access control (RBAC)
- CASL-based permission system
- Redis-based rate limiting
- Route protection using Next.js middleware

> Security is **not optional**.  
> This is the most mature and stable layer of BrumKit.

---

### 3. Basic UI & UX Foundation

A clean and extensible UI layer:

- shadcn/ui component integration
- Dark mode support
- Form system using:
  - React Hook Form
  - Zod for validation

This UI layer is intentionally minimal, giving developers full freedom to extend or customize.

---

### 4. Developer Experience (DX)

Strong DX is a first-class priority:

- Testing setup with Vitest
- Test-Driven Development (TDD) examples
- Conventional commit guidelines
- Husky Git hooks for quality enforcement
- Clean, structured documentation

This makes BrumKit suitable for:

- Learning
- Team onboarding
- Long-term maintenance

---

### 5. Limited Feature Set

To keep the open-source edition focused and lightweight, feature scope is intentionally limited:

- Basic user profile page
- Basic notification model (no real-time support)

These features serve as **reference implementations**, not full-scale products.

> **Note**: OAuth providers (Google, GitHub) are not included in this version. The open-source edition focuses on email/password authentication.

---

## What’s Not Included

The Community Edition intentionally excludes:

- Admin panel UI
- Advanced analytics
- Real-time features
- Background job processing
- Enterprise or multi-tenant features

These are available in the **Premium Edition**.

---

## Who Is This For?

The Open Source Edition is ideal for:

- Indie hackers
- Startup teams
- Agencies building internal standards
- Developers learning production architecture
- Open-source contributors

---

## Contribution

We actively welcome contributions.

If you believe something can be improved, simplified, or extended:

- Open an issue
- Start a discussion
- Submit a pull request

Together, we build better foundations.

---

## License

This project is released under an open-source license.  
See the `LICENSE` file for details.

---

## Implementation Status

✅ **Implemented**:

- Email/password authentication
- Password reset and email verification
- Profile management
- Notification system with UI
- RBAC permissions (simplified)
- Rate limiting
- Dark mode
- Testing infrastructure

❌ **Not Included**:

- OAuth providers (Google, GitHub)
- Article CRUD system
- Comment system
- Social features (Follow, Bookmark, Reaction)

---

**BrumKit**  
Built and maintained by **BuildInClicks**
