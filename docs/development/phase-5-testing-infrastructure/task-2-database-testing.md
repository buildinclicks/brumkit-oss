# Task 5.2: Database Testing Strategy

**Status:** ✅ Completed  
**Date:** 2026-01-13

## Objective

Implement comprehensive database testing infrastructure with a hybrid approach: mock database for unit tests, real database for integration tests. Includes test utilities, fixtures, transaction rollback patterns, and database seeding.

## Changes Made

### 1. Database Test Client

**File:** `packages/database/test/utils/test-client.ts`

Created a dedicated Prisma client for testing:

- **Separate Database:** Uses `TEST_DATABASE_URL` or appends `_test` suffix to main database
- **Singleton Pattern:** Ensures single instance per test run
- **Conditional Logging:** Query logging enabled with `DEBUG_TESTS=true`
- **Clean Database Function:** Respects foreign key constraints when deleting data
- **Graceful Disconnect:** Proper cleanup after all tests

**Key Features:**

```typescript
// Test database URL resolution
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL?.replace(/\/(\w+)$/, '/$1_test') ||
  'postgresql://postgres:postgres@localhost:5432/react_masters_test';

// Clean database in correct order
await client.$transaction([
  client.notification.deleteMany(),
  client.comment.deleteMany(),
  client.reaction.deleteMany(),
  client.bookmark.deleteMany(),
  client.articleTag.deleteMany(),
  client.follow.deleteMany(),
  client.article.deleteMany(),
  client.tag.deleteMany(),
  client.session.deleteMany(),
  client.account.deleteMany(),
  client.verificationToken.deleteMany(),
  client.user.deleteMany(),
]);
```

### 2. Test Fixtures

**File:** `packages/database/test/fixtures/index.ts`

Factory functions using `@faker-js/faker` for realistic test data:

- **User Fixtures:** `createUserFixture()`, `createUserWithPasswordFixture()`
- **Article Fixtures:** `createArticleFixture()`
- **Tag Fixtures:** `createTagFixture()`
- **Comment Fixtures:** `createCommentFixture()`
- **Relationship Fixtures:** `createFollowFixture()`, `createBookmarkFixture()`, `createReactionFixture()`
- **Notification Fixtures:** `createNotificationFixture()`
- **Bulk Creation Helpers:** `createUsers()`, `createArticles()`, `createTags()`

**Example Usage:**

```typescript
// Single user with custom email
const user = createUserFixture({ email: 'test@example.com' });

// User with hashed password
const userWithPass = await createUserWithPasswordFixture('MyPassword123!', {
  role: 'ADMIN',
  emailVerified: new Date(),
});

// Article with specific title
const article = createArticleFixture(userId, {
  title: 'Test Article',
  published: true,
});
```

### 3. Test Helpers

**File:** `packages/database/test/utils/helpers.ts`

Higher-level helpers combining fixtures with database operations:

- **User Helpers:** `createTestUser()`, `createTestUsers()`, `findUserByEmail()`, `countUsers()`
- **Article Helpers:** `createTestArticle()`, `createTestArticles()`, `findArticleBySlug()`, `countArticles()`
- **Tag Helpers:** `createTestTag()`, `createTestTags()`, `countTags()`
- **Comment Helpers:** `createTestComment()`
- **Relationship Helpers:** `createTestFollow()`, `createTestBookmark()`, `createTestReaction()`
- **Scenario Helper:** `createTestScenario()` - creates complete test data (user + articles + tags + comments)

**Example Usage:**

```typescript
// Create user and insert into database
const user = await createTestUser({ email: 'test@example.com' });

// Create 5 users
const users = await createTestUsers(5);

// Create 3 articles for a user
const articles = await createTestArticles(user.id, 3);

// Complete test scenario
const { user, articles, tags, comment } = await createTestScenario();
```

### 4. Integration Tests

**File:** `packages/database/test/integration.test.ts`

Comprehensive integration tests demonstrating patterns:

- **Setup/Teardown:** Clean database before all tests, between tests, and after all tests
- **User Operations:** Create, find by email, unique constraints, counting
- **Article Operations:** Create, cascade delete, unique slug constraint
- **Relationships:** User with articles, follow relationships
- **Assertions:** Proper use of `expect()` with Prisma results

**Test Structure:**

