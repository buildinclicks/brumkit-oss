'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
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
import { Textarea } from '@repo/ui/textarea';
import {
  updateUserProfileSchema,
  type UpdateUserProfileInput,
} from '@repo/validation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateUserProfile } from '@/app/actions';
import { getErrorMessage } from '@/lib/api-error';
import { useServerActionForm } from '@/lib/hooks/use-server-action-form';

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    bio: string | null;
    image: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<UpdateUserProfileInput>({
    resolver: zodResolver(updateUserProfileSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      image: user.image || '',
    },
  });

  const mutation = useServerActionForm(updateUserProfile, {
    setError: form.setError,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Update Failed', {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = async (data: UpdateUserProfileInput) => {
    await mutation.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={mutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  disabled={mutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your unique username for your profile URL
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  rows={4}
                  disabled={mutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={mutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
