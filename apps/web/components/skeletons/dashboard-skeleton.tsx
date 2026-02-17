import { Skeleton } from '@repo/ui';

import { CardSkeleton } from './card-skeleton';

/**
 * Skeleton loader for dashboard page
 *
 * Matches the dashboard layout structure with cards in a grid.
 * Displays while dashboard data is being fetched.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      {/* Grid of card skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Additional section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <CardSkeleton />
      </div>
    </div>
  );
}
