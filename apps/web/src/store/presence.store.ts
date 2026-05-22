import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PresenceState {
  presenceMap: Record<string, { status: string; lastSeenAt: string | null }>;
}

interface PresenceActions {
  updatePresence: (userId: string, status: string, lastSeenAt: string) => void;
  getPresence: (userId: string) => { status: string; lastSeenAt: string | null };
}

export const usePresenceStore = create<PresenceState & PresenceActions>()(
  immer((set, get) => ({
    presenceMap: {},

    updatePresence: (userId, status, lastSeenAt) => {
      set((s) => {
        s.presenceMap[userId] = { status, lastSeenAt };
      });
    },

    getPresence: (userId) => {
      return get().presenceMap[userId] || { status: 'OFFLINE', lastSeenAt: null };
    },
  })),
);
