'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  LayoutDashboard,
  Rss,
  Megaphone,
  BookOpen,
  FolderOpen,
  Users,
  Award,
  Calendar,
  Settings,
  ChevronLeft,
  Sparkles,
  Building2,
  Images,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/store/notification.store';
import { NewLogo } from '@/components/shared/new-logo';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    gradient: 'from-indigo-500 via-purple-500 to-pink-600',
    color: 'indigo',
  },
  {
    href: '/feed',
    label: 'Feed',
    icon: Rss,
    gradient: 'from-purple-500 via-pink-500 to-rose-600',
    color: 'purple',
  },
  {
    href: '/announcements',
    label: 'Announcements',
    icon: Megaphone,
    badge: true,
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    color: 'yellow',
  },
  {
    href: '/knowledge',
    label: 'Knowledge Hub',
    icon: BookOpen,
    gradient: 'from-green-500 via-emerald-500 to-teal-600',
    color: 'green',
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: FolderOpen,
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    color: 'blue',
  },
  {
    href: '/gallery',
    label: 'Gallery',
    icon: Images,
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    color: 'pink',
  },
  {
    href: '/people',
    label: 'People',
    icon: Users,
    gradient: 'from-purple-500 via-pink-500 to-rose-600',
    color: 'purple',
  },
  {
    href: '/recognition',
    label: 'Recognition',
    icon: Award,
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    color: 'amber',
  },
  {
    href: '/events',
    label: 'Events',
    icon: Calendar,
    gradient: 'from-rose-500 via-pink-500 to-purple-600',
    color: 'rose',
  },
  {
    href: '/admin/moderation',
    label: 'Moderation',
    icon: Shield,
    gradient: 'from-red-500 via-orange-500 to-yellow-600',
    color: 'red',
    adminOnly: true,
  },
];

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="relative flex h-full w-64 flex-col overflow-hidden border-r border-purple-200/20 bg-gradient-to-b from-white via-purple-50/30 to-white backdrop-blur-2xl dark:border-purple-900/20 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950"
    >
      {/* Static background gradient - removed animation for performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-30" />
      {/* Logo */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-purple-200/20 px-4 backdrop-blur-sm dark:border-purple-900/20">
        <Link href="/" className="group flex items-center gap-3" prefetch={true}>
          <NewLogo className="h-9 w-9" />
          <div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-lg font-black text-transparent">
              Workspace
            </span>
            <p className="text-muted-foreground/80 -mt-1 text-[10px] font-medium">
              Connect & Collaborate
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg p-1.5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-hide relative z-10 flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.filter(
          (item) =>
            !item.adminOnly ||
            ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR'].includes(user?.role || ''),
        ).map((item, index) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} prefetch={true}>
              <div
                className={cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-200',
                  isActive
                    ? 'bg-gradient-to-r text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  isActive && item.gradient,
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-r-full bg-white shadow-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative z-10">
                  <item.icon
                    className={cn('h-5 w-5 flex-shrink-0', isActive && 'drop-shadow-lg')}
                  />
                </div>
                <span className="relative z-10 flex-1">{item.label}</span>
                {item.badge && unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 px-1.5 text-[10px] font-bold shadow-lg"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}

        {/* AI Assistant */}
        <div className="border-border/40 relative z-10 mt-4 border-t pt-4">
          <Link href="/ai-assistant" prefetch={true}>
            <div className="text-muted-foreground group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors hover:bg-cyan-400/20 hover:text-cyan-400">
              <div className="relative z-10 flex w-full items-center gap-3">
                <Sparkles className="h-5 w-5" />
                <span className="flex-1">AI Customer Support</span>
                <Badge
                  variant="secondary"
                  className="border-cyan-400/40 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 px-2 py-0.5 text-[10px] font-bold"
                >
                  Smart
                </Badge>
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* User profile */}
      {user && (
        <div className="border-border/40 relative z-10 space-y-2 border-t p-3 backdrop-blur-sm">
          <Link href="/profile" prefetch={true}>
            <div className="hover:bg-accent group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl p-3 transition-colors">
              <div className="relative z-10">
                <Avatar className="ring-border/50 group-hover:ring-primary/60 h-10 w-10 shadow-md ring-2 transition-all">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-xs font-bold text-white">
                    {(() => {
                      const isAdmin = ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR'].includes(user.role);
                      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                      const name = user.displayName || fullName || (isAdmin ? 'Admin' : user.email);
                      return getInitials(name);
                    })()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="relative z-10 min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {(() => {
                    const isAdmin = ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR'].includes(user.role);
                    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                    return user.displayName || fullName || (isAdmin ? 'Admin' : user.email);
                  })()}
                </p>
                <p className="text-muted-foreground/80 truncate text-xs font-medium">
                  {user.jobTitle || user.email}
                </p>
              </div>
              <div className="relative z-10">
                <Settings className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={async () => {
              const { logout } = useAuthStore.getState();
              await logout();
              window.location.href = '/login';
            }}
            className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
