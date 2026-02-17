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
import { loginSchema, type LoginInput } from '@repo/validation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FieldError } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useLogin } from '@/lib/hooks';
import { useAuthMessages } from '@/lib/hooks/use-translations';

export default function LoginPage() {
  const loginMutation = useLogin();
  const t = useAuthMessages();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first blur
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error('Login Failed', {
        description: getErrorMessage(error),
      });
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
        <CardDescription>{t('login.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('login.email_label')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('register.email_placeholder')}
              {...register('email')}
              disabled={isLoading}
            />
            <FieldError error={errors.email} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('login.password_label')}</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading}
            />
            <FieldError error={errors.password} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('login.submitting') : t('login.submit_button')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">
          {t('login.no_account')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('login.sign_up_link')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
