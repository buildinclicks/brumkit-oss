'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { resetPasswordSchema, type ResetPasswordInput } from '@repo/validation';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { resetPassword } from '@/app/actions';
import { FieldError } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';
import { useAuthMessages } from '@/lib/hooks/use-translations';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useAuthMessages();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      token: token || '',
    },
  });

  const resetMutation = useServerActionForm(resetPassword, {
    setError: form.setError,
    onSuccess: () => {
      toast.success('Password Reset Successfully', {
        description: t('reset_password.success'),
      });
      router.push('/login');
    },
    onError: (error) => {
      toast.error('Failed to Reset Password', {
        description: getErrorMessage(error),
      });
    },
  });

  // If no token, show error state
  if (!token) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">
            Invalid Reset Link
          </CardTitle>
          <CardDescription>{t('reset_password.invalid_token')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => router.push('/forgot-password')}
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    await resetMutation.mutateAsync(data);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t('reset_password.title')}
        </CardTitle>
        <CardDescription>{t('reset_password.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden token field */}
          <input type="hidden" {...form.register('token')} />

          <div className="space-y-2">
            <Label htmlFor="password">
              {t('reset_password.password_label')}
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
              disabled={resetMutation.isPending}
            />
            <FieldError error={form.formState.errors.password} />
            <p className="text-xs text-muted-foreground">
              {t('register.password_hint')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('reset_password.confirm_password_label')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register('confirmPassword')}
              disabled={resetMutation.isPending}
            />
            <FieldError error={form.formState.errors.confirmPassword} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending
              ? t('reset_password.submitting')
              : t('reset_password.submit_button')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
