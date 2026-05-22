'use client';

import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { apiClient } from '@/lib/api-client';
import { useNotificationStore } from '@/store/notification.store';
import { formatRelativeTime } from '@/lib/utils';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markAllAsRead } = useNotificationStore();
  const queryClient = useQueryClient();

  const markAll = useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all'),
    onSuccess: () => markAllAsRead(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="border-border bg-popover absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-xl"
    >
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-semibold">Notifications</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Mark all as read" side="bottom">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-xs"
              onClick={() => markAll.mutate()}
            >
              <CheckCheck className="h-3 w-3" />
              All read
            </Button>
          </Tooltip>
          <Tooltip content="Close notifications" side="bottom">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="scrollbar-thin max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center text-sm">
            You're all caught up! 🎉
          </div>
        ) : (
          notifications.slice(0, 20).map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
              className={`border-border/50 hover:bg-accent/50 flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
            >
              {!notif.isRead && (
                <div className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              )}
              <div className={`min-w-0 flex-1 ${notif.isRead ? 'pl-3.5' : ''}`}>
                <p className="text-xs font-medium leading-snug">{notif.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{notif.body}</p>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  {formatRelativeTime(notif.createdAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
