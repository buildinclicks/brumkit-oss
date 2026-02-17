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
import { registerSchema, type RegisterInput } from '@repo/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { registerUser } from '@/app/actions';
import { FieldError } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';
import { useAuthMessages } from '@/lib/hooks/use-translations';

export default function RegisterPage() {
  const router = useRouter();
  const t = useAuthMessages();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first blur
  });

  const registerMutation = useServerActionForm(registerUser, {
    setError,
    onSuccess: () => {
      toast.success('Account created successfully!', {
        description: 'Please login with your new account.',
      });
      router.push('/login');
    },
    onError: (error) => {
      toast.error('Registration Failed', {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t('register.title')}
        </CardTitle>
        <CardDescription>{t('register.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('register.name_label')}</Label>
            <Input
              id="name"
              placeholder={t('register.name_placeholder')}
              {...register('name')}
              disabled={registerMutation.isPending}
            />
            <FieldError error={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('register.email_label')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('register.email_placeholder')}
              {...register('email')}
              disabled={registerMutation.isPending}
            />
            <FieldError error={errors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('register.password_label')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={registerMutation.isPending}
            />
            <FieldError error={errors.password} />
            <p className="text-xs text-muted-foreground">
              {t('register.password_hint')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('register.confirm_password_label')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              disabled={registerMutation.isPending}
            />
            <FieldError error={errors.confirmPassword} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? t('register.submitting')
              : t('register.submit_button')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">
          {t('register.already_have_account')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('register.sign_in_link')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
