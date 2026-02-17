'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@repo/validation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { changePassword } from '@/app/actions';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Enter your current password"
            {...form.register('currentPassword')}
            aria-invalid={
              form.formState.errors.currentPassword ? 'true' : 'false'
            }
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.currentPassword && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            {...form.register('newPassword')}
            aria-invalid={form.formState.errors.newPassword ? 'true' : 'false'}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.newPassword.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          At least 8 characters with uppercase, lowercase, number, and special
          character
        </p>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            {...form.register('confirmPassword')}
            aria-invalid={
              form.formState.errors.confirmPassword ? 'true' : 'false'
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
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
    </form>
  );
}
