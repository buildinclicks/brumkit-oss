# Email Setup Guide - Password Reset

## Issue

Password reset emails are not being sent when users submit the forgot password form.

## Root Cause

The Resend API requires configuration with an API key, which may not be set up in your development environment.

---

## Quick Fix (For Testing)

If you want to test the password reset flow WITHOUT setting up email:

### Option 1: Check Console Logs (Development Only)

The code will catch email sending errors gracefully. Check your **server console** (not browser) for the reset link:

```
Failed to send password reset email: Error: RESEND_API_KEY is not defined
```

However, since the error is caught, you won't see the token in production-safe code.

### Option 2: Temporary Development Mode

For development testing, you can temporarily modify `apps/web/app/actions/auth.ts` to log the token:

```typescript
// Generate reset token
const token = await generateMagicLinkToken(email);

// Temporary: Log for development
if (process.env.NODE_ENV === 'development') {
  console.log(
    `🔐 Password reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  );
}

// Send password reset email
try {
  const { sendPasswordResetEmail } = await import('@repo/email');
  await sendPasswordResetEmail({
    to: user.email,
    name: user.name || 'there',
    token,
  });
} catch (emailError) {
  console.error('Failed to send password reset email:', emailError);
}
```

Then you can copy the link from your terminal and test the reset flow.

---

## Proper Setup (Production-Ready)

### Important: Resend Free Tier Limitation ⚠️

**On the free tier without a verified domain, you can ONLY send emails to the email address you signed up with.**

For example, if you signed up with `your-email@gmail.com`, you can only test password reset with that email address. To send to any email address, you must verify a domain (see Step 4 below).

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email

**Free Tier Includes:**

- 100 emails/day
- 3,000 emails/month
- Perfect for development and small projects

### Step 2: Get Your API Key

1. Login to [Resend Dashboard](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it (e.g., "React Masters Dev")
4. Copy the API key (starts with `re_`)

### Step 3: Configure Environment Variables

Create or update `apps/web/.env.local`:

```env
# Resend Email Configuration
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"

# For development/testing, use Resend's test domain
FROM_EMAIL="onboarding@resend.dev"

# Or use your own verified domain (recommended for production)
# FROM_EMAIL="noreply@yourdomain.com"

# Your app URL (used in email links)
NEXTAUTH_URL="http://localhost:3000"
```

**Important Note:** With the free tier and no verified domain, you can ONLY send test emails to the email address you registered with Resend. If you try to send to other addresses, you'll see this error:

```
validation_error: You can only send testing emails to your own email address
```

To send to any email address, you must verify a domain (see "Using Your Own Domain" section below).

### Step 4: Restart Your Development Server

```bash
cd apps/web
pnpm dev
```

The server needs to restart to pick up the new environment variables.

### Step 5: Test the Password Reset Flow

1. Go to `http://localhost:3000/forgot-password`
2. Enter a valid email address (user must exist in database)
3. Submit the form
4. Check your email inbox (or spam folder)
5. Click the reset link
6. Set a new password

---

## Using Your Own Domain (Production)

For production use, you should verify your own domain:

### Step 1: Add Domain to Resend

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)

### Step 2: Add DNS Records

Resend will provide DNS records. Add these to your domain provider:

**Required Records:**

- **SPF** (TXT record) - Prevents email spoofing
- **DKIM** (TXT record) - Email authentication
- **DMARC** (TXT record) - Email policy

Example:

```
Type: TXT
Name: @
Value: v=spf1 include:spf.resend.com ~all
```

### Step 3: Verify Domain

1. Wait for DNS propagation (usually 5-30 minutes)
2. Click "Verify" in Resend dashboard
3. Once verified, update `.env.local`:

```env
FROM_EMAIL="noreply@yourdomain.com"
```

---

## Email Templates

The password reset email uses a beautiful React Email template located at:

```
packages/email/src/templates/password-reset-email.tsx
```

**Features:**

- ✅ Professional design
- ✅ Mobile-responsive
- ✅ Security warnings
- ✅ Clear call-to-action button
- ✅ Fallback link for accessibility

### Preview Email Templates

To preview emails during development:

