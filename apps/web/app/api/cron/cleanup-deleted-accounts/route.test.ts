/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import * as cleanupService from '@/lib/services/account-cleanup.service';

import { GET } from './route';

// Mock the cleanup service
vi.mock('@/lib/services/account-cleanup.service', () => ({
  cleanupDeletedAccounts: vi.fn(),
}));

describe('/api/cron/cleanup-deleted-accounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env vars
    delete process.env.CRON_SECRET;
  });

  describe('GET', () => {
    it('should reject requests without authorization header', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization',
      });
      expect(cleanupService.cleanupDeletedAccounts).not.toHaveBeenCalled();
    });

    it('should reject requests with invalid authorization header', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts',
        {
          headers: {
            Authorization: 'Bearer wrong-secret',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization',
      });
    });

    it('should process cleanup when authorized', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const mockResult = {
        deletedCount: 2,
        deletedUsers: [
          { id: 'user1', email: 'user1@example.com', deletedAt: '2025-12-10' },
          { id: 'user2', email: 'user2@example.com', deletedAt: '2025-12-05' },
        ],
        errors: [],
      };

      vi.mocked(cleanupService.cleanupDeletedAccounts).mockResolvedValue(
        mockResult
      );

      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts',
        {
          headers: {
            Authorization: 'Bearer test-secret',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        deletedCount: 2,
        errors: [],
        message: 'Successfully processed 2 account deletions',
      });
      expect(cleanupService.cleanupDeletedAccounts).toHaveBeenCalledOnce();
    });

    it('should handle zero deletions', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const mockResult = {
        deletedCount: 0,
        deletedUsers: [],
        errors: [],
      };

      vi.mocked(cleanupService.cleanupDeletedAccounts).mockResolvedValue(
        mockResult
      );

      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts',
        {
          headers: {
            Authorization: 'Bearer test-secret',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        deletedCount: 0,
        errors: [],
        message: 'No accounts eligible for deletion',
      });
    });

    it('should handle partial failures', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const mockResult = {
        deletedCount: 1,
        deletedUsers: [
          { id: 'user1', email: 'user1@example.com', deletedAt: '2025-12-10' },
        ],
        errors: [{ userId: 'user2', error: 'Database error' }],
      };

      vi.mocked(cleanupService.cleanupDeletedAccounts).mockResolvedValue(
        mockResult
      );

      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts',
        {
          headers: {
            Authorization: 'Bearer test-secret',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        deletedCount: 1,
        errors: [{ userId: 'user2', error: 'Database error' }],
        message: 'Successfully processed 1 account deletions with 1 errors',
      });
    });

    it('should handle complete failure', async () => {
      process.env.CRON_SECRET = 'test-secret';

      vi.mocked(cleanupService.cleanupDeletedAccounts).mockRejectedValue(
        new Error('Service unavailable')
      );

      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts',
        {
          headers: {
            Authorization: 'Bearer test-secret',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Internal Server Error',
        message: 'Service unavailable',
      });
    });

    it('should work without CRON_SECRET in development', async () => {
      // No CRON_SECRET set
      const mockResult = {
        deletedCount: 0,
        deletedUsers: [],
        errors: [],
      };

      vi.mocked(cleanupService.cleanupDeletedAccounts).mockResolvedValue(
        mockResult
      );

      const request = new Request(
        'http://localhost:3000/api/cron/cleanup-deleted-accounts'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