```typescript
describe('Database Integration Tests', () => {
  const db = getTestClient();

  beforeAll(async () => {
    await cleanDatabase(); // Clean before all tests
  });

  afterAll(async () => {
    await cleanDatabase(); // Clean after all tests
    await disconnectTestClient(); // Disconnect
  });

  beforeEach(async () => {
    await cleanDatabase(); // Clean between tests for isolation
  });

  // Tests...
});
```

### 5. Vitest Configuration

**File:** `packages/database/vitest.config.ts`

Database-specific Vitest configuration:

- **Extends:** Shared `@repo/config-vitest/node` config
- **Longer Timeouts:** 30s for database operations
- **Coverage:** 80% thresholds, excludes `src/index.ts`
- **Test Pattern:** `test/**/*.test.ts`

**Configuration:**

```typescript
export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['test/**/*.test.ts'],
      testTimeout: 30000,
      hookTimeout: 30000,
      coverage: {
        include: ['src/**/*.ts'],
        exclude: ['src/index.ts'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
```

### 6. Package Configuration

**File:** `packages/database/package.json`

Added test scripts and dependencies:

```json
{
  "scripts": {
    "test": "vitest run --project database",
    "test:watch": "vitest watch --project database",
    "test:coverage": "vitest run --project database --coverage",
    "test:setup": "tsx test/setup-test-db.ts"
  },
  "devDependencies": {
    "@faker-js/faker": "^10.2.0",
    "@repo/config-vitest": "workspace:*",
    "@types/bcrypt": "^6.0.0",
    "bcrypt": "^6.0.0",
    "vitest": "^4.0.16"
  }
}
```

### 7. Test Database Setup Template

**File:** `packages/database/test/env.test.template`

Documented test database configuration:

```bash
# Test Database Configuration
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/react_masters_test

# Debug test queries (optional)
DEBUG_TESTS=false

# Setup instructions:
# 1. Create the test database:
#    createdb react_masters_test
#    OR use PostgreSQL GUI (pgAdmin, DBeaver, etc.)
#
# 2. Run migrations:
#    DATABASE_URL=$TEST_DATABASE_URL pnpm --filter @repo/database db:migrate:deploy
#
# 3. Run tests:
#    pnpm test
```

### 8. Exported Test Utilities

**File:** `packages/database/src/index.ts`

Test utilities exported for use in other packages:

```typescript
// Export test utilities for other packages (only in test environment)
if (process.env.NODE_ENV === 'test') {
  export * from '../test/utils';
  export * from '../test/fixtures';
}
```

This allows other packages to import and use database test utilities:

```typescript
import {
  createTestUser,
  createTestArticle,
  cleanDatabase,
} from '@repo/database';
```

## Testing Strategy

### Hybrid Approach

1. **Unit Tests (Mocked Database):**
   - Test business logic in isolation
   - Mock Prisma client calls
   - Fast execution
   - No database dependency

2. **Integration Tests (Real Database):**
   - Test actual database operations
   - Verify constraints and relationships
   - Ensure queries work correctly
   - Test cascade deletes and triggers

### Test Isolation

- **Clean Database:** Use `cleanDatabase()` in `beforeAll`, `afterAll`, and `beforeEach`
- **Transaction Rollback:** For more complex scenarios, use Prisma transactions
- **Separate Database:** Always use a dedicated test database, never production or development

### Best Practices

1. **Use Fixtures:** Always use fixtures for consistent, realistic test data
2. **Test Constraints:** Verify unique constraints, foreign keys, and validations
3. **Test Relationships:** Ensure cascade deletes and related records work correctly
4. **Count Assertions:** Use `countUsers()`, `countArticles()` for clean assertions
5. **Realistic Data:** Use `@faker-js/faker` for realistic emails, names, content

## Setup Instructions

### 1. Create Test Database

#### Option A: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create test database
CREATE DATABASE react_masters_test;

# Verify
\l

# Exit
\q
```

#### Option B: Using GUI (pgAdmin, DBeaver, etc.)

1. Connect to your PostgreSQL server
2. Right-click on "Databases"
3. Select "Create Database"
4. Name: `react_masters_test`
5. Save

#### Option C: Using Docker

```bash
# If using Docker PostgreSQL
docker exec -it <container_name> psql -U postgres -c "CREATE DATABASE react_masters_test;"
```

### 2. Set Environment Variable

Create `.env.test` file in `packages/database/`:

```bash
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/react_masters_test
```

**OR** set environment variable directly:

**Linux/Mac:**

```bash
export TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/react_masters_test
```

**Windows PowerShell:**

```powershell
$env:TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/react_masters_test"
```

### 3. Run Migrations on Test Database

```bash
# From project root
cd packages/database

