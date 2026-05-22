import { motion } from 'framer-motion';

export function DashboardSkeleton() {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
        {/* Header Skeleton */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-muted/50 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-10 w-64 bg-muted/50 rounded-xl animate-pulse" />
              <div className="h-5 w-48 bg-muted/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8 xl:col-span-2">
            <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
            <div className="h-96 rounded-2xl bg-muted/50 animate-pulse" />
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
            <div className="h-96 rounded-2xl bg-muted/50 animate-pulse" />
          </div>
        </div>

        {/* Bottom Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
          <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
