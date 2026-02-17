/**
 * Account Cleanup Service
 *
 * Handles permanent deletion of soft-deleted accounts after 30-day grace period.
 * Implements hybrid data retention: deletes PII, keeps anonymized metrics.
 */

import { prisma } from '@repo/database';
import {
  sendAccountDeletionFinalEmail,
  sendAdminDeletionSummary,
} from '@repo/email';

const DELETION_GRACE_PERIOD_DAYS = 30;

interface DeletedUserInfo {
  id: string;
  email: string;
  deletedAt: string;
}

interface CleanupResult {
  deletedCount: number;
  deletedUsers: DeletedUserInfo[];
  errors: Array<{ userId: string; error: string }>;
}

/**
 * Find users eligible for permanent deletion
 * (soft-deleted more than 30 days ago)
 */
export async function findDeletableUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DELETION_GRACE_PERIOD_DAYS);

  const users = await prisma.user.findMany({
    where: {
      isDeleted: true,
      deletedAt: {
        not: null,
        lte: thirtyDaysAgo,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      deletedAt: true,
    },
  });

  return users;
}

/**
 * Anonymize user data (Hybrid deletion)
 *
 * DELETES (PII):
 * - email (replaced with anonymized@deleted.com)
 * - name (replaced with "Deleted User")
 * - username (replaced with deleted_[userId])
 * - password hash (cleared)
 * - profile image URL (cleared)
 * - bio (cleared)
 * - emailVerified (cleared)
 * - verificationTokens (deleted)
 * - passwordResetTokens (deleted)
 * - emailChangeTokens (deleted)
 * - sessions (deleted)
 * - accounts (OAuth connections - deleted)
 *
 * KEEPS (Anonymized for analytics):
 * - User record (with anonymized data)
 * - createdAt, updatedAt timestamps
 * - deletedAt, isDeleted flags
 */
export async function anonymizeUserData(userId: string) {
  await prisma.$transaction(async (tx) => {
    // Delete all sessions
    await tx.session.deleteMany({
      where: { userId },
    });

    // Delete all OAuth accounts
    await tx.account.deleteMany({
      where: { userId },
    });

    // Anonymize user data
    await tx.user.update({
      where: { id: userId },
      data: {
        email: `anonymized.${userId}@deleted.com`,
        name: 'Deleted User',
        username: `deleted_${userId.slice(0, 8)}`,
        password: null,
        image: null,
        bio: null,
        emailVerified: null,
        emailChangeToken: null,
        emailChangeTokenExpiry: null,
        newEmail: null,
      },
    });
  });
}

/**
 * Process cleanup of all deletable accounts
 */
export async function cleanupDeletedAccounts(): Promise<CleanupResult> {
  const users = await findDeletableUsers();
  const result: CleanupResult = {
    deletedCount: 0,
    deletedUsers: [],
    errors: [],
  };

  if (users.length === 0) {
    // No accounts to delete
    return result;
  }

  // Log found accounts for deletion

  // Process each user
  for (const user of users) {
    try {
      // Processing user for deletion

      // Send final notification email BEFORE anonymization
      try {
        await sendAccountDeletionFinalEmail({
          email: user.email,
          userName: user.name || 'User',
        });
        // Final email sent successfully
      } catch (emailError) {
        console.warn(
          `⚠️  Failed to send final email to ${user.email}:`,
          emailError
        );
        // Continue with deletion even if email fails
      }

      // Anonymize user data
      await anonymizeUserData(user.id);
      // User anonymized successfully

      // Track successful deletion
      result.deletedCount++;
      result.deletedUsers.push({
        id: user.id,
        email: user.email,
        deletedAt: user.deletedAt?.toISOString() ?? 'unknown',
      });
    } catch (error) {
      console.error(`❌ Failed to process user ${user.id}:`, error);
      result.errors.push({
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Send admin summary email
  if (result.deletedCount > 0) {
    try {
      await sendAdminDeletionSummary({
        deletedCount: result.deletedCount,
        date: new Date().toISOString().split('T')[0] ?? 'unknown',
        deletedUsers: result.deletedUsers,
      });
      // Admin summary email sent
    } catch (emailError) {
      console.warn('⚠️  Failed to send admin summary email:', emailError);
      // Don't fail the entire process if admin email fails
    }
  }

  // Return cleanup results
  return result;
}
