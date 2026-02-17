# Repo Architecture

## Layout

```
react-masters/
  apps/
    admin/      # Next.js Admin Panel
    web/        # Next.js Community App
    workers/    # Background jobs runner
  packages/
    auth/ config/ database/ email/ i18n/ permissions/
    queue/ realtime/ search/ storage/ types/ ui/ utils/ validation/
  docker/
  docs/
```

## Conventions

- Internal packages use `@repo/<name>`
- Export from `src/index.ts`
- Each package has tests where applicable

## Fullstack approach

- Prefer Server Actions for mutations where it improves DX
- Route Handlers for webhooks, uploads (presigned URLs), search endpoints, socket auth, etc.

## Shared vs app-specific

- Shared: auth, permissions, DB client, validation schemas, UI primitives, utilities
- App-specific: routing, layouts, features per app
