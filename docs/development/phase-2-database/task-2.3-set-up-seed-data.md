# Task 2.3: Set Up Seed Data

**Phase**: 2 - Database Setup & Models  
**Date**: 2026-01-12  
**Status**: ✅ Completed

## Overview

Created comprehensive seed data for all database tables with realistic test data using `@faker-js/faker`. The seed script populates the database with users, articles, tags, social interactions, and notifications for testing and development.

## What Was Implemented

### 1. Dependencies Installed

```json
"devDependencies": {
  "@faker-js/faker": "^10.2.0",
  "bcrypt": "^6.0.0",
  "@types/bcrypt": "^6.0.0",
  "tsx": "^4.21.0"
}
```

### 2. Seed Script (`prisma/seed.ts`)

- **Total Lines**: 400+
- **Realistic Data Generation**: Using faker.js for all content
- **Password Hashing**: Using bcrypt with salt rounds of 10
- **Smart Relationships**: Properly linked related entities

### 3. Seeded Data Summary

| Entity         | Count | Description                                                   |
| -------------- | ----- | ------------------------------------------------------------- |
| Users          | 20    | Including Super Admin, Admin, Moderator, and 17 regular users |
| OAuth Accounts | 10    | Google and GitHub auth for random users                       |
| Tags           | 15    | JavaScript, TypeScript, React, Next.js, etc.                  |
| Articles       | 50    | Mix of published (80%) and draft (20%) articles               |
| Follows        | 100   | Social following relationships                                |
| Bookmarks      | 200   | Users bookmarking articles                                    |
| Reactions      | 660   | 5 types: LIKE, LOVE, CELEBRATE, INSIGHTFUL, CURIOUS           |
| Comments       | 264   | Including nested replies (30% have replies)                   |
| Notifications  | 200   | Various notification types for all users                      |

### 4. Test Credentials

```
Super Admin: superadmin@reactmasters.com / password123
Admin: admin@reactmasters.com / password123
Moderator: moderator@reactmasters.com / password123
All other users: password123
```

## Files Created/Modified

### Created

```
packages/database/prisma/seed.ts       # Main seed script (400+ lines)
```

### Modified

```
packages/database/package.json         # Added seed script and dependencies
packages/database/prisma/schema.prisma # Added password field to User model
```

## Schema Fixes Applied

### User Model

- Added `password` field (TEXT, nullable) for email/password authentication
- Applied via: `ALTER TABLE users ADD COLUMN password TEXT;`

### Seed Script Adjustments

1. **Faker Color**: Changed from `faker.internet.color()` to `faker.color.rgb({ format: 'hex' })`
2. **Comment Fields**: Changed `authorId` to `userId` to match schema
3. **Notification Fields**: Removed `senderId` and `isRead`, added proper `readAt` handling

## Seed Configuration

```typescript
const SEED_CONFIG = {
  users: 20,
  articles: 50,
  tags: 15,
  commentsPerArticle: 5,
  followsPerUser: 5,
  bookmarksPerUser: 10,
  reactionsPerArticle: 15,
  notificationsPerUser: 10,
};
```

## Verification Steps

### 1. Run Seed Script

```powershell
cd packages/database
pnpm db:seed
```

**Expected Output**:

```
🎉 Database seeded successfully!

📊 Summary:
   Users: 20
   OAuth Accounts: 10
   Tags: 15
   Articles: 50
   Follows: 100
   Bookmarks: 200
   Reactions: 660
   Comments: 264
   Notifications: 200
```

### 2. Verify in Database

```powershell
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -d react_masters -c "SELECT 'users', COUNT(*) FROM users"
```

### 3. Verify in Prisma Studio

```powershell
cd packages/database
pnpm db:studio
```

Open `http://localhost:5555` and browse all tables.

### 4. Test Login Credentials

Use the test credentials to verify authentication:

- `superadmin@reactmasters.com / password123`
- `admin@reactmasters.com / password123`
- `moderator@reactmasters.com / password123`

## Key Features

### 1. Realistic Data

- **Users**: Random names, emails, usernames, bios, avatars
- **Articles**: TipTap JSON content, slugs, cover images, SEO meta
- **Tags**: Tech stack tags with hex colors
- **Comments**: Nested replies with proper parent-child relationships
- **Social**: Realistic follow patterns, bookmarks, reactions

### 2. Data Relationships

- Articles linked to authors (users)
- Articles tagged with 1-5 tags
- Comments linked to articles and authors
- Nested comment replies
- Social interactions (follows, bookmarks, reactions)
- Notifications linked to recipients

### 3. Edge Cases Handled

- **80% Published Articles**: Realistic mix of published vs draft
- **60% Verified Emails**: Some users with unverified emails
- **30% Comments Have Replies**: Natural conversation patterns
- **60% Read Notifications**: Mix of read and unread
- **Unique Constraints**: Prevented duplicate follows, bookmarks, reactions

### 4. Password Security

- All passwords hashed with bcrypt (salt rounds: 10)
- Test password: `password123`
- Hashed format: `$2b$10$...` (60 characters)

## Critical Issue Resolved

### Problem: Prisma Authentication Failure

**Error**: `Authentication failed against database server`

**Root Cause**: Local pgAdmin PostgreSQL service was running on port 5432, conflicting with Docker PostgreSQL.

**Solution**:

1. Killed local PostgreSQL processes
2. Restarted Docker PostgreSQL with standard password authentication
3. Removed `POSTGRES_HOST_AUTH_METHOD: trust` from docker-compose.yml
4. Updated `.env` with proper credentials: `postgresql://postgres:postgres@localhost:5432/react_masters`

**Verification**: Connection test passed ✅

## Running Commands

### Seed Database

```powershell
# From package directory
cd packages/database
pnpm db:seed

# From root (using filter)
pnpm --filter @repo/database db:seed
```

### Reset and Reseed

```powershell
cd packages/database
pnpm db:reset  # Drops DB, runs migrations, runs seed
```

### Seed After Migration

The seed script is automatically run after `prisma migrate dev` due to the `prisma.seed` configuration in `package.json`.

## Next Steps

Ready for Phase 2, Task 2.4: Create Database Package (if needed) or move to Phase 3 for application development.

---

## Notes

- Seed script is idempotent (clears existing data first) ✅
- All foreign key constraints satisfied ✅
- Soft deletes not applied to seed data (deletedAt = null) ✅
- Published articles have publishedAt timestamp ✅
- Draft articles have published = false, publishedAt = null ✅
- OAuth accounts for 50% of users (10/20) ✅
- Email verified for 70% of users ✅
