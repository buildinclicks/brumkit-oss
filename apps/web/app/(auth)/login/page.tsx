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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { loginSchema, type LoginInput } from '@repo/validation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PasswordInput } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useLogin } from '@/lib/hooks';
import { useAuthMessages } from '@/lib/hooks/use-translations';

export default function LoginPage() {
  const loginMutation = useLogin();
  const t = useAuthMessages();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success('Signed in successfully');
    } catch (error: unknown) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.email_label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('register.email_placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('login.password_label')}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isLoading}
                      placeholder="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? t('login.submitting') : t('login.submit_button')}
            </Button>
          </form>
        </Form>
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
