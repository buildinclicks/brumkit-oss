import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';

import { queryKeys } from './query-keys';

import type { LoginInput, ChangePasswordInput } from '@repo/validation';

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const result = await signIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate user queries to refetch current user
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      router.push('/dashboard');
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      router.push('/');
    },
  });
}

/**
 * Hook for password change (authenticated users)
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const { changePassword } = await import('@/app/actions');
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (!result.success) {
        const error: any = new Error(result.error);
        error.fieldErrors = result.fieldErrors;
        throw error;
      }

      return result.data;
    },
  });
}

/**
 * Hook for password reset request (forgot password)
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { requestPasswordReset } = await import('@/app/actions');
      const result = await requestPasswordReset({ email });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

/**
 * Hook for password reset confirmation (with token)
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => {
      const { resetPassword } = await import('@/app/actions');
      const result = await resetPassword(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
}
