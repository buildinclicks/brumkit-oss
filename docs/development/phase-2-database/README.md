# Phase 2: Database Setup & Models - Detailed Plan

**Goal**: Set up Prisma ORM, design the database schema, create migrations, generate types, and seed the database with initial data.

---

## 📋 Tasks Overview

### Task 2.1: Initialize Prisma & Design Schema

### Task 2.2: Create Database Migrations

### Task 2.3: Set Up Seed Data

### Task 2.4: Create Database Package with Client

### Task 2.5: Type Integration with @repo/types

---

## 🎯 Task 2.1: Initialize Prisma & Design Schema

### Goal

Set up Prisma in the monorepo and design the complete database schema based on the domain model.

### What We'll Build

1. Create `packages/database` package
2. Initialize Prisma with PostgreSQL
3. Design complete Prisma schema with:
   - User model (auth, profile, roles)
   - Account model (OAuth providers)
   - Session model
   - Article model (content, metadata, SEO)
   - Tag model
   - ArticleTag relation (many-to-many)
   - Follow model (user relationships)
   - Bookmark model
   - Reaction model (likes)
   - Comment model (with nested replies)
   - Notification model

### Rules to Follow

- ✅ **TDD**: Write schema validation tests first
- ✅ **Naming**: Use PascalCase for models, camelCase for fields
- ✅ **Relations**: Define all relations explicitly with `@relation`
- ✅ **Indexes**: Add indexes for frequently queried fields
- ✅ **Defaults**: Set sensible defaults (timestamps, UUIDs)
- ✅ **Constraints**: Use `@unique`, `@db.Text`, `@db.VarChar` appropriately
- ✅ **Enums**: Define enums for roles, notification types, etc.

### Files to Create

```
packages/database/
├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma
├── src/
│   └── index.ts (exports Prisma Client)
└── README.md
```

### Verification

- Schema validates without errors
- All relations are bidirectional
- Indexes are properly defined

---

## 🎯 Task 2.2: Create Database Migrations

### Goal

Generate and apply the initial database migration to create all tables in PostgreSQL.

### What We'll Build

1. Generate initial migration
2. Apply migration to local PostgreSQL (Docker)
3. Verify all tables are created
4. Generate Prisma Client

### Rules to Follow

- ✅ **Migration Naming**: Use descriptive names (`init`, `add-notifications`, etc.)
- ✅ **Review SQL**: Always review generated SQL before applying
- ✅ **Backup Strategy**: Document rollback procedures
- ✅ **Version Control**: Commit migrations to git
- ✅ **Environment**: Test in Docker first

### Commands to Run

```bash
# Generate migration
pnpm prisma migrate dev --name init

# Generate Prisma Client
pnpm prisma generate

# View database
pnpm prisma studio
```

### Verification

- Migration applied successfully
- All tables exist in PostgreSQL
- Prisma Client generated
- Can query database via Prisma Studio

---

## 🎯 Task 2.3: Set Up Seed Data

### Goal

Create seed script to populate database with initial test data for development.

### What We'll Build

1. Seed script in `prisma/seed.ts`
2. Sample data:
   - 3-5 users (different roles: super_admin, admin, user)
   - 10-15 articles (various states: draft, published)
   - 5-8 tags
   - User follows
   - Bookmarks and reactions
   - Sample comments
   - Sample notifications

### Rules to Follow

- ✅ **Idempotent**: Can run multiple times safely
- ✅ **Clear Data**: Option to clear before seeding
- ✅ **Realistic**: Use realistic data (faker.js)
- ✅ **Test Users**: Include test accounts with known passwords
- ✅ **Password Hashing**: Use bcrypt for password hashing
- ✅ **Relationships**: Create meaningful relationships

### Files to Create

```
packages/database/
└── prisma/
    └── seed.ts
```

### Test Data

```typescript
// Sample users
- super@admin.com (super_admin) - full access
- admin@example.com (admin) - admin access
- john@example.com (user) - regular user
- jane@example.com (user) - regular user
- moderator@example.com (moderator) - moderator access

// Sample articles
- Published articles (10)
- Draft articles (5)
- Articles with different tags
- Articles by different authors

// Relationships
- Users follow each other
- Users bookmark articles
- Users react to articles
- Users comment on articles
```

### Verification

- Seed runs without errors
- Data appears in database
- Relationships are correct
- Can login with test users

---

## 🎯 Task 2.4: Create Database Package with Client

### Goal

Export configured Prisma Client as a shared package for use across the monorepo.

### What We'll Build

1. Singleton Prisma Client instance
2. Connection management
3. Error handling
4. Query logging (dev mode)
5. TypeScript types export

### Rules to Follow

- ✅ **Singleton Pattern**: One client instance across app
- ✅ **Connection Pooling**: Configure pool size
- ✅ **Error Handling**: Graceful connection errors
- ✅ **Logging**: Log queries in development
- ✅ **Type Safety**: Export Prisma types
- ✅ **Hot Reload**: Handle HMR in development

