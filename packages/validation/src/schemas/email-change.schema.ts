import { z } from 'zod';
import { ValidationMessages } from '../messages';
import { emailRule } from '../rules/email.rules';
import { passwordRule } from '../rules/password.rules';

// ============================================
// REQUEST EMAIL CHANGE
// ============================================

export const requestEmailChangeSchema = z.object({
  newEmail: emailRule.required,
  password: passwordRule.required,
});

export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;

// ============================================
// VERIFY EMAIL CHANGE
// ============================================

export const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, ValidationMessages.REQUIRED),
});

export type VerifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;
