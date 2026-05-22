'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { AiDigestCard } from './ai-digest-card';
import { AnnouncementWidget } from './announcement-widget';
import { QuickStatsWidget } from './quick-stats-widget';
import { NewJoineeCarousel } from './new-joinee-carousel';

export function DashboardPage() {
  const { user } = useAuthStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 17) return '👋';
    return '🌙';
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getEmoji()}</span>
          <div>
            <h1 className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              {greeting()}, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-cyan-500" />
              Here's what's happening at 2coms today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Simplified Grid - 4 Key Widgets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Digest - spans 2 cols */}
        <div className="lg:col-span-2">
          <AiDigestCard />
        </div>

        {/* Quick Stats */}
        <QuickStatsWidget />

        {/* New Joinee Carousel */}
        <NewJoineeCarousel />

        {/* Announcements - spans 2 cols */}
        <div className="lg:col-span-2">
          <AnnouncementWidget />
        </div>
      </div>
    </div>
  );
}