### Files to Create

```
packages/database/
├── src/
│   ├── index.ts (exports client)
│   ├── client.ts (singleton client)
│   └── types.ts (re-export Prisma types)
└── __tests__/
    └── client.test.ts
```

### Code Structure

```typescript
// src/client.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

### Verification

- Client can be imported
- Queries work
- Connection pooling active
- Types are available

---

## 🎯 Task 2.5: Type Integration with @repo/types

### Goal

Integrate Prisma-generated types with our existing `@repo/types` package.

### What We'll Build

1. Re-export Prisma types from `@repo/types`
2. Type helpers for common operations
3. Branded types for IDs
4. Type utilities for Prisma results

### Rules to Follow

- ✅ **Single Source**: Prisma as source of truth
- ✅ **No Duplication**: Don't redefine Prisma types
- ✅ **Helpers Only**: Create helper types, not replacements
- ✅ **Brand IDs**: Use branded types for type safety
- ✅ **Documentation**: Document type usage

### Files to Update

```
packages/types/
└── src/
    ├── database.ts (new - Prisma type helpers)
    └── index.ts (export database types)
```

### Type Helpers

```typescript
// Type helpers
export type UserWithProfile = Prisma.UserGetPayload<{
  include: { accounts: true; sessions: true };
}>;

export type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: { author: true; tags: true };
}>;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    author: true;
    tags: { include: { tag: true } };
    comments: true;
    reactions: true;
    bookmarks: true;
  };
}>;
```

### Verification

- Types import correctly
- Type helpers work
- No type errors
- IntelliSense works

---

## 🔄 Workflow for Each Task

### Before Starting

1. ✅ Read this plan and the domain model (`docs/strategy/05-domain-model.md`)
2. ✅ Review Auth.js schema requirements (`docs/strategy/04-auth-and-permissions.md`)
3. ✅ Get user approval

### During Implementation

1. ✅ **TDD**: Write tests first (where applicable)
2. ✅ **Small commits**: Commit frequently
3. ✅ **Type safety**: Ensure TypeScript strict mode passes
4. ✅ **Documentation**: Update README as you go

### After Completion

1. ✅ **Run all tests**: Ensure everything passes
2. ✅ **Type check**: `pnpm type-check` across monorepo
3. ✅ **Verify manually**: Test in Prisma Studio
4. ✅ **Document**: Create `docs/development/phase-2-database/{task-name}.md`
5. ✅ **Commit**: Create descriptive commit message
6. ✅ **Ask user**: Get approval before next task

---

## 📦 Dependencies to Add

### packages/database/package.json

```json
{
  "dependencies": {
    "@prisma/client": "^6.1.0"
  },
  "devDependencies": {
    "prisma": "^6.1.0",
    "@faker-js/faker": "^9.3.0",
    "bcrypt": "^5.1.1",
    "@types/bcrypt": "^5.0.2"
  }
}
```

---

## 🎯 Success Criteria

Phase 2 is complete when:

- ✅ Prisma schema designed with all models
- ✅ Initial migration applied to PostgreSQL
- ✅ Seed data script working
- ✅ Database package exports Prisma Client
- ✅ Types integrated with `@repo/types`
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Can query database via Prisma Studio
- ✅ Ready to build API routes (Phase 3)

---

## 📚 Key References

- **Domain Model**: `docs/strategy/05-domain-model.md`
- **Auth Strategy**: `docs/strategy/04-auth-and-permissions.md`
- **Prisma Docs**: https://www.prisma.io/docs
- **Auth.js Prisma Adapter**: https://authjs.dev/reference/adapter/prisma

---

## ⚠️ Common Pitfalls to Avoid

1. ❌ **Don't**: Define relations only on one side
   ✅ **Do**: Define both sides of every relation

2. ❌ **Don't**: Skip indexes on foreign keys
   ✅ **Do**: Add `@@index` for all foreign keys

3. ❌ **Don't**: Use `Int` for IDs
   ✅ **Do**: Use `String @default(cuid())` for flexibility

4. ❌ **Don't**: Store sensitive data in plain text
   ✅ **Do**: Hash passwords with bcrypt

5. ❌ **Don't**: Forget to handle connection errors
   ✅ **Do**: Implement graceful error handling

6. ❌ **Don't**: Create migrations without reviewing SQL
   ✅ **Do**: Always review generated SQL

---

## 🚀 Ready to Start!

This plan follows all our development rules:

- ✅ TDD approach
- ✅ Small, testable tasks
- ✅ Documentation on completion
- ✅ Commit after each task
- ✅ User approval required

**Estimated Time**: 3-4 hours total (all 5 tasks)

Let me know when you're ready to start Task 2.1! 🎨
