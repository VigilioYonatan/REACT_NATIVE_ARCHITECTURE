interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className="loading-skeleton-container">
      <div className="skeleton skeleton-title" />
      <div className="product-grid">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text skeleton-text--short" />
          </div>
        ))}
      </div>
    </div>
  );
}
