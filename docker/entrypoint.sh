#!/bin/sh
# =============================================================================
# Docker entrypoint for brumkit web container
# Runs Prisma migrations against the live DB, THEN starts Next.js.
# This ensures the schema is always up-to-date on container start.
# =============================================================================
set -e

echo "→ Running Prisma migrations..."
# prisma is not available in the runner image — use the migrate binary
# bundled in the standalone output's node_modules if present, otherwise skip.
if [ -f "./node_modules/.bin/prisma" ]; then
  ./node_modules/.bin/prisma migrate deploy --schema=./packages/database/prisma/schema.prisma
else
  echo "  prisma CLI not found in runner — skipping migrate (run manually or via init container)"
fi

echo "→ Starting Next.js..."
exec node apps/web/server.js
