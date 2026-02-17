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
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from '@repo/validation';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { requestPasswordReset } from '@/app/actions';
import { FieldError } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';
import { useAuthMessages } from '@/lib/hooks/use-translations';

export default function ForgotPasswordPage() {
  const t = useAuthMessages();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordRequestInput>({
    resolver: zodResolver(resetPasswordRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const mutation = useServerActionForm(requestPasswordReset, {
    setError: form.setError,
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Email Sent', {
        description: t('forgot_password.success_message'),
      });
    },
    onError: (error) => {
      toast.error('Failed to Send Reset Link', {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = async (data: ResetPasswordRequestInput) => {
    await mutation.mutateAsync(data);
  };

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t('forgot_password.success_title')}
          </CardTitle>
          <CardDescription>
            {t('forgot_password.success_message')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('forgot_password.success_instruction')}
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="text-sm text-primary hover:underline">
            {t('forgot_password.back_to_login')}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t('forgot_password.title')}
        </CardTitle>
        <CardDescription>{t('forgot_password.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('forgot_password.email_label')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('forgot_password.email_placeholder')}
              {...form.register('email')}
              disabled={mutation.isPending}
            />
            <FieldError error={form.formState.errors.email} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? t('forgot_password.submitting')
              : t('forgot_password.submit_button')}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {t('forgot_password.back_to_login')}
        </Link>
      </CardFooter>
    </Card>
  );
}
