'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import {
  requestEmailChangeSchema,
  type RequestEmailChangeInput,
} from '@repo/validation';
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { requestEmailChange } from '@/app/actions/email-change';
import { FieldError } from '@/components/form/field-error';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';

interface EmailChangeFormProps {
  currentEmail: string;
}

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RequestEmailChangeInput>({
    resolver: zodResolver(requestEmailChangeSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const mutation = useServerActionForm<
    Awaited<ReturnType<typeof requestEmailChange>>['data'],
    RequestEmailChangeInput
  >(requestEmailChange, {
    setError: form.setError,
    onSuccess: () => {
      const newEmail = form.getValues('newEmail');
      toast.success('Verification Email Sent', {
        description: `Please check ${newEmail} and click the verification link to complete the email change.`,
      });
      // Clear only password for security, keep email for reference
      form.setValue('password', '');
    },
    onError: (error: Error) => {
      toast.error('Failed to Change Email', {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = async (data: RequestEmailChangeInput) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Email (Static) */}
      <div className="space-y-2">
        <Label>Current Email</Label>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{currentEmail}</span>
        </div>
      </div>

      {/* New Email */}
      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email</Label>
        <Input
          id="newEmail"
          type="email"
          placeholder="Enter your new email address"
          {...form.register('newEmail')}
          aria-invalid={form.formState.errors.newEmail ? 'true' : 'false'}
          disabled={mutation.isPending}
        />
        <FieldError error={form.formState.errors.newEmail} />
      </div>

      {/* Password Confirmation */}
      <div className="space-y-2">
        <Label htmlFor="password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password to confirm"
            {...form.register('password')}
            aria-invalid={form.formState.errors.password ? 'true' : 'false'}
            disabled={mutation.isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={mutation.isPending}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <FieldError error={form.formState.errors.password} />
      </div>

      {/* Security Notice */}
      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        A verification email will be sent to the new address. You&apos;ll also
        receive a notification at your current email.
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
          {mutation.isPending ? 'Sending...' : 'Change Email'}
        </Button>
      </div>
    </form>
  );
}
