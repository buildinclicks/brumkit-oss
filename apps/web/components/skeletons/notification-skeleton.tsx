import { Card } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';

export function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}
