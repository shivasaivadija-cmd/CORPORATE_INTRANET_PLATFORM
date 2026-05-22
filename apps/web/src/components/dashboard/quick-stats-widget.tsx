'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, FileText, Award, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const STATS = [
  {
    key: 'employees',
    label: 'Employees',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'posts',
    label: 'Posts Today',
    icon: FileText,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    key: 'recognitions',
    label: 'Kudos Given',
    icon: Award,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    key: 'engagement',
    label: 'Engagement',
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export function QuickStatsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () =>
      apiClient
        .get('/admin/stats')
        .then((r) => r.data.data)
        .catch(() => ({
          employees: 0,
          posts: 0,
          recognitions: 0,
          engagement: '0%',
        })),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="glass-card h-full rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-all">
      <h3 className="mb-5 text-sm font-bold">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-3.5">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 25 }}
            className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/30 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.bg} mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            {isLoading ? (
              <div className="skeleton mb-1.5 h-6 w-14 rounded-lg" />
            ) : (
              <p className="text-xl font-black leading-none mb-1">{data?.[stat.key] ?? '—'}</p>
            )}
            <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
