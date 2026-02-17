import { ProfileSkeleton } from '@/components/skeletons/profile-skeleton';

/**
 * Loading state for profile page
 *
 * Automatically displayed by Next.js while the page is loading.
 * Uses Suspense boundary to show skeleton loader.
 */
export default function ProfileLoading() {
  return <ProfileSkeleton />;
}
