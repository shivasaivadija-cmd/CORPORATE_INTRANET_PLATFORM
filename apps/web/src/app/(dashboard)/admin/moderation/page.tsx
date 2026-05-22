'use client';

import { useState } from 'react';
import { Shield, Flag, Eye, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function ModerationPage() {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'toxic'>('all');
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({
    queryKey: ['moderation-posts', filter],
    queryFn: () => api.get('/admin/moderation/posts', { params: { filter } }),
  });

  const approveMutation = useMutation({
    mutationFn: (postId: string) => api.patch(`/admin/moderation/posts/${postId}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-posts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => api.delete(`/feed/posts/${postId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-posts'] }),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-500" />
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage flagged content</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Posts', icon: Eye },
          { key: 'flagged', label: 'Flagged', icon: Flag },
          { key: 'toxic', label: 'AI Detected', icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === key
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                : 'bg-card border border-border hover:border-red-500/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Array.isArray(posts?.data) && posts.data.length > 0 ? (
          posts.data.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-red-500/50 transition-all"
            >
              <div className="flex gap-4">
                <img
                  src={post.author.avatarUrl || '/default-avatar.png'}
                  alt={post.author.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{post.author.displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                    {post.isModerated && (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        Flagged
                      </span>
                    )}
                    {post.aiToxicityScore > 0.7 && (
                      <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        AI: {(post.aiToxicityScore * 100).toFixed(0)}% toxic
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 mb-3">{post.content}</p>
                  {post.mediaUrls?.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {post.mediaUrls.map((url: string, i: number) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveMutation.mutate(post.id)}
                      disabled={approveMutation.isPending}
                      className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(post.id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No posts to moderate</p>
          </div>
        )}
      </div>
    </div>
  );
}
