'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export function AiDigestCard() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['ai-digest'],
    queryFn: () => apiClient.get('/ai/digest').then((r) => r.data.data),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });

  return (
    <div className="glass-card border-border/50 hover:border-primary/20 h-full rounded-2xl border p-6 transition-all">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Daily Digest</h3>
            <p className="text-muted-foreground text-[10px] font-medium">Powered by Gemini</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 h-8 w-8 rounded-xl"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-5/6 rounded-lg" />
          <div className="skeleton h-4 w-4/6 rounded-lg" />
        </div>
      ) : error ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-red-500"
        >
          Failed to load digest.{' '}
          <button onClick={() => refetch()} className="underline hover:text-red-400">
            Try again
          </button>
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground/90 text-sm leading-relaxed"
        >
          {data?.digest ||
            'No digest available yet. Check back after some activity in your organization.'}
        </motion.p>
      )}
    </div>
  );
}
