# Task 2.1: Initialize Prisma & Implement Schema

**Status**: ✅ Completed  
**Date**: 2026-01-12  
**Phase**: Database Setup & Models

---

## 📋 Task Description

Initialize Prisma ORM in the monorepo and implement the complete database schema with 12 models covering authentication, content management, social features, and system notifications.

---

## ✅ What Was Implemented

### 1. Database Package Structure

Created `packages/database/` with:

- `prisma/schema.prisma` - Complete Prisma schema
- `src/client.ts` - Singleton Prisma Client with HMR support
- `src/index.ts` - Package exports
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Database connection string
- `.gitignore` - Git ignore rules
- `README.md` - Comprehensive documentation

### 2. Complete Prisma Schema

Implemented **12 models**:

#### Auth Models (Auth.js Compatible)

```prisma
✅ User - Core user entity (auth + profile + role)
✅ Account - OAuth providers (Google, GitHub, email)
✅ Session - Session management
✅ VerificationToken - Email verification & magic links
```

#### Content Models

```prisma
✅ Article - Blog posts with TipTap JSON content
✅ Tag - Article categorization
✅ ArticleTag - Many-to-many join table
```

#### Social Models

```prisma
✅ Follow - User follow relationships
✅ Bookmark - Saved articles for later reading
✅ Reaction - 5 types (LIKE, LOVE, CELEBRATE, INSIGHTFUL, CURIOUS)
✅ Comment - Nested comments with replies (self-referential)
```

#### System Models

```prisma
✅ Notification - 7 types of user notifications
```

### 3. Enums Defined

```prisma
enum UserRole {
  SUPER_ADMIN  // Full system access
  ADMIN        // Admin panel access
  MODERATOR    // Content moderation
  USER         // Regular user
}

enum ReactionType {
  LIKE, LOVE, CELEBRATE, INSIGHTFUL, CURIOUS
}

enum NotificationType {
  NEW_FOLLOWER, NEW_COMMENT, NEW_REPLY,
  NEW_REACTION, ARTICLE_PUBLISHED, MENTION, SYSTEM
}
```

### 4. Key Schema Features

**IDs**: All use `@default(cuid())` for:

- Shorter, more readable IDs
- Sortable (contains timestamp)
- URL-friendly
- Better for distributed systems

**Indexes**: 30+ indexes on:

- All foreign keys
- Frequently queried fields (email, username, slug, published, etc.)
- Soft delete fields (deletedAt)

**Soft Deletes**: Articles and Comments

- `deletedAt DateTime?` field
- Allows content recovery
- Maintains referential integrity

**Relations**: All bidirectional with explicit naming

- User ↔ Article (authorId)
- Article ↔ Tag (via ArticleTag)
- User ↔ User (Follow - self-referential)
- Comment ↔ Comment (replies - self-referential)

### 5. Prisma Client Singleton

```typescript
// src/client.ts
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

// HMR support for development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

**Features**:

- Singleton pattern (one instance)
- Query logging in development
- HMR support (avoids connection exhaustion)
- Health check function
- Graceful disconnect

---

## 🧪 Verification

### Schema Validation

```bash
cd packages/database
pnpm prisma validate
```

**Output**:

```
✅ The schema at prisma\schema.prisma is valid 🚀
```

### Prisma Client Generation

```bash
pnpm prisma generate
```

**Output**:

```
✅ Generated Prisma Client (v6.19.1) in 173ms
```

### Type Check

```bash
pnpm type-check
```

**Output**:

```
✅ No errors found
```

---

## 📁 Files Created

```
packages/database/
├── package.json (scripts + dependencies)
├── tsconfig.json
├── .env (DATABASE_URL)
├── .env.example
├── .gitignore
├── README.md (comprehensive docs)
├── prisma/
│   └── schema.prisma (12 models, 3 enums)
└── src/
    ├── client.ts (singleton + utilities)
    └── index.ts (exports)
```

---

## 📊 Schema Statistics

| Metric                 | Count |
| :--------------------- | :---- |
| **Models**             | 12    |
| **Enums**              | 3     |
| **Relations**          | 20+   |
| **Indexes**            | 30+   |
| **Unique Constraints** | 15+   |

**Lines of Code**:

- `schema.prisma`: 320 lines
- `client.ts`: 40 lines
- Total: ~400 lines

---

## 🎯 Design Decisions Implemented

### 1. Username as Optional Public Handle

- Field: `username String? @unique`
- Used for: Public profiles (`@username`)
- Login: Email only (not username)
- Can be set after registration

### 2. Article Slugs

- Unique constraint for URL routing
- Auto-generated from title (to be implemented in API)
- Manually editable

### 3. Comment Nesting

- Self-referential relation (`parentId`)
- Support for unlimited depth (can limit to 3 in API)
- Efficient querying with indexes

### 4. Soft Deletes

- Articles: Allows recovery, maintains content
- Comments: Maintains thread integrity
- Field: `deletedAt DateTime?`

### 5. Notification Retention

- No automatic deletion (to be implemented in jobs)
- Indexed on `readAt` and `createdAt`
- Cleanup job: 30 days for read, keep unread

---

## 🔗 Integration Points

This schema is ready for:

- ✅ **Auth.js** - Fully compatible adapter
- ✅ **Task 2.2** - Database migrations
- ✅ **Task 2.3** - Seed data
- ✅ **Phase 3** - API routes and validation
- ✅ **Phase 6** - Admin panel
- ✅ **Phase 7** - User-facing app

---

## 📚 Available Scripts

```bash
# Generate Prisma Client
pnpm db:generate

# Validate schema
pnpm prisma validate

# Push to database (dev only)
pnpm db:push

# Create migration
pnpm db:migrate

# Apply migrations (production)
pnpm db:migrate:deploy

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed

# Reset database
pnpm db:reset
```

---

## 🎓 Key Learnings

### Auth.js Requirements

- Specific field names required (emailVerified, sessionToken, etc.)
- Account model must support OAuth flow
- VerificationToken for magic links

### Performance Optimizations

- Index all foreign keys
- Index frequently queried fields
- Composite unique indexes for join tables

### Scalability Considerations

- cuid() over auto-increment for distributed systems
- Soft deletes for user-facing content
- Explicit join tables for flexibility

---

## 📝 Sample Queries (Examples)

### Get User with Articles

```typescript
import { prisma } from '@repo/database';

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    articles: {
      where: { deletedAt: null, published: true },
      orderBy: { publishedAt: 'desc' },
    },
  },
});
```

### Get Article Feed

```typescript
const feed = await prisma.article.findMany({
  where: {
    published: true,
    deletedAt: null,
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

---

## ✅ Task Complete!

**Deliverables**:

- ✅ Complete Prisma schema (12 models)
- ✅ Prisma Client singleton with utilities
- ✅ Database package configured
- ✅ Schema validated successfully
- ✅ Client generated successfully
- ✅ Comprehensive documentation
- ✅ Ready for migrations (Task 2.2)

---

## 🚀 Next Steps

**Task 2.2: Create Database Migrations**

- Generate initial migration
- Apply to PostgreSQL (Docker)
- Verify all tables created
- Test in Prisma Studio

**Estimated Time**: 15-20 minutes

The schema foundation is complete and solid! 🎨
