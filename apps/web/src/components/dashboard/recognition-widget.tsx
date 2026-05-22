'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api-client';
import { getInitials, formatRelativeTime } from '@/lib/utils';

export function RecognitionWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-recognitions'],
    queryFn: () => apiClient.get('/recognition?limit=5').then((r) => r.data.data),
  });

  return (
    <div className="glass-card h-full rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-all">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
            <Award className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold">Recognition</h3>
        </div>
        <Link
          href="/recognition"
          className="text-primary hover:text-primary/80 text-xs font-semibold transition-colors flex items-center gap-1 group"
        >
          <span>View all</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-full rounded-lg" />
                <div className="skeleton h-3 w-2/3 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm font-medium">No recognitions yet</p>
      ) : (
        <div className="space-y-3.5">
          {data?.map((rec: any, i: number) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 25 }}
              className="flex gap-3 p-3 rounded-xl hover:bg-accent/50 cursor-pointer group transition-all"
            >
              <motion.div whileHover={{ scale: 1.1 }}>
                <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-border/50 group-hover:ring-amber-500/50 transition-all shadow-sm">
                  <AvatarImage src={rec.receiver?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-xs font-bold text-amber-600">
                    {getInitials(rec.receiver?.displayName || 'U')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug font-medium">
                  <span className="font-bold">{rec.giver?.displayName}</span>
                  {' recognized '}
                  <span className="font-bold">{rec.receiver?.displayName}</span>{' '}
                  <span className="text-base">{rec.badge?.iconUrl}</span>
                </p>
                <p className="text-muted-foreground mt-1 truncate text-[10px] leading-relaxed">{rec.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