# Run migrations
DATABASE_URL=$TEST_DATABASE_URL pnpm db:migrate:deploy

# OR on Windows PowerShell:
$env:DATABASE_URL=$env:TEST_DATABASE_URL; pnpm db:migrate:deploy
```

### 4. Run Tests

```bash
# From project root
pnpm --filter @repo/database test

# OR from packages/database
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

## Test Results

Once test database is created and migrated, all tests should pass:

```
✓ Database Integration Tests (9 tests passed)
  ✓ User Operations (4 tests)
    ✓ should create a user
    ✓ should find user by email
    ✓ should enforce unique email constraint
    ✓ should count users correctly
  ✓ Article Operations (3 tests)
    ✓ should create an article
    ✓ should cascade delete articles when user is deleted
    ✓ should enforce unique slug constraint
  ✓ Relationships (2 tests)
    ✓ should create user with articles
    ✓ should handle follow relationships
```

## Files Created

```
packages/database/test/
├── env.test.template           # Test database configuration template
├── integration.test.ts         # Example integration tests
├── fixtures/
│   └── index.ts               # Test data factories
└── utils/
    ├── index.ts               # Exported utilities
    ├── test-client.ts         # Test Prisma client
    └── helpers.ts             # High-level test helpers
```

## Files Modified

```
packages/database/package.json         # Added test scripts and dependencies
packages/database/vitest.config.ts     # Database-specific Vitest config
packages/database/src/index.ts         # Export test utilities
```

## Usage Examples

### Basic Integration Test

```typescript
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
} from '@repo/database';

describe('User Service', () => {
  const db = getTestClient();

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectTestClient();
  });

  it('should create a user', async () => {
    const user = await createTestUser({ email: 'test@example.com' });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### Testing Relationships

```typescript
it('should create user with articles', async () => {
  const user = await createTestUser();
  const article1 = await createTestArticle(user.id, { published: true });
  const article2 = await createTestArticle(user.id, { published: false });

  const userWithArticles = await db.user.findUnique({
    where: { id: user.id },
    include: { articles: true },
  });

  expect(userWithArticles?.articles).toHaveLength(2);
});
```

### Testing Cascade Deletes

```typescript
it('should cascade delete articles when user is deleted', async () => {
  const user = await createTestUser();
  await createTestArticles(user.id, 3);

  expect(await countArticles()).toBe(3);

  await db.user.delete({ where: { id: user.id } });

  expect(await countArticles()).toBe(0);
});
```

### Using Test Scenario

```typescript
it('should create complete test scenario', async () => {
  const { user, articles, tags, comment } = await createTestScenario();

  expect(user).toBeDefined();
  expect(articles).toHaveLength(3);
  expect(tags).toHaveLength(5);
  expect(comment).toBeDefined();
  expect(comment.authorId).toBe(user.id);
});
```

## Key Patterns Established

1. **Separate Test Database:** Always use dedicated test database
2. **Test Client:** Use `getTestClient()` instead of main Prisma client
3. **Clean Between Tests:** Use `beforeEach(() => cleanDatabase())`
4. **Fixtures for Data:** Use fixtures instead of raw `create()` calls
5. **Test Helpers:** Use high-level helpers for common operations
6. **Realistic Data:** Use `@faker-js/faker` for realistic test data
7. **Proper Cleanup:** Always disconnect after all tests
8. **Test Isolation:** Each test should be independent

## Next Steps

- ✅ **Task 5.1:** Vitest Setup (COMPLETED)
- ✅ **Task 5.2:** Database Testing Strategy (COMPLETED)
- 🔜 **Task 5.3:** React Testing Library Setup
- 🔜 **Task 5.4:** Playwright E2E Setup
- 🔜 **Task 5.5:** CI/CD Testing Pipeline
- 🔜 **Task 5.6:** Testing Documentation

## Notes

- Test database must be created manually (security best practice)
- Migrations must be run on test database before running tests
- All test utilities can be imported from `@repo/database` in other packages
- Use `DEBUG_TESTS=true` to enable query logging during test development
- Integration tests use real database, so they're slower than unit tests
- For CI/CD, test database can be created automatically in GitHub Actions
