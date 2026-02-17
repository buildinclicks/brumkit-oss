# Upstash Redis Setup Guide

**Project**: React Masters  
**Purpose**: Redis-based rate limiting for password reset  
**Free Tier**: 10,000 requests/day (sufficient for MVP)

---

## 🎯 **Step 1: Create Upstash Account**

1. Go to https://upstash.com/
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - **GitHub** (recommended - fastest)
   - Or **Google**
   - Or **Email**

4. Verify your email if using email signup

---

## 🗄️ **Step 2: Create Redis Database**

1. After login, you'll see the Upstash Console
2. Click **"Create Database"** (green button)

3. **Configuration:**

   ```
   Name: react-masters-ratelimit
   Type: Regional (cheaper, sufficient for MVP)
   Region: Choose closest to your users
         (e.g., US East for US users, EU West for EU)
   Primary Region: Select your primary region
   Read Regions: None needed for now
   ```

4. Click **"Create"**

5. Wait ~30 seconds for provisioning ⏳

---

## 🔑 **Step 3: Get Credentials**

1. Click on your newly created database name
2. Scroll down to **"REST API"** section
3. You'll see two important values:

   ```
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   ```

4. Click **"Copy"** button next to each

---

## 📝 **Step 4: Add to Environment Variables**

### **Development (Local)**

1. Open `apps/web/.env.local` (create if doesn't exist)

2. Add these lines:

   ```env
   # Upstash Redis - Rate Limiting
   UPSTASH_REDIS_REST_URL="https://your-endpoint.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AXXXXxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

3. **Replace** with your actual values from Step 3

4. Save the file

5. **Restart your dev server** for variables to load:
   ```bash
   # Stop current server (Ctrl+C)
   cd apps/web
   pnpm dev
   ```

### **Production (Vercel/Netlify)**

#### **For Vercel:**

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name**: `UPSTASH_REDIS_REST_URL`
   - **Value**: (paste your URL)
   - **Environment**: Production, Preview, Development

4. Add second variable:
   - **Name**: `UPSTASH_REDIS_REST_TOKEN`
   - **Value**: (paste your token)
   - **Environment**: Production, Preview, Development

5. Click **Save**

6. **Redeploy** your app for changes to take effect

#### **For Netlify:**

1. Go to your site on Netlify
2. Click **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add both variables (same as Vercel)
5. Click **Save**
6. **Redeploy**

---

## ✅ **Step 5: Verify Setup**

Once I implement the code, you can verify it works:

1. Go to `http://localhost:3000/forgot-password`
2. Submit password reset **4 times** with same email
3. 4th attempt should show: "Too many requests. Try again in 5 minutes."

4. Check Upstash Console:
   - Go to your database
   - Click **Data Browser** tab
   - You should see keys like: `ratelimit:password-reset:user@example.com`

---

## 📊 **Free Tier Limits**

```
Daily Requests: 10,000
Max DB Size: 256 MB
Max Request Size: 1 MB
Max Connections: 1,000

This is more than enough for:
- Development
- Testing
- MVP with ~1000 users
```

---

## 💰 **Pricing (When You Scale)**

```
Pay-as-you-go:
- $0.20 per 100,000 requests
- $0.25 per GB storage

Example:
- 1 million requests/month = $2.00
- 10 million requests/month = $20.00
```

Much cheaper than maintaining your own Redis server!

---

## 🔒 **Security Best Practices**

1. ✅ **Never commit** `.env.local` to git (already in `.gitignore`)
2. ✅ **Rotate tokens** if accidentally exposed
3. ✅ **Use separate databases** for development/production (optional)
4. ✅ **Enable IP allowlist** in Upstash (optional, for extra security)

---

## 🔍 **Monitoring**

In Upstash Console, you can monitor:

1. **Metrics** tab:
   - Request count
   - Latency
   - Error rate

2. **Data Browser** tab:
   - See all keys
   - Inspect values
   - Manual cleanup if needed

3. **Logs** tab:
   - View request logs
   - Debug issues

---

## 🐛 **Troubleshooting**

### **Issue: "UPSTASH_REDIS_REST_URL is not defined"**

**Solution:**

1. Check `.env.local` exists in `apps/web/`
2. Check variable names are exact (case-sensitive)
3. Restart dev server
4. Try `pnpm clean` and reinstall

### **Issue: "Unauthorized" or "Invalid token"**

**Solution:**

1. Verify token is copied correctly (no spaces)
2. Regenerate token in Upstash Console
3. Update `.env.local` with new token

### **Issue: "Network error" or "Connection timeout"**

**Solution:**

1. Check your internet connection
2. Verify Upstash service status: https://status.upstash.com/
3. Try different region when creating database

### **Issue: Rate limit not working**

**Solution:**

1. Check console logs for errors
2. Verify environment variables are loaded
3. Check Upstash console metrics
4. Clear Redis keys in Data Browser

---

## 📚 **Resources**

- **Upstash Docs**: https://docs.upstash.com/
- **Redis REST API**: https://docs.upstash.com/redis/features/restapi
- **Status Page**: https://status.upstash.com/
- **Support**: support@upstash.com

---

## ⏭️ **Next Steps**

After setup:

1. ✅ I'll implement the rate limiting package
2. ✅ Write comprehensive tests
3. ✅ Integrate with password reset
4. ✅ You test it works
5. ✅ Deploy to production

---

**Estimated Setup Time**: 10-15 minutes

Once you complete this setup, let me know and I'll proceed with the implementation! 🚀
