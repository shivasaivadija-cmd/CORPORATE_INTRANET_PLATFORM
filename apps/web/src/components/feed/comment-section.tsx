'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';
import { formatRelativeTime, getInitials } from '@/lib/utils';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiClient.get(`/feed/posts/${postId}/comments`).then((r) => r.data.data),
  });

  const addComment = useMutation({
    mutationFn: (text: string) =>
      apiClient.post(`/feed/posts/${postId}/comments`, { content: text }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return (
    <div className="space-y-3 px-4 py-3">
      {/* Comment input */}
      <div className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={user?.avatarUrl || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
            {getInitials(user?.displayName || 'U')}
          </AvatarFallback>
        </Avatar>
        <div className="border-border bg-muted/30 flex flex-1 items-center gap-2 rounded-full border px-3 py-1.5">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && content.trim()) {
                e.preventDefault();
                addComment.mutate(content.trim());
              }
            }}
            placeholder="Write a comment..."
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          <Tooltip content="Send comment (Enter)" side="top">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-primary h-5 w-5"
              disabled={!content.trim() || addComment.isPending}
              onClick={() => addComment.mutate(content.trim())}
            >
              {addComment.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="skeleton h-7 w-7 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {comments?.map((comment: any, i: number) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
              className="flex gap-2.5"
            >
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarImage src={comment.author?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {getInitials(comment.author?.displayName || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-xl px-3 py-2">
                  <p className="mb-0.5 text-xs font-semibold">{comment.author?.displayName}</p>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
                <p className="text-muted-foreground mt-1 px-1 text-[10px]">
                  {formatRelativeTime(comment.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
