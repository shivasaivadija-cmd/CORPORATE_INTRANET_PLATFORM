import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Notification } from '@intranet/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[], unreadCount: number) => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  immer((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
      set((s) => {
        s.notifications.unshift(notification);
        if (!notification.isRead) s.unreadCount += 1;
      });
    },

    markAsRead: (id) => {
      set((s) => {
        const notif = s.notifications.find((n) => n.id === id);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      });
    },

    markAllAsRead: () => {
      set((s) => {
        s.notifications.forEach((n) => { n.isRead = true; });
        s.unreadCount = 0;
      });
    },

    setNotifications: (notifications, unreadCount) => {
      set((s) => {
        s.notifications = notifications;
        s.unreadCount = unreadCount;
      });
    },
  })),
);
