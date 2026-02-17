# Deployment Checklist

Use this checklist when deploying BrumKit v0.1.0 to production.

**Requirements:**

- Node.js >= 20.19.0
- pnpm >= 10.0.0
- PostgreSQL database
- Redis (local or Upstash)
- SMTP server for emails

---

## 📋 Pre-Deployment

### Code Quality

- [ ] All tests passing (`pnpm test`)
- [ ] Test coverage ≥80% (`pnpm test:coverage`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No ESLint errors (ESLint 10) (`pnpm lint`)
- [ ] Code formatted (`pnpm format:check`)
- [ ] Code committed and pushed to main branch
- [ ] Build works locally (`pnpm build`)

### Database (Prisma 6.19.2)

- [ ] All migrations tested locally
- [ ] Seed data created (if needed)
- [ ] Database schema exported (`prisma db pull`)
- [ ] Migration files committed to git
- [ ] Prisma Client generated (`cd packages/database && pnpm db:generate`)

### Documentation

- [ ] Environment variables documented in README
- [ ] Deployment guide reviewed
- [ ] CHANGELOG.md updated
- [ ] Release notes reviewed
- [ ] API endpoints documented (if applicable)
- [ ] Background jobs documented (if applicable)

---

## 🔧 Services Setup

### Neon (PostgreSQL)

- [ ] Account created
- [ ] Database project created
- [ ] Region selected (close to users)
- [ ] Connection string copied
- [ ] Connection tested (`psql "connection-string"`)

### Upstash (Redis)

- [ ] Account created
- [ ] Redis database created
- [ ] Region matches Neon region
- [ ] REST API credentials copied
- [ ] Eviction policy set to `allkeys-lru`

### Resend (Email)

- [ ] Account created
- [ ] API key generated
- [ ] Domain added
- [ ] DNS records configured
- [ ] Domain verified
- [ ] Test email sent successfully

---

## 🚀 Vercel Setup

### Project Import

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported to Vercel
- [ ] Root directory set to `apps/web`
- [ ] Build settings configured

### Environment Variables (Production)

**Required:**

- [ ] `DATABASE_URL` - Neon connection string
- [ ] `UPSTASH_REDIS_REST_URL` - Upstash URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Upstash token
- [ ] `NEXTAUTH_URL` - Vercel deployment URL
- [ ] `NEXTAUTH_SECRET` - Generated (32+ chars)
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `FROM_EMAIL` - Verified sender email
- [ ] `ADMIN_EMAIL` - Admin notification email
- [ ] `CRON_SECRET` - Generated (32+ chars)

### Deployment

- [ ] Initial deployment triggered
- [ ] Build logs checked for errors
- [ ] Deployment status is "Ready" ✅

---

## 🗃️ Database Migrations

- [ ] Production DATABASE_URL set locally
- [ ] `prisma migrate deploy` executed
- [ ] Migrations applied successfully
- [ ] Database schema verified
- [ ] No pending migrations

**Command:**

```bash
export DATABASE_URL="postgresql://..."
cd packages/database
pnpm prisma migrate deploy
```

---

## ✅ Verification Tests

### Basic Functionality

- [ ] Home page loads
- [ ] No console errors
- [ ] No 404/500 errors
- [ ] SSL certificate active (🔒)

### Authentication

- [ ] Register page works
- [ ] Verification email received
- [ ] Email verification link works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes require auth

### Password Management

- [ ] Forgot password flow works
- [ ] Reset email received
- [ ] Password reset link works
- [ ] Can login with new password
- [ ] Change password works
- [ ] Password change email received

### Profile Features

- [ ] Profile page loads
- [ ] Can update profile info
- [ ] Changes persist after refresh
- [ ] Profile validation works
- [ ] Can upload profile image (if implemented)

### Email Features

- [ ] Email change request works
- [ ] Verification email to new address
- [ ] Notification to old address
- [ ] Email change completes successfully
- [ ] All emails have correct styling

### Security Features

- [ ] Rate limiting works (try rapid requests)
- [ ] Redis connection active (check Upstash console)
- [ ] CSRF protection active
- [ ] Sessions expire correctly
- [ ] Logout invalidates session

### Account Deletion

- [ ] Delete account form works
- [ ] Password confirmation required
- [ ] Confirmation checkbox required
- [ ] Deletion email received
- [ ] Account marked as deleted
- [ ] Cannot login with deleted account

---

## ⏰ Cron Job Setup

### Registration

- [ ] Cron job appears in Vercel dashboard
- [ ] Path: `/api/cron/cleanup-deleted-accounts`
- [ ] Schedule: `0 2 * * *` (Daily 2 AM UTC)
- [ ] Status: Active

### Testing

- [ ] Manual cron test successful
- [ ] Proper authorization (CRON_SECRET works)
- [ ] Response is valid JSON
- [ ] Logs show execution

**Test Command:**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-app.vercel.app/api/cron/cleanup-deleted-accounts
```

**Expected Response:**

```json
{ "success": true, "deletedCount": 0, "errors": [], "message": "..." }
```

### Monitoring

- [ ] Cron executions visible in logs
- [ ] Admin email received (after first run with deletions)
- [ ] No errors in cron logs

---

## 🌐 Domain Setup (Optional)

### Domain Configuration

- [ ] Custom domain added in Vercel
- [ ] DNS records configured
- [ ] DNS propagated (can take 24-48 hours)
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued

### Updates After Domain

- [ ] `NEXTAUTH_URL` updated to custom domain
- [ ] Redeployed application
- [ ] Resend domain verified (if different)
- [ ] `FROM_EMAIL` updated to custom domain

---

## 📊 Monitoring Setup

### Vercel

- [ ] Analytics enabled
- [ ] Deployment notifications configured
- [ ] Log retention understood

### External Services

- [ ] Neon monitoring checked
- [ ] Upstash metrics reviewed
- [ ] Resend dashboard checked

### Optional

- [ ] Sentry error tracking configured
- [ ] Uptime monitoring set up (Better Uptime, etc.)
- [ ] Performance monitoring configured
- [ ] Google Analytics added (if desired)

---

## 📝 Documentation

### Team Documentation

- [ ] Deployment URL shared with team
- [ ] Admin credentials documented
- [ ] Environment variables documented
- [ ] Cron schedule documented
- [ ] Monitoring dashboards shared

### Credentials Storage

- [ ] All API keys stored securely (1Password, etc.)
- [ ] Connection strings backed up
- [ ] Emergency access documented

---

## 🔄 Post-Deployment

### First 24 Hours

- [ ] Monitor logs every few hours
- [ ] Check for errors
- [ ] Verify email delivery
- [ ] Monitor database connections
- [ ] Check Redis usage

### First Week

- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Monitor error rates
- [ ] Verify cron job executions
- [ ] Check service limits (Neon, Upstash, Resend)

### Ongoing

- [ ] Weekly log review
- [ ] Monthly analytics review
- [ ] Quarterly security review
- [ ] Monitor free tier limits
- [ ] Plan upgrades if needed

---

## 🎯 Success Criteria

All of the following should be true:

- ✅ Application is live and accessible
- ✅ Users can register and login
- ✅ Emails are being sent
- ✅ Rate limiting is working
- ✅ Database is connected and responding
- ✅ Redis is connected and caching
- ✅ Cron jobs are registered and running
- ✅ No critical errors in logs
- ✅ SSL certificate is active
- ✅ All core features tested and working

---

## 🆘 If Something Goes Wrong

### Deployment Fails

1. Check build logs in Vercel
2. Verify all environment variables
3. Test build locally: `pnpm turbo build`
4. Check for TypeScript/ESLint errors

### Runtime Errors

1. Check Vercel function logs
2. Verify database connection
3. Check Redis connection
4. Verify API keys are correct
5. Test each service independently

### Can't Access Application

1. Check deployment status (should be "Ready")
2. Verify DNS (if custom domain)
3. Check for SSL certificate issues
4. Try incognito/private browsing
5. Clear browser cache

### Need Help

- Detailed troubleshooting: [vercel-deployment-guide.md](./vercel-deployment-guide.md#troubleshooting)
- Vercel Support: https://vercel.com/help
- Check service status pages:
  - Vercel: https://www.vercel-status.com
  - Neon: https://neonstatus.com
  - Upstash: https://status.upstash.com
  - Resend: https://status.resend.com

---

## ✨ Congratulations!

If you've checked all boxes, your React Masters application is successfully deployed to production! 🎉

**Next Steps:**

1. Monitor for 24-48 hours
2. Share with users/team
3. Plan for scale
4. Set up regular backups
5. Document any custom configurations

**You did it!** 🚀
