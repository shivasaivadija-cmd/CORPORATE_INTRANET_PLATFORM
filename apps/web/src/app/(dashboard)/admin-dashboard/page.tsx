'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  Settings,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Database,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || !user) {
        router.replace('/login');
      } else if (user.role !== 'TENANT_ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.replace('/employee-dashboard');
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'TENANT_ADMIN' && user.role !== 'SUPER_ADMIN') {
    return null;
  }

  const adminMetrics = [
    {
      icon: Users,
      label: 'Total Users',
      value: '1,234',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      label: 'Active Posts',
      value: '5,678',
      change: '+23%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      label: 'Engagement Rate',
      value: '78.3%',
      change: '+5%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ShieldAlert,
      label: 'Flagged Content',
      value: '12',
      change: '-3',
      color: 'from-red-500 to-orange-500',
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-[1920px] space-y-6 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
                Welcome, {user?.firstName}! Manage your organization from here.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 opacity-60 blur" />
              <Button
                className="relative rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3"
                onClick={() => router.push('/admin')}
              >
                <Settings className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Go to Admin Panel
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {adminMetrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 transition-opacity group-hover:opacity-10`}
              />

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <metric.icon
                      className={`h-5 w-5 lg:h-6 lg:w-6 bg-gradient-to-r text-transparent ${metric.color} bg-clip-text`}
                    />
                    <p className="text-muted-foreground text-sm lg:text-base">{metric.label}</p>
                  </div>
                  <p className="text-2xl lg:text-3xl xl:text-4xl font-bold">{metric.value}</p>
                  <p
                    className={`mt-2 text-xs lg:text-sm ${metric.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {metric.change} from last month
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
        >
          {[
            {
              icon: Users,
              title: 'User Management',
              description: 'Manage users, roles, and permissions',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Database,
              title: 'Content Moderation',
              description: 'Review and moderate flagged content',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              description: 'View detailed engagement analytics',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: FileText,
              title: 'System Settings',
              description: 'Configure system-wide settings',
              color: 'from-yellow-500 to-orange-500',
            },
            {
              icon: AlertCircle,
              title: 'System Alerts',
              description: 'View and manage system alerts',
              color: 'from-red-500 to-pink-500',
            },
            {
              icon: ShieldAlert,
              title: 'Security',
              description: 'Manage security and compliance',
              color: 'from-indigo-500 to-purple-500',
            },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity group-hover:opacity-20`}
              />

              <div className="relative">
                <div
                  className={`h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-gradient-to-br ${action.color} mb-4 lg:mb-5 flex items-center justify-center`}
                >
                  <action.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="mb-2 text-base lg:text-lg font-semibold">{action.title}</h3>
                <p className="text-muted-foreground text-sm lg:text-base">{action.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl"
        >
          <h2 className="mb-6 lg:mb-8 text-xl lg:text-2xl font-bold">System Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <p className="text-muted-foreground mb-2 text-sm lg:text-base">API Status</p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 lg:h-4 lg:w-4 animate-pulse rounded-full bg-green-500" />
                <p className="text-base lg:text-lg font-semibold">Operational</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm lg:text-base">Database Status</p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 lg:h-4 lg:w-4 animate-pulse rounded-full bg-green-500" />
                <p className="text-base lg:text-lg font-semibold">Connected</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm lg:text-base">System Load</p>
              <p className="text-base lg:text-lg font-semibold">42% CPU, 65% Memory</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
