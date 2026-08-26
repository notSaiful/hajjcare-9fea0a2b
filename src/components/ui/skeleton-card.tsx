import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showIcon?: boolean;
  showImage?: boolean;
}

export function SkeletonCard({ 
  className, 
  lines = 3, 
  showIcon = false,
  showImage = false 
}: SkeletonCardProps) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-card/50 p-4 border border-border/30", className)}>
      {showImage && (
        <div className="h-32 bg-muted/50 rounded-lg mb-4" />
      )}
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="w-12 h-12 rounded-full bg-muted/50 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted/50 rounded w-3/4" />
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <div 
              key={i} 
              className="h-3 bg-muted/40 rounded" 
              style={{ width: `${60 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col items-center gap-2 p-2 sm:p-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted/50" />
          <div className="h-3 bg-muted/40 rounded w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} showIcon lines={2} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-muted/50 rounded w-1/3 mx-auto" />
      
      {/* Content skeleton */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} showIcon />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}
