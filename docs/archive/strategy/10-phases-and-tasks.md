# Phases and Tasks (Plan of Record)

## Principles

- Small, testable, verifiable tasks
- TDD: RED → GREEN → REFACTOR
- After each task: write summary in `docs/development/{phase-name}/{task-name}.md` and ask user to commit/push

## Phases (high-level)

- **Phase 1:** Foundation (monorepo, shared configs, hooks, test runner, docker deps)
- **Phase 2:** Database & Auth (Prisma schema, migrations, Auth.js providers, seeds)
- **Phase 3:** Permissions & Core Packages (CASL, validation, UI primitives)
- **Phase 4:** Storage & i18n (S3/MinIO, Sharp, next-intl baseline)
- **Phase 5:** Queue, Realtime, Apps scaffolding (BullMQ, Socket.io base, admin/web skeletons)
- **Phase 6:** Admin MVP (users, articles, analytics placeholder, engagement placeholder)
- **Phase 7:** Web MVP (auth flows, article feed/detail/create/edit, TipTap, follow/unfollow)
- **Phase 8:** Notifications + Images (create/deliver notifications, uploads + processing)
- **Phase 9:** Workers & Jobs (email/images jobs, retries/failures)
- **Phase 10:** E2E + Production (Playwright, CI, prod Docker, AWS docs)

## Source of truth for completed work

- `docs/development/` holds task-by-task summaries.
