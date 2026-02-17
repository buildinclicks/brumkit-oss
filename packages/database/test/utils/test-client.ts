/**
 * Test Database Client
 *
 * Provides a separate Prisma client instance for testing.
 * Uses test database URL and handles cleanup between tests.
 */

import { PrismaClient } from '@prisma/client';

// Test database URL (uses separate test database)
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL?.replace(/\/(\w+)$/, '/$1_test') ||
  'postgresql://postgres:postgres@127.0.0.1:5432/broom_kit_test';

let testPrisma: PrismaClient | null = null;

/**
 * Get or create test Prisma client instance
 */
export function getTestClient(): PrismaClient {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: TEST_DATABASE_URL,
        },
      },
      log: process.env.DEBUG_TESTS ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return testPrisma;
}

/**
 * Disconnect test client
 */
export async function disconnectTestClient() {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
}

/**
 * Clean all tables in test database (for integration tests)
 * Deletes data in correct order to respect foreign key constraints
 */
export async function cleanDatabase() {
  const client = getTestClient();

  await client.$transaction([
    // Delete dependent records first
    client.notification.deleteMany(),
    client.session.deleteMany(),
    client.account.deleteMany(),
    client.verificationToken.deleteMany(),
    client.user.deleteMany(),
  ]);
}

/**
 * Reset test database - clean all data
 * Useful for beforeAll/afterAll hooks
 */
export async function resetTestDatabase() {
  await cleanDatabase();
}
