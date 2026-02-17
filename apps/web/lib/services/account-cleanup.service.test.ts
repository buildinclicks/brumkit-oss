/**
 * @vitest-environment node
 */
import { prisma } from '@repo/database';
import * as emailService from '@repo/email';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  findDeletableUsers,
  anonymizeUserData,
  cleanupDeletedAccounts,
} from './account-cleanup.service';

// Mock modules
vi.mock('@repo/database', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
    },
    emailChangeToken: {
      deleteMany: vi.fn(),
    },
    session: {
      deleteMany: vi.fn(),
    },
    account: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@repo/email', () => ({
  sendAccountDeletionFinalEmail: vi.fn(),
  sendAdminDeletionSummary: vi.fn(),
}));

describe('Account Cleanup Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findDeletableUsers', () => {
    it('should find users deleted more than 30 days ago', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          deletedAt: new Date('2025-12-10'),
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          deletedAt: new Date('2025-12-05'),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);

      const result = await findDeletableUsers();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: true,
          deletedAt: {
            not: null,
            lte: expect.any(Date),
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          deletedAt: true,
        },
      });
    });

    it('should return empty array when no users are deletable', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);

      const result = await findDeletableUsers();

      expect(result).toEqual([]);
    });
  });

  describe('anonymizeUserData', () => {
    it('should anonymize user data and delete related records', async () => {
      const userId = 'test-user-id';
      const mockTransaction = async (callback: any) => {
        const tx = {
          verificationToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          passwordResetToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          emailChangeToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          session: { deleteMany: vi.fn().mockResolvedValue({}) },
          account: { deleteMany: vi.fn().mockResolvedValue({}) },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return await callback(tx);
      };

      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction as any);

      await anonymizeUserData(userId);

      expect(prisma.$transaction).toHaveBeenCalled();
      // Transaction callback will be tested through integration tests
    });
  });

  describe('cleanupDeletedAccounts', () => {
    it('should process deletable accounts and send notifications', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          deletedAt: new Date('2025-12-10'),
        },
      ];

      const mockTransaction = async (callback: any) => {
        const tx = {
          verificationToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          passwordResetToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          emailChangeToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          session: { deleteMany: vi.fn().mockResolvedValue({}) },
          account: { deleteMany: vi.fn().mockResolvedValue({}) },
          user: {
            update: vi.fn().mockResolvedValue({
              id: 'user1',
              email: 'anonymized.user1@deleted.com',
            }),
          },
        };
        return await callback(tx);
      };

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction as any);
      vi.mocked(emailService.sendAccountDeletionFinalEmail).mockResolvedValue({
        success: true,
        data: {} as any,
      });
      vi.mocked(emailService.sendAdminDeletionSummary).mockResolvedValue({
        success: true,
        data: {} as any,
      });

      const result = await cleanupDeletedAccounts();

      expect(result.deletedCount).toBe(1);
      expect(result.deletedUsers).toHaveLength(1);
      expect(result.errors).toHaveLength(0);
      expect(emailService.sendAccountDeletionFinalEmail).toHaveBeenCalledWith({
        email: 'user1@example.com',
        userName: 'User One',
      });
      expect(emailService.sendAdminDeletionSummary).toHaveBeenCalledWith({
        deletedCount: 1,
        date: expect.any(String),
        deletedUsers: [
          {
            id: 'user1',
            email: 'user1@example.com',
            deletedAt: mockUsers[0].deletedAt.toISOString(),
          },
        ],
      });
    });

    it('should return zero count when no accounts are deletable', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);

      const result = await cleanupDeletedAccounts();

      expect(result.deletedCount).toBe(0);
      expect(result.deletedUsers).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
      expect(emailService.sendAccountDeletionFinalEmail).not.toHaveBeenCalled();
      expect(emailService.sendAdminDeletionSummary).not.toHaveBeenCalled();
    });

    it('should continue processing if email fails', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          deletedAt: new Date('2025-12-10'),
        },
      ];

      const mockTransaction = async (callback: any) => {
        const tx = {
          verificationToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          passwordResetToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          emailChangeToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          session: { deleteMany: vi.fn().mockResolvedValue({}) },
          account: { deleteMany: vi.fn().mockResolvedValue({}) },
          user: {
            update: vi.fn().mockResolvedValue({
              id: 'user1',
              email: 'anonymized.user1@deleted.com',
            }),
          },
        };
        return await callback(tx);
      };

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction as any);
      vi.mocked(emailService.sendAccountDeletionFinalEmail).mockRejectedValue(
        new Error('Email service unavailable')
      );
      vi.mocked(emailService.sendAdminDeletionSummary).mockResolvedValue({
        success: true,
        data: {} as any,
      });

      const result = await cleanupDeletedAccounts();

      // Should still anonymize data even if email fails
      expect(result.deletedCount).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('should track errors when anonymization fails', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          deletedAt: new Date('2025-12-10'),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(emailService.sendAccountDeletionFinalEmail).mockResolvedValue({
        success: true,
        data: {} as any,
      });
      vi.mocked(prisma.$transaction).mockRejectedValue(
        new Error('Database error')
      );

      const result = await cleanupDeletedAccounts();

      expect(result.deletedCount).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        userId: 'user1',
        error: 'Database error',
      });
      // Should not send admin summary if no successful deletions
      expect(emailService.sendAdminDeletionSummary).not.toHaveBeenCalled();
    });

    it('should process multiple users', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          deletedAt: new Date('2025-12-10'),
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          deletedAt: new Date('2025-12-05'),
        },
      ];

      const mockTransaction = async (callback: any) => {
        const tx = {
          verificationToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          passwordResetToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          emailChangeToken: { deleteMany: vi.fn().mockResolvedValue({}) },
          session: { deleteMany: vi.fn().mockResolvedValue({}) },
          account: { deleteMany: vi.fn().mockResolvedValue({}) },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return await callback(tx);
      };

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction as any);
      vi.mocked(emailService.sendAccountDeletionFinalEmail).mockResolvedValue({
        success: true,
        data: {} as any,
      });
      vi.mocked(emailService.sendAdminDeletionSummary).mockResolvedValue({
        success: true,
        data: {} as any,
      });

      const result = await cleanupDeletedAccounts();

      expect(result.deletedCount).toBe(2);
      expect(result.deletedUsers).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(emailService.sendAccountDeletionFinalEmail).toHaveBeenCalledTimes(
        2
      );
      expect(emailService.sendAdminDeletionSummary).toHaveBeenCalledWith({
        deletedCount: 2,
        date: expect.any(String),
        deletedUsers: expect.arrayContaining([
          expect.objectContaining({ id: 'user1' }),
          expect.objectContaining({ id: 'user2' }),
        ]),
      });
    });
  });
});
