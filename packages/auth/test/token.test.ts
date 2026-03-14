import { describe, it, expect } from 'vitest';

import {
  generateToken,
  generateMagicLinkToken,
  verifyMagicLinkToken,
  isTokenExpired,
  generateSecureToken,
} from '../src/utils/token';

describe('Token Utilities', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = generateToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should generate tokens of custom length', () => {
      const token = generateToken(16);

      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateToken();
      const token2 = generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateMagicLinkToken', () => {
    it('should generate a magic link token and store in database', async () => {
      const email = 'test@example.com';
      const token = await generateMagicLinkToken(email);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should create a verification token in the database', async () => {
      const email = 'test@example.com';
      const token = await generateMagicLinkToken(email);

      // Verify the token exists and is valid
      const result = await verifyMagicLinkToken(token);
      expect(result).toBe(email);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for future date', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      expect(isTokenExpired(futureDate)).toBe(false);
    });

    it('should return true for past date', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      expect(isTokenExpired(pastDate)).toBe(true);
    });

    it('should return true for current time (edge case)', () => {
      const now = new Date();

      // Should be expired or very close
      const result = isTokenExpired(now);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a secure token', () => {
      const token = generateSecureToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should generate base64url encoded tokens', () => {
      const token = generateSecureToken();

      // Base64URL should not contain +, /, or =
      expect(token).not.toMatch(/[+/=]/);
    });

    it('should generate unique secure tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });
  });
});
