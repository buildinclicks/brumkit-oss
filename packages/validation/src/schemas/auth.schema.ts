import { z } from 'zod';
import { emailRule } from '../rules/email.rules';
import { passwordSchema } from '../rules/password.rules';
import { ValidationMessages } from '../messages';

// ============================================
// LOGIN
// ============================================

export const loginSchema = z.object({
  email: emailRule.required,
  password: z.string().min(1, ValidationMessages.PASSWORD_REQUIRED),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// REGISTER
// ============================================

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, ValidationMessages.USER_NAME_REQUIRED)
      .max(255, ValidationMessages.USER_NAME_TOO_LONG),
    email: emailRule.required,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationMessages.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================
// RESET PASSWORD REQUEST
// ============================================

export const resetPasswordRequestSchema = z.object({
  email: emailRule.required,
});

export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;

// ============================================
// RESET PASSWORD (with token)
// ============================================

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, ValidationMessages.REQUIRED),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationMessages.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// CHANGE PASSWORD (authenticated user)
// ============================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, ValidationMessages.PASSWORD_REQUIRED),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ValidationMessages.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'validation.password.same_as_current',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// VERIFY EMAIL
// ============================================

export const verifyEmailSchema = z.object({
  token: z.string().min(1, ValidationMessages.REQUIRED),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
