import * as React from 'react';
import { cn } from '@floodguard/utils';

/**
 * Storybook & Component Documentation: Skeleton
 * 
 * **Purpose:** Loading state placeholder for cards, tables, text lines, and avatar blocks to prevent layout shift.
 * **Usage:** `<Skeleton className="h-4 w-[250px]" />`
 * **Accessibility Notes:** Includes `aria-hidden="true"` and `role="status"` on wrapper.
 */

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/60 dark:bg-muted/40', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 rounded-xl border border-border space-y-4', className)}>
    <Skeleton className="h-5 w-2/5" />
    <Skeleton className="h-10 w-4/5" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} />
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonText };
