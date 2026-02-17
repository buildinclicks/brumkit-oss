import { Card, CardContent, CardHeader, Skeleton } from '@repo/ui';

/**
 * Skeleton loader for card components
 *
 * Displays a loading placeholder matching the card component structure.
 * Used during async data fetching to prevent layout shift.
 */
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  );
}
