interface SkeletonProps { className?: string }

export function Skeleton({ className = '' }: SkeletonProps) {
  return <span className={`block animate-pulse rounded-panel bg-surface-overlay motion-reduce:animate-none ${className}`} aria-hidden="true" />
}
