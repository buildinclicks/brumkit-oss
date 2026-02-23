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
import { Checkbox } from '@repo/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { deleteAccountSchema } from '@repo/validation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { deleteAccount } from '@/app/actions';
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

  const form = useForm<DeleteAccountFormInput>({
    resolver: zodResolver(deleteAccountFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmation: false,
    },
  });

  const mutation = useServerActionForm<void, DeleteAccountFormInput>(
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
  };

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="text-red-600 dark:text-red-500">
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and data
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">Warning</p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                This action cannot be undone. Your account will be permanently
                deleted after 30 days.
              </p>
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password to confirm"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We need your password to confirm this deletion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I understand that this action is permanent
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="bg-muted/50 dark:bg-muted/20 border border-border/50 rounded-md p-4">
              <p className="text-sm font-medium mb-2">30-Day Grace Period</p>
              <p className="text-sm text-muted-foreground">
                You have 30 days to cancel this action by logging in again.
                After that, your personal information will be removed and your
                content will be anonymized.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-red-50/50 dark:bg-red-950/10 px-6 py-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={mutation.isPending || !form.watch('confirmation')}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mutation.isPending ? 'Processing...' : 'Delete My Account'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
