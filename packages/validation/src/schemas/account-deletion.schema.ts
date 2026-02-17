import { z } from 'zod';
import { passwordRule } from '../rules/password.rules';

/**
 * Schema for account deletion request
 * Requires password confirmation for security
 */
export const deleteAccountSchema = z.object({
  password: passwordRule.required,
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
