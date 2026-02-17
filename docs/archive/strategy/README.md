# React Masters — Strategy

This folder captures the agreed architecture and delivery plan for the React Masters Next.js starter kit.

## What this is

- Architecture and product decisions (single source of truth)
- Build plan with small, testable tasks (TDD-first)
- Onboarding reference for new developers

## Quick links

- [01-scope-and-goals](./01-scope-and-goals.md)
- [02-tech-stack](./02-tech-stack.md)
- [03-repo-architecture](./03-repo-architecture.md)
- [04-auth-and-permissions](./04-auth-and-permissions.md)
- [05-domain-model](./05-domain-model.md)
- [06-realtime-jobs-search](./06-realtime-jobs-search.md)
- [07-storage-email-images](./07-storage-email-images.md)
- [08-docker-local-dev](./08-docker-local-dev.md)
- [09-aws-deployment](./09-aws-deployment.md)
- [10-phases-and-tasks](./10-phases-and-tasks.md)
- [11-dev-workflow-tdd](./11-dev-workflow-tdd.md)

## Key decisions (snapshot: 2026-01-11)

- Monorepo: Turborepo + pnpm
- Apps: `admin`, `web`, `workers`
- Fullstack: Next.js (App Router) with Server Actions/Route Handlers
- DB: PostgreSQL + Prisma
- Auth: Auth.js (NextAuth v5) — Google, GitHub, email/password, magic-link
- Authorization: CASL with granular permissions
- Editor: TipTap (free)
- Email: Resend + React Email
- Storage: S3 + Sharp (resize + thumbnails), MinIO for local
- Realtime: Socket.io (notifications only)
- Jobs: BullMQ + Redis
- Search: Meilisearch
- i18n: English initial; ready for more
- Deployment: AWS
- Process: TDD, tiny tasks, per-task docs, user approval before each task
