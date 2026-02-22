import { AlertCircle } from 'lucide-react';

import type { FieldError as RHFFieldError } from 'react-hook-form';

import { useValidationMessages } from '@/lib/hooks/use-translations';

interface FieldErrorProps {
  error?: RHFFieldError;
}

/**
 * Display form field validation errors with translation support
 *
 * Automatically translates error messages using validation message keys.
 * Shows an alert icon alongside the error message for better visibility.
 * Returns null if no error is present.
 *
 * @example
 * ```tsx
 * <Input {...register('email')} />
 * <FieldError error={errors.email} />
 * ```
 */
export function FieldError({ error }: FieldErrorProps) {
  const tv = useValidationMessages();

  if (!error?.message) return null;

  // Try to translate the message. If it fails (server-side errors with full sentences),
  // return the original message
  let translatedMessage: string;
  try {
    translatedMessage = tv(error.message);
    // If the translation key is missing, it returns the key itself prefixed with namespace
    // e.g., "validation.This username is already taken"
    // In that case, use the original message
    if (translatedMessage.startsWith('validation.')) {
      translatedMessage = error.message;
    }
  } catch {
    translatedMessage = error.message;
  }

  return (
    <p
      className="flex items-center gap-1.5 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{translatedMessage}</span>
    </p>
  );
}
