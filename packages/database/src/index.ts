/**
 * @repo/database
 *
 * Prisma database client and types for Broom Kit monorepo.
 *
 * @example
 * ```ts
 * import { prisma } from "@repo/database";
 *
 * const users = await prisma.user.findMany();
 * ```
 */

// Export Prisma Client instance
export { prisma, disconnect, healthCheck } from './client';

// Export alias for convenience
export { prisma as db } from './client';

// Re-export Prisma types for convenience
export { Prisma, PrismaClient } from '@prisma/client';

// Re-export commonly used types
export type {
  User,
  Account,
  Session,
  VerificationToken,
  Notification,
  UserRole,
  NotificationType,
} from '@prisma/client';
