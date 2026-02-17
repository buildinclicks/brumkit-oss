import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from '../src/utils/password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(50); // Bcrypt hashes are ~60 chars
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Due to random salt
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'TestPassword123';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword(password, hashed);

      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'TestPassword123';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword('WrongPassword123', hashed);

      expect(isValid).toBe(false);
    });

    it('should reject empty password', async () => {
      const password = 'TestPassword123';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword('', hashed);

      expect(isValid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept a strong password', () => {
      const result = validatePasswordStrength('StrongPass123');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password too short', () => {
      const result = validatePasswordStrength('Short1');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must be at least 8 characters long'
      );
    });

    it('should reject password too long', () => {
      const result = validatePasswordStrength('A'.repeat(129) + '1a');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must be less than 128 characters'
      );
    });

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('lowercase123');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one uppercase letter'
      );
    });

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('UPPERCASE123');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one lowercase letter'
      );
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('NoNumbersHere');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one number'
      );
    });

    it('should return multiple errors for weak password', () => {
      const result = validatePasswordStrength('weak');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
