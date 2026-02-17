import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

/**
 * Loading state for dashboard page
 *
 * Automatically displayed by Next.js while the page is loading.
 * Uses Suspense boundary to show skeleton loader.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
