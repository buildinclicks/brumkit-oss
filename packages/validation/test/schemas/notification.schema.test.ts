import { describe, it, expect } from 'vitest';
import { markNotificationAsReadSchema } from '../../src/schemas/notification.schema';

describe('Notification Validation Schemas', () => {
  describe('markNotificationAsReadSchema', () => {
    it('should accept valid notification ID', () => {
      const result = markNotificationAsReadSchema.safeParse({
        id: 'clh1234567890abcdefghij',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid ID format', () => {
      const result = markNotificationAsReadSchema.safeParse({
        id: 'invalid-id',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing ID', () => {
      const result = markNotificationAsReadSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
