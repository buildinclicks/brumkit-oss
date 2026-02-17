import crypto from 'crypto';

import { db } from '@repo/database';

/**
 * Generate a random token for magic links or email verification
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a magic link token with expiration and store in database
 */
export async function generateMagicLinkToken(email: string): Promise<string> {
  const token = generateToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hour expiration

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verify a magic link token and return the email if valid
 */
export async function verifyMagicLinkToken(
  token: string
): Promise<string | null> {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return null;
  }

  // Delete the token after verification
  await db.verificationToken.delete({
    where: { token },
  });

  return verificationToken.identifier;
}

/**
 * Verify a token is not expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate a secure random string for CSRF tokens, etc.
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}
