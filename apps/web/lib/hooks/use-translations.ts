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
    return t(key as ValidationMessageKey);
  };
}

/**
 * Hook for translating auth-related messages
 */
export function useAuthMessages() {
  return useTranslations('auth');
}
