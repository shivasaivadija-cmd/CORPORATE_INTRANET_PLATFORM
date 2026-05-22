'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Bookmark, Share2, MoreHorizontal, Sparkles, Pin } from 'lucide-react';
import { formatRelativeTime, REACTION_EMOJIS, cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { ReactionPicker } from './reaction-picker';
import { CommentSection } from './comment-section';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import type { Post } from '@intranet/types';
import { getInitials } from '@/lib/utils';

interface PostCardProps {
  post: Post & {
    reactionCounts: Record<string, number>;
    userReaction?: string | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [localReaction, setLocalReaction] = useState(post.userReaction || null);
  const [localCounts, setLocalCounts] = useState(post.reactionCounts);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const reactMutation = useMutation({
    mutationFn: (type: string) => apiClient.post(`/feed/posts/${post.id}/react`, { type }),
    onMutate: (type) => {
      // Optimistic update
      setLocalCounts((prev) => {
        const next = { ...prev };
        if (localReaction === type) {
          next[type] = Math.max(0, (next[type] || 0) - 1);
          setLocalReaction(null);
        } else {
          if (localReaction) next[localReaction] = Math.max(0, (next[localReaction] || 0) - 1);
          next[type] = (next[type] || 0) + 1;
          setLocalReaction(type);
        }
        return next;
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => apiClient.post(`/feed/posts/${post.id}/bookmark`),
    onMutate: () => setIsBookmarked((prev) => !prev),
  });

  const totalReactions = Object.values(localCounts).reduce((sum, v) => sum + (v || 0), 0);
  const topReactions = Object.entries(localCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ y: -2 }}
      className="glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border border-border/50 hover:border-primary/20 group"
    >
      {/* Pinned indicator */}
      {post.isPinned && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-2 px-5 py-2.5 text-xs font-semibold backdrop-blur-sm"
        >
          <Pin className="h-3.5 w-3.5" />
          <span>Pinned post</span>
        </motion.div>
      )}

      <div className="p-5">
        {/* Author */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-11 w-11 ring-2 ring-border/50 hover:ring-primary/50 transition-all shadow-md cursor-pointer">
                <AvatarImage src={post.author?.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-bold">
                  {getInitials(post.author?.displayName || 'U')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <p className="text-sm font-bold leading-tight hover:text-primary transition-colors cursor-pointer">{post.author?.displayName}</p>
              <p className="text-muted-foreground text-xs font-medium">
                {post.author?.jobTitle}
                {post.author?.department && (
                  <>
                    <span className="mx-1.5">·</span>
                    <span className="text-primary/70">{post.author.department.name}</span>
                  </>
                )}
                <span className="mx-1.5">·</span>
                <span>{formatRelativeTime(post.createdAt)}</span>
              </p>
            </div>
          </div>
          <Tooltip content="More options" side="bottom">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-xl hover:bg-accent/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          </Tooltip>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{post.content}</p>
        </div>

        {/* Media */}
        {post.mediaUrls?.length > 0 && (
          <div
            className={cn(
              'mb-4 grid gap-2.5',
              post.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            {post.mediaUrls.slice(0, 4).map((url, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="bg-muted relative aspect-video overflow-hidden rounded-xl border border-border/50 cursor-pointer group/img"
              >
                <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg cursor-pointer text-xs font-semibold transition-all border border-primary/10"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {post.aiSummary && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 border-purple-500/20 mb-4 flex items-start gap-3 rounded-xl border p-3.5 backdrop-blur-sm"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">AI Summary</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{post.aiSummary}</p>
            </div>
          </motion.div>
        )}

        {/* Reaction summary */}
        {totalReactions > 0 && (
          <div className="border-border/50 mb-2 flex items-center justify-between border-t pt-3 pb-2">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 px-2 py-1 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex -space-x-1">
                {topReactions.map(([type]) => (
                  <motion.span 
                    key={type} 
                    className="text-base bg-background rounded-full border border-border/50 shadow-sm"
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                  >
                    {REACTION_EMOJIS[type]}
                  </motion.span>
                ))}
              </div>
              <span className="text-muted-foreground text-xs font-semibold">{totalReactions}</span>
            </motion.div>
            {post.commentCount > 0 && (
              <span className="text-muted-foreground text-xs font-medium hover:text-foreground cursor-pointer transition-colors">
                {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="border-border/50 flex items-center gap-1.5 border-t pt-2">
          {/* Reaction button */}
          <div className="relative">
            <Tooltip content="Add reaction" side="top">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                onClick={() => reactMutation.mutate(localReaction || 'like')}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  localReaction
                    ? 'text-brand-500 bg-brand-500/10'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <span className="text-sm">
                  {localReaction ? REACTION_EMOJIS[localReaction] : '👍'}
                </span>
                <span>
                  {localReaction
                    ? localReaction.charAt(0).toUpperCase() + localReaction.slice(1)
                    : 'Like'}
                </span>
              </motion.button>
            </Tooltip>

            <AnimatePresence>
              {showReactions && (
                <ReactionPicker
                  onReact={(type) => {
                    reactMutation.mutate(type);
                    setShowReactions(false);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          <Tooltip content="Add comment" side="top">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Comment</span>
            </motion.button>
          </Tooltip>

          <Tooltip content={isBookmarked ? 'Remove bookmark' : 'Bookmark post'} side="top">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => bookmarkMutation.mutate()}
              className={cn(
                'ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                isBookmarked
                  ? 'text-brand-500 bg-brand-500/10'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Bookmark className={cn('h-3.5 w-3.5', isBookmarked && 'fill-current')} />
            </motion.button>
          </Tooltip>

          <Tooltip content="Share post" side="top">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
            </motion.button>
          </Tooltip>
        </div>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border overflow-hidden border-t"
          >
            <CommentSection postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
