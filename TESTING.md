# Testing Guide - BroomKit

Quick reference for testing in BroomKit.

## Test Database Setup

### First Time Setup

```bash
# 1. Start PostgreSQL (if not already running)
docker compose -f docker/docker-compose.yml up -d postgres

# 2. Create and migrate test database
pnpm --filter @repo/database test:setup
```

### Running Tests

```bash
# Run specific test file
pnpm --filter web test notification.test.ts

# Run all action tests
pnpm --filter web test app/actions/

# Run all tests
pnpm test

# Watch mode
pnpm --filter web test:watch
```

## When to Use Real Database vs Mocks

### ✅ Use Real Test Database For:

- **Server actions** that interact with database (`apps/web/app/actions/*.ts`)
- **API routes** that query/mutate data
- **Service layers** that orchestrate database operations
- **E2E tests** that need real data state

### ✅ Use Mocks For:

- **Validation** tests (Zod schemas)
- **Permission** tests (CASL rules)
- **UI component** tests (React)
- **Rate limiting** tests (focused on limiter logic)
- **Pure utility** functions

## Writing Integration Tests

### Basic Pattern

```typescript
import {
  getTestClient,
  cleanDatabase,
  disconnectTestClient,
  createTestUser,
} from '@repo/database/test';

// Mock database to use test client
vi.mock('@repo/database', async () => {
  const { getTestClient } = await import('@repo/database/test');
  return { db: getTestClient() };
});

// Mock external services
vi.mock('@repo/email', () => ({
  sendEmail: vi.fn(),
}));

describe('My Server Action', () => {
  const testDb = getTestClient();

  beforeEach(async () => {
    await cleanDatabase(); // Clean before each test
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await cleanDatabase(); // Clean after all tests
    await disconnectTestClient(); // Disconnect
  });

  it('should do something', async () => {
    // Arrange: Create test data
    const user = await createTestUser({
      email: 'test@example.com',
    });

    // Act: Call the function
    const result = await myServerAction(user.id);

    // Assert: Check real database state
    const updated = await testDb.user.findUnique({
      where: { id: user.id },
    });

    expect(result.success).toBe(true);
    expect(updated?.someField).toBe('expected value');
  });
});
```

### Available Helpers

```typescript
// User helpers
const user = await createTestUser({
  email: 'test@example.com',
  name: 'Test User',
});
const found = await findUserByEmail('test@example.com');
const count = await countUsers();

// Notification helpers
const notification = await createTestNotification({
  recipientId: user.id,
  type: 'SYSTEM',
  title: 'Test',
  readAt: null,
});

// Database cleanup
await cleanDatabase(); // Respects FK constraints
await disconnectTestClient(); // In afterAll
```

## Troubleshooting

### "Database does not exist"

```bash
pnpm --filter @repo/database test:setup
```

### "Unique constraint failed"

Ensure `beforeEach` includes:

```typescript
beforeEach(async () => {
  await cleanDatabase();
});
```

### "Cannot connect to database"

```bash
docker ps | grep postgres
# If not running:
docker compose -f docker/docker-compose.yml up -d postgres
```

### Tests fail when run together

Already fixed in `vitest.config.ts` with:

```typescript
test: {
  fileParallelism: false,
}
```

## Examples

See these files for reference:

- `apps/web/app/actions/notification.test.ts` - Basic pattern
- `apps/web/app/actions/email-change.test.ts` - Token handling
- `apps/web/app/actions/account-deletion.test.ts` - Complex scenarios

## More Info

See: `docs/open-source-version/release-0.0/test-database-migration-complete.md`
