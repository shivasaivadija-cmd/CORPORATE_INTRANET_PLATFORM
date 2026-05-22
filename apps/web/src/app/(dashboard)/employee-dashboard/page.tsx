'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  MessageSquare,
  Award,
  Calendar,
  Lightbulb,
  Users,
  Clock,
} from 'lucide-react';
import { AiDigestCard } from '@/components/dashboard/ai-digest-card';
import { AnnouncementWidget } from '@/components/dashboard/announcement-widget';
import { QuickStatsWidget } from '@/components/dashboard/quick-stats-widget';
import { NewJoineeCarousel } from '@/components/dashboard/new-joinee-carousel';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

export default function EmployeeDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !user)) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || !user) {
    return <DashboardSkeleton />;
  }

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
    <div className="w-full h-full">
      <div className="mx-auto max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
        {/* Header with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl lg:text-5xl xl:text-6xl">{getEmoji()}</span>
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent"
              >
                {greeting()}, {user?.firstName}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-2 flex items-center gap-2 text-sm sm:text-base lg:text-lg"
              >
                <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-cyan-500" />
                Here's what's happening at 2coms today
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - AI & Announcements */}
          <div className="space-y-6 lg:space-y-8 xl:col-span-2">
            {/* AI Digest */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AiDigestCard />
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnnouncementWidget />
            </motion.div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6 lg:space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuickStatsWidget />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
            >
              <h3 className="mb-4 lg:mb-6 flex items-center gap-2 text-base lg:text-lg font-semibold">
                <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-3 lg:space-y-4">
                {[
                  { icon: MessageSquare, label: 'New Post', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: Award, label: 'Give Kudos', gradient: 'from-purple-500 to-pink-500' },
                  { icon: Calendar, label: 'View Events', gradient: 'from-green-500 to-emerald-500' },
                  { icon: Lightbulb, label: 'Share Idea', gradient: 'from-yellow-500 to-orange-500' },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 lg:p-4 text-left transition-all hover:bg-white/10"
                  >
                    <div className={`rounded-lg bg-gradient-to-r p-2 lg:p-2.5 ${action.gradient}`}>
                      <action.icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                    </div>
                    <span className="text-sm lg:text-base font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Team & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* New Team Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <NewJoineeCarousel />
          </motion.div>

          {/* Your Recognition & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
          >
            <h3 className="mb-4 lg:mb-6 flex items-center gap-2 text-base lg:text-lg font-semibold">
              <Award className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-500" />
              Your Recognition
            </h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 lg:p-5">
                <p className="text-sm lg:text-base font-medium">⭐ You've received 5 kudos this month!</p>
                <p className="text-muted-foreground mt-1 text-xs lg:text-sm">Keep up the great work!</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 lg:p-5">
                <p className="text-sm lg:text-base font-medium">🎯 You're in the top 10% of contributors</p>
                <p className="text-muted-foreground mt-1 text-xs lg:text-sm">Excellent engagement!</p>
              </div>
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 lg:p-5">
                <p className="text-sm lg:text-base font-medium">🔥 3-day posting streak!</p>
                <p className="text-muted-foreground mt-1 text-xs lg:text-sm">Keep sharing your ideas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
        >
          <h3 className="mb-4 lg:mb-6 flex items-center gap-2 text-base lg:text-lg font-semibold">
            <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-cyan-500" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                title: 'Team Standup',
                time: 'Today at 10:00 AM',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Quarterly Review',
                time: 'Tomorrow at 2:00 PM',
                icon: Clock,
                color: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Company All-Hands',
                time: 'Friday at 4:00 PM',
                icon: Sparkles,
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((event, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-4 lg:p-5 transition-all hover:bg-white/10"
              >
                <div
                  className={`h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-gradient-to-br ${event.color} mb-3 lg:mb-4 flex items-center justify-center`}
                >
                  <event.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <p className="text-sm lg:text-base font-medium">{event.title}</p>
                <p className="text-muted-foreground mt-1 text-xs lg:text-sm">{event.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
