'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { Checkbox } from '@repo/ui/checkbox';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { deleteAccountSchema } from '@repo/validation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { deleteAccount } from '@/app/actions';
import { FieldError } from '@/components/form';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';

// Extend schema with confirmation checkbox
const deleteAccountFormSchema = deleteAccountSchema.extend({
  confirmation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm to delete your account',
  }),
});

type DeleteAccountFormInput = z.infer<typeof deleteAccountFormSchema>;

export function DeleteAccountForm() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const form = useForm<DeleteAccountFormInput>({
    resolver: zodResolver(deleteAccountFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmation: false,
    },
  });

  const mutation = useServerActionForm<
    Awaited<ReturnType<typeof deleteAccount>>['data'],
    DeleteAccountFormInput
  >(
    // Wrap the action to transform the data
    async (data: DeleteAccountFormInput) => {
      // Only pass password to server action (confirmation is client-side only)
      return deleteAccount({ password: data.password });
    },
    {
      setError: form.setError,
      onSuccess: () => {
        toast.success('Account Deletion Scheduled', {
          description:
            'Your account will be permanently deleted in 30 days. You can cancel this by logging in again.',
        });
        // Redirect to login after short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      },
      onError: (error) => {
        toast.error('Failed to Delete Account', {
          description: getErrorMessage(error),
        });
      },
    }
  );

  const onSubmit = async (data: DeleteAccountFormInput) => {
    if (!data.confirmation) {
      form.setError('confirmation', {
        message: 'You must confirm to delete your account',
      });
      return;
    }

    await mutation.mutateAsync(data);
  };

  const handleCancel = () => {
    form.reset();
    setIsConfirmed(false);
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/10 border border-destructive rounded-md p-4">
          <p className="text-sm font-semibold text-destructive mb-2">
            ⚠️ Warning
          </p>
          <p className="text-sm text-destructive">
            This action cannot be undone. Your account will be permanently
            deleted after 30 days.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password to confirm"
              {...form.register('password')}
              disabled={mutation.isPending}
            />
            <p className="text-sm text-muted-foreground">
              We need your password to confirm this deletion
            </p>
            <FieldError error={form.formState.errors.password} />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirmation"
              checked={isConfirmed}
              onCheckedChange={(checked) => {
                setIsConfirmed(checked as boolean);
                form.setValue('confirmation', checked as boolean, {
                  shouldValidate: true,
                });
              }}
              disabled={mutation.isPending}
            />
            <label
              htmlFor="confirmation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that this action is permanent
            </label>
          </div>
          {form.formState.errors.confirmation && (
            <FieldError error={form.formState.errors.confirmation} />
          )}

          <div className="bg-muted rounded-md p-4">
            <p className="text-sm font-medium mb-2">30-Day Grace Period</p>
            <p className="text-sm text-muted-foreground">
              You have 30 days to cancel this action by logging in again. After
              that, your personal information will be removed and your content
              will be anonymized.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={mutation.isPending || !isConfirmed}
            >
              {mutation.isPending ? 'Processing...' : 'Delete My Account'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
