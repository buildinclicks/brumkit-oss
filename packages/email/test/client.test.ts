import { describe, it, expect, beforeAll } from 'vitest';

// Mock environment variable for tests
beforeAll(() => {
  process.env.RESEND_API_KEY = 'test_api_key';
  process.env.NODE_ENV = 'production';
});

describe('Email Client', () => {
  it('should initialize email client', async () => {
    const { getEmailClient } = await import('../src/client.js');
    const client = getEmailClient();
    expect(client).toBeDefined();
  });

  it('should have correct client type', async () => {
    const { getEmailClient, isResendClient } = await import('../src/client.js');
    const client = getEmailClient();
    expect(isResendClient(client)).toBe(true);
  });

  it('should have emails property when using Resend', async () => {
    const { getEmailClient, isResendClient } = await import('../src/client.js');
    const client = getEmailClient();
    if (isResendClient(client)) {
      expect(client.emails).toBeDefined();
    }
  });

  it('should work with emailClient proxy', async () => {
    const { emailClient } = await import('../src/client.js');
    // Access a property to trigger the proxy - should not throw
    expect(emailClient.emails).toBeDefined();
  });
});
