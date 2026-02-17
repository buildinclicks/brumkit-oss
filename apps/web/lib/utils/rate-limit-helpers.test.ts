import { describe, it, expect } from 'vitest';

import { getClientIp, formatRetryAfter } from './rate-limit-helpers';

describe('🔴 RED: Rate Limit Helpers', () => {
  describe('getClientIp', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const headers = new Map([
        ['x-forwarded-for', '203.0.113.1, 198.51.100.1'],
      ]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should extract IP from x-real-ip header', () => {
      const headers = new Map([['x-real-ip', '203.0.113.1']]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should extract IP from cf-connecting-ip header (Cloudflare)', () => {
      const headers = new Map([['cf-connecting-ip', '203.0.113.1']]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should extract IP from x-vercel-forwarded-for header', () => {
      const headers = new Map([['x-vercel-forwarded-for', '203.0.113.1']]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should prioritize x-forwarded-for over other headers', () => {
      const headers = new Map([
        ['x-forwarded-for', '203.0.113.1'],
        ['x-real-ip', '198.51.100.1'],
        ['cf-connecting-ip', '192.0.2.1'],
      ]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should handle x-forwarded-for with single IP', () => {
      const headers = new Map([['x-forwarded-for', '203.0.113.1']]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should trim whitespace from IP addresses', () => {
      const headers = new Map([
        ['x-forwarded-for', '  203.0.113.1  , 198.51.100.1  '],
      ]);

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('should return "unknown" if no IP headers present', () => {
      const headers = new Map();

      const ip = getClientIp(headers);

      expect(ip).toBe('unknown');
    });
  });

  describe('formatRetryAfter', () => {
    it('should format seconds (< 60)', () => {
      expect(formatRetryAfter(45)).toBe('45 seconds');
      expect(formatRetryAfter(30)).toBe('30 seconds');
      expect(formatRetryAfter(1)).toBe('1 second');
    });

    it('should format minutes (>= 60)', () => {
      expect(formatRetryAfter(60)).toBe('1 minute');
      expect(formatRetryAfter(120)).toBe('2 minutes');
      expect(formatRetryAfter(300)).toBe('5 minutes');
      expect(formatRetryAfter(900)).toBe('15 minutes');
    });

    it('should round up partial minutes', () => {
      expect(formatRetryAfter(61)).toBe('2 minutes');
      expect(formatRetryAfter(90)).toBe('2 minutes');
      expect(formatRetryAfter(119)).toBe('2 minutes');
    });

    it('should handle edge cases', () => {
      expect(formatRetryAfter(0)).toBe('0 seconds');
      expect(formatRetryAfter(59)).toBe('59 seconds');
      expect(formatRetryAfter(3600)).toBe('60 minutes');
    });

    it('should use singular form for 1 second', () => {
      expect(formatRetryAfter(1)).toBe('1 second');
    });

    it('should use singular form for 1 minute', () => {
      expect(formatRetryAfter(60)).toBe('1 minute');
    });

    it('should use plural form for multiple seconds', () => {
      expect(formatRetryAfter(2)).toBe('2 seconds');
      expect(formatRetryAfter(45)).toBe('45 seconds');
    });

    it('should use plural form for multiple minutes', () => {
      expect(formatRetryAfter(120)).toBe('2 minutes');
      expect(formatRetryAfter(900)).toBe('15 minutes');
    });
  });
});
