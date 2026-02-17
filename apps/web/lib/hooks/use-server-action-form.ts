import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { ActionResult } from '@/app/actions/auth';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/**
 * Options for useServerActionForm hook
 */
interface ServerActionFormOptions<
  TData,
  TVariables extends FieldValues,
  TError = Error,
> {
  setError: UseFormSetError<TVariables>;
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: TError) => void;
  mutationOptions?: Omit<
    UseMutationOptions<TData, unknown, TVariables, unknown>,
    'mutationFn' | 'onSuccess' | 'onError'
  >;
}

/**
 * Enhanced mutation hook that automatically handles server field errors
 *
 * This hook wraps a server action with Tanstack Query's useMutation and
 * automatically maps field-level validation errors from the server to
 * React Hook Form's error state.
 *
 * @example
 * ```tsx
 * const form = useForm<RegisterInput>({
 *   resolver: zodResolver(registerSchema),
 * });
 *
 * const registerMutation = useServerActionForm(registerUser, {
 *   setError: form.setError,
 *   onSuccess: () => router.push('/login'),
 *   onError: (error) => {
 *     toast.error('Registration Failed', {
 *       description: getErrorMessage(error),
 *     });
 *   },
 * });
 *
 * const onSubmit = async (data: RegisterInput) => {
 *   await registerMutation.mutateAsync(data);
 * };
 * ```
 *
 * @param mutationFn - Server action function that returns ActionResult<TData>
 * @param options - Configuration options including setError from useForm
 * @returns Tanstack Query mutation object with automatic error mapping
 */
export function useServerActionForm<TData, TVariables extends FieldValues>(
  mutationFn: (data: TVariables) => Promise<ActionResult<TData>>,
  options: ServerActionFormOptions<TData, TVariables>
) {
  const { setError, onSuccess, onError, mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    mutationFn: async (data: TVariables) => {
      const result = await mutationFn(data);

      if (!result.success) {
        const error = new Error(result.error) as Error & {
          fieldErrors?: Record<string, string>;
        };
        error.fieldErrors = result.fieldErrors;
        throw error;
      }

      return result.data;
    },
    onSuccess: async (data) => {
      await onSuccess?.(data);
    },
    onError: (error: unknown) => {
      // Automatically map field errors to form fields
      let hasFieldErrors = false;
      if (
        error &&
        typeof error === 'object' &&
        'fieldErrors' in error &&
        error.fieldErrors &&
        typeof error.fieldErrors === 'object'
      ) {
        const fieldErrors = error.fieldErrors as Record<string, string>;
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as Path<TVariables>, {
            type: 'server',
            message,
          });
        });
        hasFieldErrors = Object.keys(fieldErrors).length > 0;
      }

      // Only call onError callback for non-field errors (server/business logic errors)
      // Field errors are displayed inline, so no toast needed
      if (!hasFieldErrors) {
        onError?.(error as Error);
      }
    },
    ...mutationOptions,
  });
}
