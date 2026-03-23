# =============================================================================
# Stage 1: base
# Installs pnpm, sets up the working directory, and copies workspace manifests.
# =============================================================================
FROM node:20-alpine AS base

# Install pnpm via corepack (matches packageManager field in root package.json)
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Build-time arg so turbo prune knows which app to prune for
ARG APP=web

WORKDIR /repo

# =============================================================================
# Stage 2: pruner
# Uses turbo prune to produce a sparse monorepo containing ONLY the files
# needed for apps/web and its workspace dependencies.
# =============================================================================
FROM base AS pruner

# Copy everything needed for turbo prune
COPY . .

# Prune to a minimal subset — outputs go to /repo/out
RUN npx turbo prune --scope=web --docker

# =============================================================================
# Stage 3: installer
# Installs dependencies (node_modules) on top of the pruned workspace.
# This layer is cached as long as the lockfile doesn't change.
# =============================================================================
FROM base AS installer

WORKDIR /repo

# Copy pruned lockfile + workspace manifests (changes rarely → cache-friendly)
COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install ALL deps (including devDeps needed for build)
# --no-frozen-lockfile is intentional here:
# `turbo prune` produces a sparse pnpm-lock.yaml that can drop override-only
# synthetic entries (e.g. lodash-es@4.17.23), causing --frozen-lockfile to
# fail. The build context is already fully controlled by turbo prune so this
# is safe and not a reproducibility risk.
RUN pnpm install --no-frozen-lockfile

# Now copy pruned source files on top
COPY --from=pruner /repo/out/full/ .

# Generate Prisma client before building (schema must be present)
RUN pnpm --filter @repo/database db:generate

# Build the workspace — uses build:docker which skips migrate (no DB at build time).
# Migrations run at container startup via docker/entrypoint.sh instead.
RUN pnpm --filter web build:docker

# =============================================================================
# Stage 4: runner
# Minimal, hardened production image using Next.js standalone output.
# =============================================================================
FROM node:20-alpine AS runner

# Security: run as non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copy standalone server output (includes ALL required node_modules inlined)
COPY --from=installer --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./

# Copy static assets — standalone does NOT include these
COPY --from=installer --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /repo/apps/web/public         ./apps/web/public

# Copy Prisma engine binary + migration files so the entrypoint can run migrate
COPY --from=installer --chown=nextjs:nodejs /repo/packages/database/prisma ./packages/database/prisma

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000

# Entrypoint: runs prisma migrate deploy, then starts Next.js
CMD ["/app/entrypoint.sh"]
