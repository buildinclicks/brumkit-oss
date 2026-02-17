import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Determine which email service to use
const isDevelopment = process.env.NODE_ENV === 'development';
const useMailhog =
  isDevelopment &&
  process.env.USE_MAILHOG !== 'false' &&
  !process.env.RESEND_API_KEY;

// Email client types
type EmailClient = Resend | Transporter;

// Create appropriate email client
export const createEmailClient = (): EmailClient => {
  if (useMailhog) {
    // Use Mailhog for local development
    console.log('📧 Using Mailhog for email (http://localhost:8025)');
    return nodemailer.createTransport({
      host: process.env.MAILHOG_HOST || 'localhost',
      port: Number(process.env.MAILHOG_PORT) || 1025,
      secure: false, // Mailhog doesn't use TLS
      ignoreTLS: true,
    });
  } else {
    // Use Resend for production or if explicitly configured
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        'RESEND_API_KEY is not defined. Either:\n' +
          '1. Set RESEND_API_KEY for production\n' +
          '2. Use Mailhog for development (Docker required)'
      );
    }
    console.log('☁️  Using Resend for email');
    return new Resend(process.env.RESEND_API_KEY);
  }
};

// Export client
export const emailClient = createEmailClient();

// Type guard to check if client is Resend
export const isResendClient = (client: EmailClient): client is Resend => {
  return 'emails' in client && typeof client.emails === 'object';
};

// Type guard to check if client is Nodemailer
export const isNodemailerClient = (
  client: EmailClient
): client is Transporter => {
  return 'sendMail' in client && typeof client.sendMail === 'function';
};

// Helper function to get email service info
export const getEmailServiceInfo = () => {
  return {
    service: useMailhog ? 'mailhog' : 'resend',
    isDevelopment,
    mailhogUI: useMailhog ? 'http://localhost:8025' : null,
  };
};
