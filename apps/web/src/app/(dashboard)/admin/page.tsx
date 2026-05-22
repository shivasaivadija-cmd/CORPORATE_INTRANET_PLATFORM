'use client';

import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, Activity, Shield, Settings, BarChart3, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.data?.totalUsers || '156',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Active Posts',
      value: stats?.data?.totalPosts || '1,234',
      change: '+8%',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
    {
      title: 'Engagement Rate',
      value: stats?.data?.engagementRate || '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
    },
    {
      title: 'System Health',
      value: stats?.data?.systemHealth || '99.9%',
      change: 'Stable',
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Content Moderation',
      description: 'Review and moderate user content',
      icon: Shield,
      href: '/admin/moderation',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Analytics',
      description: 'View detailed platform analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'created a new post', time: '2 minutes ago' },
    { user: 'Marcus Rodriguez', action: 'uploaded a document', time: '15 minutes ago' },
    { user: 'Admin', action: 'updated system settings', time: '1 hour ago' },
    { user: 'Emily Watson', action: 'joined the platform', time: '2 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Platform administration and management</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link
                href={action.href}
                className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            System Alerts
          </h2>
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">All Systems Operational</p>
                  <p className="text-xs text-muted-foreground mt-1">No issues detected</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Database Backup Completed</p>
                  <p className="text-xs text-muted-foreground mt-1">Last backup: 2 hours ago</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Scheduled Maintenance</p>
                  <p className="text-xs text-muted-foreground mt-1">Planned for next Sunday at 2 AM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
