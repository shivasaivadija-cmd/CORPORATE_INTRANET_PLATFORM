'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api-client';
import { getInitials, formatRelativeTime } from '@/lib/utils';

export function RecentActivityWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.get('/feed?limit=5').then((r) => r.data.data),
  });

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-green-500" />
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <span className="ml-auto flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-8 w-8 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 25 }}
              className="flex gap-3"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={post.author?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {getInitials(post.author?.displayName || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug">
                  <span className="font-medium">{post.author?.displayName}</span>
                  {' shared a post'}
                </p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{post.content}</p>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  {formatRelativeTime(post.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
