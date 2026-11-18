import { Skeleton } from '@/shared/ui/skeleton';

/** Loading state of the member pages: breadcrumbs, header and content outlines. */
export function MemberPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-4 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
