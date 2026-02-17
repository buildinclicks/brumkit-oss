import { render } from '@react-email/components';
import { emailClient, isResendClient, isNodemailerClient } from './client';
import { VerificationEmail } from './templates/verification-email';
import { WelcomeEmail } from './templates/welcome-email';
import { PasswordResetEmail } from './templates/password-reset-email';
import { PasswordChangedEmail } from './templates/password-changed-email';
import { EmailChangeVerification } from './templates/email-change-verification';
import { EmailChangeNotification } from './templates/email-change-notification';
import { AccountDeletionNotificationEmail } from './templates/account-deletion-notification';
import { AccountDeletionFinalEmail } from './templates/account-deletion-final';
import { AdminDeletionSummaryEmail } from './templates/admin-deletion-summary';

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Universal email sender that works with both Resend and Mailhog
 */
async function sendEmail({
  to,
  subject,
  react,
  from = `React Masters <${FROM_EMAIL}>`,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}) {
  try {
    if (isResendClient(emailClient)) {
      // Use Resend API
      const { data, error } = await emailClient.emails.send({
        from,
        to,
        subject,
        react,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send email');
      }

      return { success: true, data };
    } else if (isNodemailerClient(emailClient)) {
      // Use Nodemailer (Mailhog)
      const html = await render(react);
      const text = await render(react, { plainText: true });

      const info = await emailClient.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });

      return { success: true, data: { id: info.messageId } };
    } else {
      throw new Error('Unknown email client');
    }
  } catch (error) {
    console.error(`Error sending email "${subject}":`, error);
    throw error;
  }
}

/**
 * Send email verification link to user
 */
export async function sendVerificationEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) {
  const verificationLink = `${APP_URL}/verify-email?token=${token}`;

  try {
    return await sendEmail({
      to,
      subject: 'Verify your email address',
      react: VerificationEmail({ name, verificationLink }),
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const dashboardLink = `${APP_URL}/dashboard`;

  try {
    return await sendEmail({
      to,
      subject: 'Welcome to React Masters!',
      react: WelcomeEmail({ name, dashboardLink }),
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send password changed notification email
 */
export async function sendPasswordChangedEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const loginLink = `${APP_URL}/login`;

  try {
    return await sendEmail({
      to,
      subject: 'Your password has been changed - React Masters',
      react: PasswordChangedEmail({ name, loginLink }),
    });
  } catch (error) {
    console.error('Error sending password changed email:', error);

    // Check if it's a domain verification error (Resend)
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  try {
    return await sendEmail({
      to,
      subject: 'Reset your password - React Masters',
      react: PasswordResetEmail({ name, resetLink }),
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

/**
 * Send email change verification link to new email address
 */
export async function sendEmailChangeVerification({
  email,
  token,
  userName,
}: {
  email: string;
  token: string;
  userName: string;
}) {
  const verificationLink = `${APP_URL}/verify-email-change?token=${token}`;

  try {
    return await sendEmail({
      to: email,
      subject: 'Verify your new email address - React Masters',
      react: EmailChangeVerification({ name: userName, verificationLink }),
    });
  } catch (error) {
    console.error('Error sending email change verification:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

/**
 * Send email change notification to old email address
 */
export async function sendEmailChangeNotification({
  email,
  userName,
  newEmail,
}: {
  email: string;
  userName: string;
  newEmail: string;
}) {
  try {
    return await sendEmail({
      to: email,
      subject: 'Security notification: Email change requested - React Masters',
      react: EmailChangeNotification({ name: userName, newEmail }),
    });
  } catch (error) {
    console.error('Error sending email change notification:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

/**
 * Send account deletion notification email
 */
export async function sendAccountDeletionNotification({
  email,
  userName,
}: {
  email: string;
  userName: string;
}) {
  try {
    return await sendEmail({
      to: email,
      subject: 'Your account has been scheduled for deletion - React Masters',
      react: AccountDeletionNotificationEmail({ userName }),
    });
  } catch (error) {
    console.error('Error sending account deletion notification:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

/**
 * Send final account deletion email to user
 */
export async function sendAccountDeletionFinalEmail({
  email,
  userName,
}: {
  email: string;
  userName: string;
}) {
  try {
    return await sendEmail({
      to: email,
      subject: 'Your account has been permanently deleted - React Masters',
      react: AccountDeletionFinalEmail({ userName }),
    });
  } catch (error) {
    console.error('Error sending account deletion final email:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}

/**
 * Send admin summary email for deleted accounts
 */
export async function sendAdminDeletionSummary({
  deletedCount,
  date,
  deletedUsers,
}: {
  deletedCount: number;
  date: string;
  deletedUsers: Array<{
    id: string;
    email: string;
    deletedAt: string;
  }>;
}) {
  try {
    return await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Account Deletion Summary: ${deletedCount} account(s) deleted - ${date}`,
      react: AdminDeletionSummaryEmail({ deletedCount, date, deletedUsers }),
    });
  } catch (error) {
    console.error('Error sending admin deletion summary:', error);

    // Check if it's a domain verification error
    if (
      error instanceof Error &&
      (error.message?.includes('verify a domain') ||
        error.message?.includes('validation_error'))
    ) {
      console.warn(
        '⚠️  Resend domain not verified. You can only send emails to your registered email address.'
      );
      console.warn(
        '📧 To send to all addresses, verify a domain at: https://resend.com/domains'
      );
    }

    return { success: false, error };
  }
}
