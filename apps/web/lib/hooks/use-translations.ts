import { useTranslations } from 'next-intl';

import type { ValidationMessageKey } from '@repo/validation';

/**
 * Hook for translating validation error messages
 *
 * Usage:
 * const t = useValidationMessages();
 * const message = t('email.invalid'); // automatically scoped to 'validation' namespace
 */
export function useValidationMessages() {
  const t = useTranslations('validation');

  return (key: ValidationMessageKey | string) => {
    // Normalize key for common Zod/framework fallbacks
    let normalizedKey = String(key);

    // Zod's default message is often just 'Required' (uppercase)
    if (normalizedKey === 'Required') {
      normalizedKey = 'common.required';
    } else if (normalizedKey === 'Invalid email') {
      normalizedKey = 'email.invalid';
    }

    try {
      return t(normalizedKey as ValidationMessageKey);
    } catch {
      return normalizedKey;
    }
  };
}

/**
 * Hook for translating auth-related messages
 */
export function useAuthMessages() {
  return useTranslations('auth');
}
