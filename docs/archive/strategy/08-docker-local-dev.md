# Docker (Local Development)

## Goal

Simple, learning-friendly local stack.

## Services (dev)

- PostgreSQL
- Redis
- Meilisearch
- MinIO (S3-compatible)
- Mailhog (optional, for local email capture)

## Expectations

- `docker compose up -d` brings up infra deps
- Next.js apps can run on host during early dev for speed
- Later: Dockerfiles for admin/web/workers for full containerized dev

## Verification

- Health checks in compose
- Clear start/stop/reset commands in docs
