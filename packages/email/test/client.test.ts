import { describe, it, expect, beforeAll } from 'vitest';

// Mock environment variable for tests
beforeAll(() => {
  process.env.RESEND_API_KEY = 'test_api_key';
});

describe('Email Client', () => {
  it('should initialize email client', async () => {
    const { emailClient } = await import('../src/client.js');
    expect(emailClient).toBeDefined();
  });

  it('should have correct client type', async () => {
    const { emailClient, isResendClient } = await import('../src/client.js');
    expect(isResendClient(emailClient)).toBe(true);
  });

  it('should have emails property when using Resend', async () => {
    const { emailClient, isResendClient } = await import('../src/client.js');
    if (isResendClient(emailClient)) {
      expect(emailClient.emails).toBeDefined();
    }
  });
});
