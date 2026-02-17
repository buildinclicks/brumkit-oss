# Scope and Goals

## Primary goal

Build a reusable Next.js starter kit for a community-style app (dev.to-like) with a strong architecture and DX.

## In scope (MVP)

- Admin app: user management, articles management, analytics placeholder
- Web app: authentication + articles management
- Auth: Google, GitHub, email/password, magic-link
- Roles: Super Admin, Admin, Moderator, User
- Permissions: granular (action-based)
- Content: articles with TipTap editor
- Social: follow/unfollow
- Infra: PostgreSQL + Prisma, Redis, Meilisearch, Docker for local, AWS for deploy

## Out of scope (initial)

- Real-time comments
- Real-time view counts
- Collaborative editing
- Article series/collections
- Full analytics (placeholder only)

## Non-functional goals

- TDD-first; every task is testable/verifiable
- Monorepo modularity with `@repo/*` packages
- Production-ready posture (secure auth, migrations, CI-friendly)
- Learning-friendly Docker setup