```bash
cd packages/email
npx react-email dev
```

This opens a preview server at `http://localhost:3000` where you can see all templates.

---

## Security Features

### 1. Email Enumeration Prevention

The system always returns success, even if the email doesn't exist:

```typescript
// Always return success to prevent email enumeration
if (!user) {
  return {
    success: true,
    data: {
      message: 'If that email exists, we sent a reset link',
    },
  };
}
```

This prevents attackers from discovering which emails are registered.

### 2. Token Expiration

Reset tokens expire after **1 hour** for security:

```typescript
// Token is generated with 1 hour expiry
const token = await generateMagicLinkToken(email);
```

### 3. One-Time Use Tokens

Tokens are stored in the database and invalidated after use, preventing reuse.

### 4. Error Handling

Email errors are caught gracefully and don't reveal system information:

```typescript
try {
  await sendPasswordResetEmail({...});
} catch (emailError) {
  console.error('Failed to send password reset email:', emailError);
  // Still return success to prevent enumeration
}
```

---

## Troubleshooting

### Error: "You can only send testing emails to your own email address"

**Cause:** Resend free tier without verified domain

**Solution (Choose one):**

**Option A - Quick Testing:**
Only test with the email you used to sign up for Resend:

1. Create a test user with that email in your database
2. Use that email address in the forgot password form
3. Check your inbox - you'll receive the email!

**Option B - Production Solution:**
Verify a domain (see "Using Your Own Domain" section above)

### Error: "RESEND_API_KEY is not defined"

**Cause:** Environment variable not set

**Solution:**

1. Check `apps/web/.env.local` exists
2. Verify `RESEND_API_KEY` is set correctly
3. Restart your dev server (`pnpm dev`)

### Emails Going to Spam

**Solutions:**

- Use `onboarding@resend.dev` for testing (won't go to spam)
- Verify your domain with Resend for production
- Set up SPF, DKIM, and DMARC records
- Use a consistent "from" address

### Not Receiving Emails

**Check:**

1. ✅ Spam/Junk folder
2. ✅ Email exists in database (run: `SELECT * FROM "User" WHERE email='test@example.com'`)
3. ✅ Server console for error messages
4. ✅ Resend dashboard for delivery logs

### Token Expired Error

**Cause:** Reset link was clicked after 1 hour

**Solution:** Request a new password reset link

---

## Monitoring in Production

### Check Email Delivery

Login to [Resend Dashboard](https://resend.com/emails) to see:

- Email delivery status
- Bounce rates
- Open rates (if tracking enabled)
- Click rates

### Error Logging

The application logs email errors:

```typescript
console.error('Failed to send password reset email:', emailError);
```

In production, consider sending these to a monitoring service like:

- Sentry
- LogRocket
- Datadog

---

## Testing Checklist

- [ ] Environment variables configured
- [ ] Development server restarted
- [ ] Test user exists in database
- [ ] Submit forgot password form
- [ ] Email received (check spam)
- [ ] Reset link works
- [ ] Password successfully changed
- [ ] Can login with new password
- [ ] Old password no longer works

---

## Next Steps

Once email is working, consider implementing:

1. **Rate Limiting** - Prevent abuse of password reset

   ```typescript
   // Limit to 3 reset requests per hour per email
   ```

2. **Email Queue** - For high-volume applications

   ```typescript
   // Use BullMQ or similar
   ```

3. **Email Analytics** - Track open/click rates

4. **Custom Email Domain** - Increase deliverability

5. **Email Preferences** - Let users control notifications

---

## Files Modified

| File                                                    | Purpose                       |
| ------------------------------------------------------- | ----------------------------- |
| `packages/email/src/templates/password-reset-email.tsx` | New React Email template      |
| `packages/email/src/index.ts`                           | Updated to use React template |
| `apps/web/app/actions/auth.ts`                          | Integrated email sending      |

---

## Support

- **Resend Docs**: https://resend.com/docs
- **React Email Docs**: https://react.email/docs
- **Email Package README**: `packages/email/README.md`

---

**Status**: ✅ Implementation Complete  
**Date**: 2026-01-13  
**Next Task**: Configure `RESEND_API_KEY` in your environment
