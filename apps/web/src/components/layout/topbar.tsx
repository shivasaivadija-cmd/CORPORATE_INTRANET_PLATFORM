'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Wifi,
  WifiOff,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from '@/components/shared/notification-panel';
import { useNotificationStore } from '@/store/notification.store';
import { useSocket } from '@/components/providers/socket-provider';
import { cn } from '@/lib/utils';

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenCommand: () => void;
  onCreatePost?: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar, onOpenCommand, onCreatePost }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotificationStore();
  const { isConnected } = useSocket();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="border-border/40 bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-2xl">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
        <button
          onClick={onOpenCommand}
          className="border-border/50 bg-muted/50 text-muted-foreground flex max-w-md flex-1 items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm"
        >
          <Search className="h-4 w-4" />
          <span>Search anything...</span>
          <kbd className="border-border bg-background ml-auto hidden h-6 items-center gap-1 rounded-lg border px-2 text-[10px] font-bold sm:inline-flex">
            <span>⌘</span>K
          </kbd>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-9 w-9" />
          <div className="h-9 w-9" />
          <div className="h-9 w-9" />
        </div>
      </header>
    );
  }

  const themeIcons = { light: Sun, dark: Moon, system: Monitor };
  const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Monitor;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-purple-200/20 bg-gradient-to-r from-white via-purple-50/30 to-white px-4 shadow-sm backdrop-blur-2xl dark:border-purple-900/20 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950">
      {/* Animated gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        animate={{ width: ['0%', '100%', '0%'], x: ['0%', '0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Sidebar toggle */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 rounded-xl transition-all hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Search trigger */}
      <button
        onClick={onOpenCommand}
        className="border-border/50 from-muted/80 to-muted/40 text-muted-foreground hover:border-primary/30 group relative flex max-w-md flex-1 items-center gap-3 overflow-hidden rounded-2xl border bg-gradient-to-r px-4 py-2.5 text-sm backdrop-blur-sm transition-all"
      >
        <Search className="group-hover:text-primary relative z-10 h-4 w-4 transition-colors" />
        <span className="relative z-10 font-medium">Search anything...</span>
        <kbd className="border-border/50 bg-background/80 relative z-10 ml-auto hidden h-6 items-center gap-1 rounded-lg border px-2 text-[10px] font-bold shadow-sm sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* Quick Action Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={onCreatePost}
            className="h-9 gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </motion.div>

        {/* Connection status */}
        <motion.div
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
            isConnected
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 text-red-600 dark:text-red-400',
          )}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isConnected ? (
            <>
              <Wifi className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Offline</span>
            </>
          )}
        </motion.div>

        {/* Theme toggle with dropdown */}
        <div className="group relative">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl transition-all hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10"
              onClick={() =>
                setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')
              }
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeIcon className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Tooltip showing current theme */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 group-hover:pointer-events-auto"
          >
            <div className="whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'} mode
            </div>
          </motion.div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl hover:bg-gradient-to-br hover:from-red-500/10 hover:to-pink-500/10"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
