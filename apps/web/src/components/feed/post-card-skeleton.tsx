'use client';

export function PostCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full skeleton" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-32 rounded skeleton" />
          <div className="h-3 w-48 rounded skeleton" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded skeleton" />
        <div className="h-3.5 w-4/5 rounded skeleton" />
        <div className="h-3.5 w-3/5 rounded skeleton" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/50">
        <div className="h-7 w-16 rounded-lg skeleton" />
        <div className="h-7 w-20 rounded-lg skeleton" />
        <div className="h-7 w-7 rounded-lg skeleton ml-auto" />
      </div>
    </div>
  );
}
