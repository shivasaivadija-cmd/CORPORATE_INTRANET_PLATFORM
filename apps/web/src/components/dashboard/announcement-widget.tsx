'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Megaphone, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { formatRelativeTime } from '@/lib/utils';

const PRIORITY_CONFIG = {
  CRITICAL: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  HIGH: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  MEDIUM: { icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  LOW: { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted/50 border-border' },
};

export function AnnouncementWidget() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements-widget'],
    queryFn: () => apiClient.get('/announcements?limit=3&pinned=true').then((r) => r.data.data),
    retry: 2,
  });

  return (
    <div className="glass-card border-border/50 hover:border-primary/20 rounded-2xl border p-6 transition-all">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold">Announcements</h3>
        <Link
          href="/announcements"
          className="text-primary hover:text-primary/80 group flex items-center gap-1 text-xs font-semibold transition-colors"
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
          {[1, 2].map((i) => (
            <div key={i} className="border-border space-y-2.5 rounded-xl border p-4">
              <div className="skeleton h-4 w-3/4 rounded-lg" />
              <div className="skeleton h-3.5 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="py-8 text-center text-sm font-medium text-red-500">
          Failed to load announcements.{' '}
          <button onClick={() => refetch()} className="underline hover:text-red-400">
            Try again
          </button>
        </p>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm font-medium">
          No announcements
        </p>
      ) : (
        <div className="space-y-3.5">
          {data?.map((ann: any, i: number) => {
            const config =
              PRIORITY_CONFIG[ann.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.LOW;
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 4 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 25 }}
                className={`rounded-xl border p-4 ${config.bg} group cursor-pointer transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg} flex-shrink-0 transition-transform group-hover:scale-110`}
                  >
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-sm font-bold leading-snug">{ann.title}</p>
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {ann.content}
                    </p>
                    <p className="text-muted-foreground mt-2 text-[10px] font-medium">
                      {formatRelativeTime(ann.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
