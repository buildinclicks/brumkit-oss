# @repo/database

Prisma database client and schema for React Masters monorepo.

## Features

- ✅ **12 Models** - User, Account, Session, Article, Tag, Comment, etc.
- ✅ **Auth.js Compatible** - Full Auth.js Prisma adapter support
- ✅ **Type-Safe** - Generated TypeScript types from schema
- ✅ **Singleton Client** - One database connection across app
- ✅ **HMR Support** - Handles hot reload in development
- ✅ **PostgreSQL** - Optimized for PostgreSQL with indexes

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Database

Create `.env` file (or use existing):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/react_masters?schema=public"
```

### 3. Run Migrations

```bash
# Development - Create and apply migration
pnpm db:migrate

# Production - Apply existing migrations
pnpm db:migrate:deploy
```

### 4. Generate Prisma Client

```bash
pnpm db:generate
```

### 5. Seed Database (Optional)

```bash
pnpm db:seed
```

## Usage

### Import Prisma Client

```typescript
import { prisma } from '@repo/database';

// Query users
const users = await prisma.user.findMany();

// Create article
const article = await prisma.article.create({
  data: {
    title: 'Hello World',
    slug: 'hello-world',
    content: '{"type":"doc","content":[]}',
    authorId: 'user_123',
  },
});
```

### Import Types

```typescript
import type { User, Article, UserRole } from '@repo/database';

const user: User = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

### Health Check

```typescript
import { healthCheck } from '@repo/database';

const isHealthy = await healthCheck();
console.log('Database is healthy:', isHealthy);
```

## Database Schema

### Core Models

#### Auth Models (Auth.js)

- **User** - Core user entity (auth + profile)
- **Account** - OAuth provider accounts
- **Session** - User sessions
- **VerificationToken** - Email verification & magic links

#### Content Models

- **Article** - Blog posts with rich content (TipTap JSON)
- **Tag** - Article categorization
- **ArticleTag** - Many-to-many join table

#### Social Models

- **Follow** - User follow relationships
- **Bookmark** - Saved articles
- **Reaction** - Likes, love, celebrate, etc. (5 types)
- **Comment** - Nested comments with replies

#### System Models

- **Notification** - User notifications (7 types)

### Enums

```prisma
enum UserRole {
  SUPER_ADMIN, ADMIN, MODERATOR, USER
}

enum ReactionType {
  LIKE, LOVE, CELEBRATE, INSIGHTFUL, CURIOUS
}

enum NotificationType {
  NEW_FOLLOWER, NEW_COMMENT, NEW_REPLY,
  NEW_REACTION, ARTICLE_PUBLISHED, MENTION, SYSTEM
}
```

## Available Scripts

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (dev only, no migration)
pnpm db:push

# Create and apply migration
pnpm db:migrate

# Apply existing migrations (production)
pnpm db:migrate:deploy

# Open Prisma Studio (database GUI)
pnpm db:studio

# Seed database with test data
pnpm db:seed

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Type check
pnpm type-check
```

## Common Queries

### Get User with Relations

```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    articles: true,
    followers: true,
    following: true,
  },
});
```

### Get Article with Author and Tags

```typescript
const article = await prisma.article.findUnique({
  where: { slug: 'my-article' },
  include: {
    author: true,
    tags: {
      include: { tag: true },
    },
    comments: {
      where: { deletedAt: null },
      include: { user: true },
    },
  },
});
```

### Get User Feed (Followed Authors)

```typescript
const feed = await prisma.article.findMany({
  where: {
    published: true,
    author: {
      followers: {
        some: { followerId: currentUserId },
      },
    },
  },
  include: {
    author: true,
    tags: { include: { tag: true } },
  },
  orderBy: { publishedAt: 'desc' },
  take: 20,
});
```

### Count Reactions by Type

```typescript
const reactionCounts = await prisma.reaction.groupBy({
  by: ['type'],
  where: { articleId: 'article_123' },
  _count: { type: true },
});
```

### Get Unread Notifications

```typescript
const unread = await prisma.notification.findMany({
  where: {
    recipientId: userId,
    readAt: null,
  },
  orderBy: { createdAt: 'desc' },
});
```

## Environment Variables

| Variable       | Description                  | Example                                        |
| :------------- | :--------------------------- | :--------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |

## Development

### Local Database (Docker)

Make sure PostgreSQL is running in Docker:

```bash
# Start PostgreSQL
docker compose -f docker/docker-compose.yml up postgres -d

# Check status
docker compose -f docker/docker-compose.yml ps
```

### Prisma Studio

Visual database browser:

```bash
pnpm db:studio
```

Open http://localhost:5555

### Schema Changes

1. Modify `prisma/schema.prisma`
2. Create migration: `pnpm db:migrate`
3. Generate client: `pnpm db:generate`
4. Commit migration files to git

## Production

### Apply Migrations

```bash
pnpm db:migrate:deploy
```

### Connection Pooling

For serverless environments, consider using:

- Prisma Data Proxy
- PgBouncer
- Supabase pooler

## Troubleshooting

### "Can't reach database server"

Check that PostgreSQL is running:

```bash
docker compose -f docker/docker-compose.yml ps
```

### "Migration failed"

Reset database (dev only):

```bash
pnpm db:reset
```

### "Type errors after schema change"

Regenerate client:

```bash
pnpm db:generate
```

## Best Practices

1. **Always use migrations** - Don't use `db:push` in production
2. **Review SQL** - Check generated SQL before applying
3. **Backup data** - Before running migrations in production
4. **Use transactions** - For multi-step operations
5. **Soft delete** - For user-facing content (articles, comments)
6. **Index wisely** - Add indexes for frequently queried fields

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

Private package for React Masters monorepo.
