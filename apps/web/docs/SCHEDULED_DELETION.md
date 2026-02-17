# Scheduled Account Deletion - Cron Job Documentation

## Overview

This feature implements automated permanent deletion of soft-deleted user accounts after a 30-day grace period. It uses Vercel Cron to run daily at 2 AM UTC.

## Architecture

### Components

1. **Account Cleanup Service** (`apps/web/lib/services/account-cleanup.service.ts`)
   - `findDeletableUsers()` - Queries database for accounts deleted >30 days ago
   - `anonymizeUserData()` - Implements hybrid deletion (removes PII, keeps anonymized metrics)
   - `cleanupDeletedAccounts()` - Orchestrates the entire cleanup process

2. **Cron API Route** (`apps/web/app/api/cron/cleanup-deleted-accounts/route.ts`)
   - Secured with `CRON_SECRET` environment variable
   - Called by Vercel Cron daily at 2 AM UTC
   - Returns detailed execution results

3. **Email Templates** (`packages/email/src/templates/`)
   - `account-deletion-final.tsx` - Final notification to users
   - `admin-deletion-summary.tsx` - Daily summary report for admins

## Data Retention Policy (Hybrid Deletion)

### What Gets DELETED (PII)

- Email (replaced with `anonymized.[userId]@deleted.com`)
- Name (replaced with "Deleted User")
- Username (replaced with `deleted_[userId]`)
- Password hash (cleared)
- Profile image URL (cleared)
- Bio (cleared)
- Email verification status (cleared)
- All tokens (verification, password reset, email change)
- All sessions
- All OAuth accounts

### What Gets KEPT (Anonymized)

- User record with anonymized data
- `createdAt`, `updatedAt` timestamps
- `deletedAt`, `isDeleted` flags
- User ID (for referential integrity)

This allows analytics/reporting while protecting user privacy.

## Configuration

### Environment Variables

Required in production:

```bash
# Admin notifications
ADMIN_EMAIL=admin@yourdomain.com

# Cron job security
CRON_SECRET=your-generated-secret
```

To generate a secure `CRON_SECRET`:

```bash
openssl rand -base64 32
```

### Vercel Configuration

The cron job is configured in `apps/web/vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-deleted-accounts",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Schedule format: `minute hour day-of-month month day-of-week`

- `0 2 * * *` = Daily at 2:00 AM UTC

## Deployment

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

| Variable      | Value                  | Environment        |
| ------------- | ---------------------- | ------------------ |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Production         |
| `CRON_SECRET` | `[generated secret]`   | Production         |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Preview (optional) |
| `CRON_SECRET` | `[generated secret]`   | Preview (optional) |

4. Click **Save**

### Step 2: Deploy

```bash
# From project root
pnpm turbo build
git push origin main
```

Vercel will automatically:

1. Detect the `vercel.json` cron configuration
2. Register the cron job
3. Start calling the endpoint daily at 2 AM UTC

### Step 3: Verify Deployment

After deployment, check the Vercel dashboard:

1. Go to **Deployments** → Select your deployment
2. Navigate to **Cron Jobs** tab
3. Verify the job is listed with correct schedule
4. Check execution logs after the first run

## Security

### Authorization

The API endpoint uses Bearer token authentication:

```typescript
Authorization: Bearer {CRON_SECRET}
```

Vercel automatically includes this header when calling the cron endpoint.

### Development Mode

If `CRON_SECRET` is not set (development), the endpoint:

- Logs a warning
- Allows requests without authentication
- **Never deploy without `CRON_SECRET` in production!**

## Testing

### Unit Tests

Run all tests:

```bash
cd apps/web
pnpm test lib/services/account-cleanup.service.test.ts
pnpm test app/api/cron/cleanup-deleted-accounts/route.test.ts
```

### Local Manual Testing

1. **Set up test user:**

```bash
# Create a user and soft-delete them with deletedAt >30 days ago
# You'll need to manually update the database for testing
```

2. **Call the endpoint manually:**

```bash
# Without auth (development)
curl http://localhost:3000/api/cron/cleanup-deleted-accounts

# With auth (production simulation)
curl -H "Authorization: Bearer your-secret" \
  http://localhost:3000/api/cron/cleanup-deleted-accounts
```

3. **Check response:**

```json
{
  "success": true,
  "deletedCount": 2,
  "errors": [],
  "message": "Successfully processed 2 account deletions"
}
```

### Testing in Production (Careful!)

Use Vercel CLI to trigger the cron job:

```bash
vercel cron trigger --token YOUR_VERCEL_TOKEN
```

⚠️ **Warning:** This will permanently delete accounts in production!

## Monitoring

### Vercel Logs

View cron execution logs:

1. Go to Vercel dashboard → **Logs**
2. Filter by `/api/cron/cleanup-deleted-accounts`
3. Look for:
   - `🔄 Starting account cleanup cron job...`
   - `✅ Cleanup complete: X accounts processed`
   - `❌ Cron job failed:` (errors)

### Email Notifications

Admins receive daily summary emails with:

- Number of accounts deleted
- List of deleted user IDs and emails
- Deletion timestamps
- Data retention policy reminder

### Error Handling

The service gracefully handles:

- Email sending failures (continues with deletion)
- Database errors (tracked in `result.errors`)
- Partial failures (some users succeed, some fail)

All errors are:

- Logged to console
- Included in API response
- Visible in Vercel logs

## Maintenance

### Changing the Schedule

Edit `apps/web/vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-deleted-accounts",
      "schedule": "0 3 * * *" // Change to 3 AM
    }
  ]
}
```

Redeploy to apply changes.

### Adjusting Grace Period

Edit `apps/web/lib/services/account-cleanup.service.ts`:

```typescript
const DELETION_GRACE_PERIOD_DAYS = 30; // Change to desired days
```

### Disabling the Cron Job

Remove the cron configuration from `vercel.json`:

```json
{
  "crons": []
}
```

Or delete the file entirely.

## Troubleshooting

### Issue: Cron job not running

**Check:**

1. Vercel dashboard → Cron Jobs tab (is it listed?)
2. Environment variable `CRON_SECRET` is set
3. Deployment succeeded without errors
4. Check Vercel logs for execution attempts

### Issue: "Unauthorized" errors in logs

**Solution:**

- Ensure `CRON_SECRET` matches in Vercel settings
- Redeploy after changing environment variables

### Issue: Emails not sending

**Check:**

1. `RESEND_API_KEY` is valid
2. `FROM_EMAIL` is verified in Resend
3. `ADMIN_EMAIL` is correct
4. Resend account has not exceeded limits

**Note:** Email failures don't stop account deletion (by design).

### Issue: No accounts being deleted

**Verify:**

1. Users have `isDeleted = true`
2. `deletedAt` is >30 days ago
3. Database connection is working
4. Check service logs for query results

## Related Documentation

- [Account Deletion Feature](./ACCOUNT_DELETION.md)
- [Email Templates](../../packages/email/README.md)
- [Vercel Cron Documentation](https://vercel.com/docs/cron-jobs)

## Support

For issues or questions:

1. Check Vercel logs first
2. Review test files for examples
3. Verify environment variables
4. Contact team lead if persistent issues occur
