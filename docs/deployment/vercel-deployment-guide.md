# Vercel Deployment Guide

Complete guide for deploying React Masters to Vercel in production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Neon)](#database-setup)
3. [Redis Setup (Upstash)](#redis-setup)
4. [Email Setup (Resend)](#email-setup)
5. [Vercel Project Setup](#vercel-project-setup)
6. [Environment Variables](#environment-variables)
7. [Deploy Application](#deploy-application)
8. [Verify Deployment](#verify-deployment)
9. [Cron Job Verification](#cron-job-verification)
10. [Domain Setup (Optional)](#domain-setup)
11. [Post-Deployment Tasks](#post-deployment-tasks)
12. [Monitoring & Logs](#monitoring-logs)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository with your React Masters code
- ✅ [Vercel account](https://vercel.com/signup) (free tier works)
- ✅ [Neon account](https://neon.tech) for PostgreSQL (free tier works)
- ✅ [Upstash account](https://upstash.com) for Redis (free tier works)
- ✅ [Resend account](https://resend.com) for emails (free tier works)
- ✅ Local development working and tested

**Estimated Time:** 30-45 minutes

---

## Database Setup

### Option 1: Neon (Recommended)

Neon provides serverless PostgreSQL, perfect for Vercel deployments.

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up with GitHub (recommended)
   - Verify email

2. **Create Database**
   - Click **"New Project"**
   - Name: `react-masters-prod`
   - Region: Choose closest to your users (e.g., US East, EU West)
   - PostgreSQL version: 16 (latest)
   - Click **"Create Project"**

3. **Get Connection String**
   - Copy the connection string
   - Format: `postgresql://user:password@host/database?sslmode=require`
   - **Save this securely** - you'll need it for Vercel

4. **Test Connection (Optional)**
   ```bash
   # Install psql if not available
   # Then connect to verify
   psql "postgresql://user:password@host/database?sslmode=require"
   ```

**Connection String Example:**

```
postgresql://neondb_owner:abc123xyz@ep-cool-cloud-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Option 2: Other PostgreSQL Providers

Alternatives that work well with Vercel:

- **Supabase** - https://supabase.com (includes auth, storage)
- **Railway** - https://railway.app (full infrastructure platform)
- **AWS RDS** - More complex, better for large scale

For any provider, you need:

- ✅ Connection string with SSL support
- ✅ Publicly accessible (or Vercel IP whitelisting)
- ✅ Connection pooling recommended for serverless

---

## Redis Setup

### Upstash Redis

Upstash provides serverless Redis via REST API, perfect for Vercel.

1. **Create Upstash Account**
   - Go to https://console.upstash.com
   - Sign up with GitHub or email
   - Verify email

2. **Create Redis Database**
   - Click **"Create Database"**
   - Name: `react-masters-redis`
   - Type: **Regional** (cheaper, sufficient for most use cases)
   - Region: Choose closest to your Vercel region
   - Primary Region: Same as Neon database region (for low latency)
   - Click **"Create"**

3. **Get Connection Details**
   - Click on your database
   - Navigate to **"REST API"** tab
   - Copy:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - **Save these securely**

**Example:**

```env
UPSTASH_REDIS_REST_URL=https://us1-fair-firefly-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **Configure Eviction Policy (Important!)**
   - Go to **"Details"** tab
   - Eviction Policy: **allkeys-lru** (recommended for rate limiting)
   - Max Memory: 256 MB (free tier) - sufficient for rate limiting

5. **Enable TLS (Optional but Recommended)**
   - Already enabled by default for REST API
   - Ensures encrypted communication

---

## Email Setup

### Resend

Resend provides email API with great developer experience.

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up with email
   - Verify email

2. **Get API Key**
   - Navigate to **"API Keys"**
   - Click **"Create API Key"**
   - Name: `react-masters-production`
   - Permission: **Full Access** (or **Sending Access** only)
   - Click **"Add"**
   - **Copy and save the API key securely** (shown only once!)

**Example:**

```env
RESEND_API_KEY=re_123456789abcdefghijklmnop
```

3. **Verify Domain (Required for Production)**

Without domain verification, you can only send to your verified email.

**Steps:**

- Go to **"Domains"** → **"Add Domain"**
- Enter your domain: `yourdomain.com`
- Add DNS records (provided by Resend):
  - **SPF** (TXT record)
  - **DKIM** (TXT record)
  - **DMARC** (TXT record) - optional but recommended
- Wait for DNS propagation (5 mins - 24 hours)
- Click **"Verify"**

**Example DNS Records:**

```
Type: TXT
Name: yourdomain.com
Value: v=spf1 include:amazonses.com ~all

Type: TXT
Name: resend._domainkey.yourdomain.com
Value: [provided by Resend]
```

4. **Configure FROM Email**
   - After domain verification
   - Use: `noreply@yourdomain.com` or `hello@yourdomain.com`
   - Update `FROM_EMAIL` environment variable

**⚠️ Free Tier Limitations:**

- 100 emails/day
- 1 verified domain
- 3,000 emails/month

For higher limits, upgrade to paid plan ($20/month for 50k emails).

---

## Vercel Project Setup

### 1. Import Repository

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**
   - Select **"Import Git Repository"**
   - Choose **GitHub** (recommended)
   - Authorize Vercel to access GitHub
   - Select your `react-masters` repository
   - Click **"Import"**

### 2. Configure Build Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `apps/web` ⚠️ **IMPORTANT!**

**Build & Output Settings:**

- Build Command: `pnpm turbo build --filter=web` (auto-configured)
- Output Directory: `.next` (auto-configured)
- Install Command: `pnpm install` (auto-configured)

**Node.js Version:** 20.x (default, recommended)

**Environment Variables:** ⚠️ **Don't configure yet** - we'll do this in the next section

Click **"Deploy"** → This will fail initially (no env vars), that's expected!

---

## Environment Variables

### Required Environment Variables

Go to **Project Settings** → **Environment Variables**

Add the following variables for **Production** environment:

#### 1. Database

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Use your Neon connection string from earlier.

#### 2. Redis (Upstash)

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxx
```

Use your Upstash credentials from earlier.

#### 3. Auth.js

```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
# Example output: Kz8/9mXvN1qP2wR5tY7uZ+A3bC4dE6fG8hJ0kL=
```

#### 4. Email (Resend)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

- Use your Resend API key
- Use verified domain email for `FROM_EMAIL`
- Use your admin email for cron notifications

#### 5. Cron Job Security

```env
CRON_SECRET=[generate with: openssl rand -base64 32]
```

**Generate CRON_SECRET:**

```bash
openssl rand -base64 32
# Example: 7xY9zA1bC2dE3fG4hJ5kL6mN8pQ0rS+tU/vW=
```

### Environment Variable Checklist

- ✅ `DATABASE_URL` - Neon PostgreSQL connection string
- ✅ `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- ✅ `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- ✅ `NEXTAUTH_URL` - Your Vercel deployment URL
- ✅ `NEXTAUTH_SECRET` - Generated secret (32+ characters)
- ✅ `RESEND_API_KEY` - Resend API key
- ✅ `FROM_EMAIL` - Verified sender email
- ✅ `ADMIN_EMAIL` - Admin notification email
- ✅ `CRON_SECRET` - Generated secret for cron auth

### How to Add Variables

1. Go to **Vercel Dashboard** → **Your Project**
2. Navigate to **Settings** → **Environment Variables**
3. For each variable:
   - **Key:** Variable name (e.g., `DATABASE_URL`)
   - **Value:** Variable value
   - **Environment:** Select **Production** (and optionally Preview, Development)
   - Click **"Save"**

4. After adding all variables, click **"Save"**

---

## Deploy Application

### 1. Run Database Migrations

Before deploying, ensure database schema is up-to-date.

**Option A: From Local (Recommended)**

```bash
# Set DATABASE_URL to production database temporarily
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Run migrations
cd packages/database
pnpm prisma migrate deploy

# Verify schema
pnpm prisma db pull
```

**Option B: From Vercel CLI**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations (production)
vercel env pull .env.production
pnpm --filter @repo/database prisma migrate deploy
```

**⚠️ Important:** Never run `prisma migrate dev` in production! Use `prisma migrate deploy` only.

### 2. Trigger Deployment

1. **From Vercel Dashboard**
   - Go to **Deployments** tab
   - Click **"Redeploy"** button
   - OR push a new commit to GitHub (auto-deploys)

2. **From Git**

   ```bash
   git push origin main
   # Vercel auto-deploys on push to main branch
   ```

3. **Watch Build Logs**
   - Go to **Deployments** → Click on your deployment
   - View real-time build logs
   - Wait for "Build Complete" ✅

**Deployment Status:**

- 🔄 **Building** - Compiling application
- ✅ **Ready** - Deployment successful
- ❌ **Error** - Check logs for issues

### 3. Build Success Indicators

✅ Build command completed
✅ No TypeScript errors
✅ No ESLint errors
✅ `.next` directory generated
✅ Serverless functions deployed
✅ Edge functions deployed (if any)
✅ Static assets uploaded to CDN

---

## Verify Deployment

### 1. Basic Health Check

Visit your deployment URL: `https://your-app.vercel.app`

**Check:**

- ✅ Home page loads
- ✅ No 404 or 500 errors
- ✅ Console has no errors (open browser DevTools)

### 2. Test Authentication

1. **Register New Account**
   - Go to `/register`
   - Create account with real email
   - Check for verification email (Resend)
   - Verify email address

2. **Login**
   - Go to `/login`
   - Login with registered account
   - Verify dashboard loads

3. **Password Reset**
   - Go to `/forgot-password`
   - Request password reset
   - Check email for reset link
   - Complete password reset flow

### 3. Test Profile Features

1. **Update Profile**
   - Go to `/profile`
   - Update name, username, bio
   - Verify changes persist

2. **Change Password**
   - Change password
   - Verify email notification sent
   - Logout and login with new password

3. **Change Email**
   - Request email change
   - Verify both emails sent (new + old)
   - Complete verification flow

4. **Rate Limiting**
   - Try multiple rapid requests
   - Should see rate limit messages
   - Verify Upstash Redis working (check Upstash console)

### 4. Check Database Connection

```bash
# From Vercel CLI
vercel logs --prod

# Look for:
# ✅ "Database connection successful"
# ❌ "Database connection failed" (indicates issue)
```

Or check logs in Vercel Dashboard → **Deployments** → **Logs**

---

## Cron Job Verification

The scheduled account deletion cron job should be automatically configured.

### 1. Verify Cron Registration

1. Go to **Vercel Dashboard** → **Your Project**
2. Navigate to **Settings** → **Cron Jobs**
3. Should see:
   - **Path:** `/api/cron/cleanup-deleted-accounts`
   - **Schedule:** `0 2 * * *` (Daily at 2 AM UTC)
   - **Status:** ✅ Active

### 2. Test Cron Endpoint

**⚠️ Warning:** This will permanently delete eligible accounts!

```bash
# Get your CRON_SECRET from Vercel env vars
CRON_SECRET="your-secret-here"

# Test endpoint (with auth)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-app.vercel.app/api/cron/cleanup-deleted-accounts
```

**Expected Response:**

```json
{
  "success": true,
  "deletedCount": 0,
  "errors": [],
  "message": "No accounts eligible for deletion"
}
```

### 3. Monitor Cron Executions

1. Go to **Vercel Dashboard** → **Logs**
2. Filter by:
   - **Path:** `/api/cron/cleanup-deleted-accounts`
   - **Status:** 200 (success)
3. Check logs for execution results

### 4. Verify Admin Emails

After first cron run (2 AM UTC next day), admin should receive:

- **Subject:** `Account Deletion Summary: X account(s) deleted - DATE`
- Contains list of deleted accounts (if any)

---

## Domain Setup (Optional)

### 1. Add Custom Domain

1. Go to **Vercel Dashboard** → **Your Project**
2. Navigate to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain: `yourdomain.com`
5. Click **"Add"**

### 2. Configure DNS

Vercel will provide DNS records:

**Option A: Apex Domain (yourdomain.com)**

```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B: Subdomain (www.yourdomain.com)**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Add DNS Records

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

1. Add the DNS records provided by Vercel
2. Wait for DNS propagation (5 mins - 48 hours)
3. Vercel will auto-verify and issue SSL certificate

### 4. Update Environment Variables

After domain is active:

```env
NEXTAUTH_URL=https://yourdomain.com  # Update this!
```

Redeploy after updating.

### 5. Verify SSL Certificate

- Visit `https://yourdomain.com`
- Check for 🔒 lock icon in browser
- Certificate should be issued by Let's Encrypt (via Vercel)

---

## Post-Deployment Tasks

### 1. Update Resend Domain

If you added a custom domain:

- Verify your domain in Resend
- Update `FROM_EMAIL` environment variable
- Use: `noreply@yourdomain.com`

### 2. Set Up Monitoring (Recommended)

**Vercel Analytics (Built-in):**

- Already enabled automatically
- View in **Analytics** tab
- Tracks: Page views, unique visitors, top pages

**Sentry (Error Tracking):**

```bash
pnpm add @sentry/nextjs
```

Then configure in `apps/web/sentry.config.js`

**Uptime Monitoring:**

- Use services like:
  - **Better Uptime** (https://betteruptime.com)
  - **UptimeRobot** (https://uptimerobot.com)
  - **Pingdom** (https://pingdom.com)

### 4. Enable Web Analytics (Optional)

**Vercel Web Analytics:**

- Go to **Settings** → **Analytics**
- Enable **Web Analytics**
- Free tier: 2,500 events/month

**Or use Google Analytics:**

- Add GA4 tracking code
- Update `apps/web/app/layout.tsx`

---

## Monitoring & Logs

### Vercel Logs

**Access Logs:**

1. Go to **Vercel Dashboard** → **Deployments**
2. Click on deployment
3. Navigate to **Logs** tab

**Log Types:**

- **Build Logs** - Compilation output
- **Function Logs** - Server-side logs (console.log)
- **Edge Logs** - Middleware logs
- **Static Logs** - CDN access logs

**Filter Logs:**

- By path: `/api/auth/login`
- By status: 200, 404, 500
- By time range

### Upstash Console

**Monitor Redis:**

1. Go to https://console.upstash.com
2. Click on your database
3. **Metrics** tab shows:
   - Commands per second
   - Memory usage
   - Hit rate
4. **Data Browser** shows stored keys

### Neon Console

**Monitor Database:**

1. Go to https://console.neon.tech
2. Click on your project
3. **Monitoring** tab shows:
   - Connections
   - Queries per second
   - Storage usage
4. **SQL Editor** for running queries

### Resend Dashboard

**Monitor Emails:**

1. Go to https://resend.com/emails
2. View all sent emails
3. Check:
   - Delivery status
   - Bounce rate
   - Spam complaints

---

## Troubleshooting

### Build Fails

**Error:** `Type error: Cannot find module...`

**Solution:**

- Ensure all dependencies in `package.json`
- Run `pnpm install` locally first
- Check `turbo.json` for correct build order

---

**Error:** `DATABASE_URL is not defined`

**Solution:**

- Check environment variables are set in Vercel
- Ensure variable name matches exactly (case-sensitive)
- Redeploy after adding variables

---

### Runtime Errors

**Error:** `Failed to connect to database`

**Solution:**

1. Check `DATABASE_URL` is correct
2. Verify Neon database is active (not sleeping)
3. Check SSL mode: `?sslmode=require`
4. Test connection locally:
   ```bash
   psql "your-connection-string"
   ```

---

**Error:** `Redis credentials not found`

**Solution:**

1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
2. Check Upstash database is active
3. Test from local:
   ```bash
   curl -H "Authorization: Bearer TOKEN" https://your-redis.upstash.io/get/test
   ```

---

**Error:** `Failed to send email`

**Solution:**

1. Verify `RESEND_API_KEY` is correct
2. Check Resend domain is verified
3. Verify `FROM_EMAIL` uses verified domain
4. Check Resend dashboard for bounces/errors

---

### Cron Job Not Running

**Issue:** Admin emails not received

**Check:**

1. Verify cron is registered in **Settings** → **Cron Jobs**
2. Check `CRON_SECRET` is set correctly
3. View logs for cron executions
4. Test manually:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://your-app.vercel.app/api/cron/cleanup-deleted-accounts
   ```

---

### Performance Issues

**Issue:** Slow response times

**Solutions:**

1. **Enable Vercel Edge Caching:**
   - Add headers for static assets
   - Use `next/image` for images

2. **Database Connection Pooling:**
   - Use Neon connection pooler
   - Add `?pgbouncer=true` to connection string

3. **Optimize Queries:**
   - Add database indexes
   - Use `prisma.user.findUnique` instead of `findMany`
   - Enable Prisma query logging

4. **Upgrade Plans:**
   - Neon: Upgrade for more connections
   - Upstash: Upgrade for more memory
   - Vercel: Upgrade for better performance

---

## Deployment Checklist

Use this checklist before going live:

### Pre-Deployment

- ✅ All tests passing locally
- ✅ TypeScript errors resolved
- ✅ ESLint errors resolved
- ✅ Environment variables documented
- ✅ Database migrations tested

### Services Setup

- ✅ Neon database created
- ✅ Upstash Redis created
- ✅ Resend account with verified domain

### Vercel Configuration

- ✅ Project imported from GitHub
- ✅ Root directory set to `apps/web`
- ✅ All environment variables added
- ✅ NEXTAUTH_SECRET generated (32+ chars)
- ✅ CRON_SECRET generated (32+ chars)

### Post-Deployment

- ✅ Database migrations deployed
- ✅ Application accessible
- ✅ Authentication working
- ✅ Emails sending successfully
- ✅ Rate limiting working (Redis)
- ✅ Cron job registered
- ✅ Custom domain configured (if using)
- ✅ SSL certificate issued
- ✅ Monitoring enabled

### Testing

- ✅ Register new account
- ✅ Verify email
- ✅ Login/logout
- ✅ Password reset
- ✅ Profile updates
- ✅ Email change flow
- ✅ Account deletion
- ✅ Rate limiting
- ✅ Cron endpoint (manual test)

---

## Next Steps

After successful deployment:

1. **Monitor for 24-48 hours**
   - Check logs daily
   - Watch for errors
   - Monitor Upstash/Neon usage

2. **Set Up Alerts**
   - Vercel deployment failures
   - Uptime monitoring
   - Error rate alerts (Sentry)

3. **Document Your Setup**
   - Save all credentials securely (1Password, etc.)
   - Document any custom configurations
   - Share deployment URL with team

4. **Plan for Scale**
   - Monitor free tier limits
   - Upgrade when needed:
     - Neon: $19/month (paid plan)
     - Upstash: $10/month (more memory)
     - Resend: $20/month (50k emails)
     - Vercel: $20/month (Pro)

5. **Backup Strategy**
   - Enable Neon automatic backups
   - Export database regularly
   - Document restore procedure

---

## Support Resources

- **Vercel:** https://vercel.com/docs
- **Neon:** https://neon.tech/docs
- **Upstash:** https://docs.upstash.com
- **Resend:** https://resend.com/docs
- **Next.js:** https://nextjs.org/docs

---

## Summary

You now have a production-ready React Masters deployment on Vercel! 🎉

**What You've Accomplished:**

- ✅ Serverless PostgreSQL (Neon)
- ✅ Serverless Redis (Upstash)
- ✅ Email service (Resend)
- ✅ Automated deployments (Vercel + GitHub)
- ✅ Daily cron jobs (scheduled deletion)
- ✅ SSL certificates (automatic)
- ✅ CDN for static assets
- ✅ Environment-based configuration

**Your application is now:**

- 🚀 Live on the internet
- 🔒 Secure (HTTPS, auth, rate limiting)
- 📧 Sending emails
- ⚡ Fast (edge network, caching)
- 📊 Monitored (logs, analytics)
- 🔄 Auto-deploying (on git push)

Welcome to production! 🎊
