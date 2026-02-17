'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { Textarea } from '@repo/ui/textarea';
import {
  updateUserProfileSchema,
  type UpdateUserProfileInput,
} from '@repo/validation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateUserProfile } from '@/app/actions';
import { FieldError } from '@/components/form';
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          {...form.register('name')}
          disabled={mutation.isPending}
        />
        <FieldError error={form.formState.errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="johndoe"
          {...form.register('username')}
          disabled={mutation.isPending}
        />
        <FieldError error={form.formState.errors.username} />
        <p className="text-xs text-muted-foreground">
          Your unique username for your profile URL
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          rows={4}
          {...form.register('bio')}
          disabled={mutation.isPending}
        />
        <FieldError error={form.formState.errors.bio} />
        <p className="text-xs text-muted-foreground">
          Brief description for your profile (max 500 characters)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Profile Image URL</Label>
        <Input
          id="image"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          {...form.register('image')}
          disabled={mutation.isPending}
        />
        <FieldError error={form.formState.errors.image} />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
