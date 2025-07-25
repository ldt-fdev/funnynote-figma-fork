interface ImagePlaceholderSkeletonProps {
  count?: number; // Number of skeleton items to display
}

export default function ImagePlaceholderSkeleton({ count = 5 }: ImagePlaceholderSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse"
        >
          {/* Icon Placeholder */}
          <div className="h-8 w-8 bg-gray-200 rounded-md flex-shrink-0"></div>
          {/* Text Placeholders */}
          <div className="flex-1 min-w-0 ml-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div> {/* Main title */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div> {/* Subtitle */}
          </div>
          {/* More Options Placeholder */}
          <div className="h-6 w-6 bg-gray-200 rounded-full ml-auto"></div>
        </div>
      ))}
    </div>
  );
}
