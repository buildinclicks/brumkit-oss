/**
 * Cron Job: Cleanup Deleted Accounts
 *
 * Permanently deletes soft-deleted accounts after 30-day grace period.
 * This endpoint is called by Vercel Cron daily at 2 AM UTC.
 *
 * Security: Protected by CRON_SECRET environment variable.
 */

import { NextResponse } from 'next/server';

import { cleanupDeletedAccounts } from '@/lib/services/account-cleanup.service';

import type { NextRequest } from 'next/server';

/**
 * Verify the request is from Vercel Cron
 */
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In development, allow requests without auth for testing
  if (!cronSecret) {
    console.warn(
      '⚠️  CRON_SECRET not set. Allowing request (development mode only)'
    );
    return true;
  }

  // Verify Bearer token matches CRON_SECRET
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === cronSecret;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Missing or invalid authorization',
        },
        { status: 401 }
      );
    }

    console.log('🔄 Starting account cleanup cron job...');

    // Run cleanup
    const result = await cleanupDeletedAccounts();

    // Log results
    console.log(`✅ Cleanup complete:
      - Deleted: ${result.deletedCount} accounts
      - Errors: ${result.errors.length}
    `);

    if (result.errors.length > 0) {
      console.error('Errors during cleanup:', result.errors);
    }

    // Determine response message
    let message: string;
    if (result.deletedCount === 0) {
      message = 'No accounts eligible for deletion';
    } else if (result.errors.length > 0) {
      message = `Successfully processed ${result.deletedCount} account deletions with ${result.errors.length} errors`;
    } else {
      message = `Successfully processed ${result.deletedCount} account deletions`;
    }

    return NextResponse.json(
      {
        success: true,
        deletedCount: result.deletedCount,
        errors: result.errors,
        message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Cron job failed:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
