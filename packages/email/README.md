# `@repo/email`

Email service package for React Masters using Resend and React Email.

## Features

- ✅ **Resend Integration** - Modern email API
- ✅ **React Email Templates** - Beautiful, responsive emails
- ✅ **TypeScript** - Full type safety
- ✅ **Email Templates:**
  - Verification email
  - Welcome email
  - Password reset email
  - Password changed notification

## Installation

This is an internal workspace package. It's automatically available to other packages in the monorepo.

## Usage

### Send Verification Email

```typescript
import { sendVerificationEmail } from '@repo/email';

await sendVerificationEmail({
  to: 'user@example.com',
  name: 'John Doe',
  token: 'verification-token-123',
});
```

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '@repo/email';

await sendWelcomeEmail({
  to: 'user@example.com',
  name: 'John Doe',
});
```

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from '@repo/email';

await sendPasswordResetEmail({
  to: 'user@example.com',
  name: 'John Doe',
  token: 'reset-token-123',
});
```

### Send Password Changed Notification

```typescript
import { sendPasswordChangedEmail } from '@repo/email';

await sendPasswordChangedEmail({
  to: 'user@example.com',
  name: 'John Doe',
});
```

## Environment Variables

Required environment variables:

```env
RESEND_API_KEY=re_xxxxx          # Get from https://resend.com
FROM_EMAIL=noreply@yourdomain.com # Verified domain email
NEXTAUTH_URL=http://localhost:3000 # Your app URL
```

## Development

### Preview Emails Locally

You can preview emails in development using React Email's preview server:

```bash
cd packages/email
npx react-email dev
```

This will start a preview server at `http://localhost:3000` where you can see all your email templates.

## Adding New Templates

1. Create a new template in `src/templates/`:

```tsx
// src/templates/my-email.tsx
import { Html, Body, Container, Text } from '@react-email/components';

export function MyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Hello {name}!</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

2. Add sender function in `src/index.ts`:

```typescript
export async function sendMyEmail({ to, name }: { to: string; name: string }) {
  const { data, error } = await resend.emails.send({
    from: `React Masters <${FROM_EMAIL}>`,
    to,
    subject: 'My Subject',
    react: MyEmail({ name }),
  });

  if (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }

  return { success: true, data };
}
```

## Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use `onboarding@resend.dev` for testing)
3. Get your API key
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com
```

### Free Tier Limits

- 100 emails/day
- 3,000 emails/month
- Perfect for development and small projects

## Testing

Email sending is logged in development. Check your console for:

```
Email sent successfully: { id: 'xxx', ... }
```

## Production Considerations

- Use a verified domain with Resend
- Set up SPF, DKIM, and DMARC records
- Monitor email deliverability
- Implement email queue for high volume
- Add retry logic for failed sends

## Troubleshooting

### Emails going to spam

- Verify your domain with Resend
- Set up proper DNS records
- Use a consistent "from" address
- Avoid spam trigger words

### API Key errors

- Check `RESEND_API_KEY` is set correctly
- Verify API key is active in Resend dashboard
- Check for typos in environment variable name

## Links

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
