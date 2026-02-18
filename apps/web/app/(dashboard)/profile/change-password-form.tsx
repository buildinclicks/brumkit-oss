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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@repo/validation';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { changePassword } from '@/app/actions';
import { PasswordInput } from '@/components/form/password-input';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const mutation = useServerActionForm(changePassword, {
    setError: form.setError,
    onSuccess: () => {
      toast.success('Password Updated', {
        description: 'Your password has been changed successfully.',
      });
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to Change Password', {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    await mutation.mutateAsync(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your current password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your new password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    At least 8 characters with uppercase, lowercase, number, and
                    special character
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your new password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Please use 32 characters or fewer.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
