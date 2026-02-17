# Vercel Deployment - Quick Reference

Quick reference for deploying React Masters to Vercel.

For detailed guide, see: [vercel-deployment-guide.md](./vercel-deployment-guide.md)

---

## 🚀 Quick Deploy (30 minutes)

### 1. Create Accounts (10 min)

- ✅ [Vercel](https://vercel.com/signup) - Free
- ✅ [Neon](https://neon.tech) - PostgreSQL, Free
- ✅ [Upstash](https://upstash.com) - Redis, Free
- ✅ [Resend](https://resend.com) - Email, Free

### 2. Get Connection Strings (10 min)

**Neon (Database):**

```
postgresql://user:pass@host/db?sslmode=require
```

**Upstash (Redis):**

```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=AXXXxxx
```

**Resend (Email):**

```
RESEND_API_KEY=re_xxxxx
```

### 3. Deploy to Vercel (10 min)

1. Import GitHub repo
2. Set root directory: `apps/web`
3. Add environment variables (see below)
4. Deploy!

---

## 📝 Environment Variables (Copy-Paste Template)

```env
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxx

# Auth.js
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[openssl rand -base64 32]

# Email (Resend)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Cron Security
CRON_SECRET=[openssl rand -base64 32]
```

---

## 🔑 Generate Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32
```

---

## 🗃️ Database Migrations

```bash
# Set production database URL
export DATABASE_URL="postgresql://..."

# Deploy migrations
cd packages/database
pnpm prisma migrate deploy
```

---

## ✅ Post-Deployment Checklist

- [ ] Application loads at https://your-app.vercel.app
- [ ] Can register new account
- [ ] Receive verification email
- [ ] Can login
- [ ] Can reset password
- [ ] Profile updates work
- [ ] Email change works
- [ ] Rate limiting works
- [ ] Cron job registered (Settings → Cron Jobs)
- [ ] Test cron endpoint manually

---

## 🧪 Test Cron Job

```bash
CRON_SECRET="your-secret"

curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-app.vercel.app/api/cron/cleanup-deleted-accounts
```

Expected: `{"success":true,"deletedCount":0,...}`

---

## 🌐 Custom Domain (Optional)

1. Vercel → Settings → Domains → Add
2. Add DNS records at your registrar
3. Update `NEXTAUTH_URL` to your domain

---

## 📊 Monitor

**Vercel:**

- Dashboard → Deployments → Logs
- Analytics tab

**Neon:**

- console.neon.tech → Monitoring

**Upstash:**

- console.upstash.com → Metrics

**Resend:**

- resend.com/emails

---

## 🐛 Common Issues

**Build fails:**

- Check environment variables are set
- Verify root directory is `apps/web`

**Database connection fails:**

- Ensure `?sslmode=require` in DATABASE_URL
- Check Neon database is active

**Emails not sending:**

- Verify domain in Resend
- Check RESEND_API_KEY is correct
- Use verified domain for FROM_EMAIL

**Rate limiting not working:**

- Check Upstash credentials
- Verify Redis database is active

---

## 🆘 Support

- Detailed Guide: [vercel-deployment-guide.md](./vercel-deployment-guide.md)
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Upstash Docs: https://docs.upstash.com
- Resend Docs: https://resend.com/docs

---

**Ready to deploy? Follow the detailed guide!**
