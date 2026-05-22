'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import { motion } from 'framer-motion';
import { PostCard } from './post-card';
import { PostComposer } from './post-composer';
import { PostCardSkeleton } from './post-card-skeleton';
import { EmptyFeed } from './empty-feed';
import { apiClient } from '@/lib/api-client';
import type { Post } from '@intranet/types';

export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['feed'],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await apiClient.get(`/feed?page=${pageParam}&limit=20`);
        return data;
      },
      getNextPageParam: (lastPage) =>
        lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined,
      initialPageParam: 1,
    });

  const posts = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border p-6 text-center text-sm">
        Failed to load feed. Please try again.
      </div>
    );
  }

  if (posts.length === 0) return <EmptyFeed />;

  return (
    <div className="space-y-4">
      <PostComposer />
      <Virtuoso
        useWindowScroll
        data={posts}
        endReached={() => hasNextPage && fetchNextPage()}
        itemContent={(index, post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: Math.min(index * 0.05, 0.3),
              type: 'spring',
              stiffness: 200,
              damping: 25,
            }}
            className="mb-4"
          >
            <PostCard post={post} />
          </motion.div>
        )}
        components={{
          Footer: () =>
            isFetchingNextPage ? (
              <div className="space-y-4 py-4">
                <PostCardSkeleton />
              </div>
            ) : null,
        }}
      />
    </div>
  );
}
