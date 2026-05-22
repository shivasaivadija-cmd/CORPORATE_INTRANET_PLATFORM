'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { CommandPalette } from '@/components/shared/command-palette';
import { CreatePostModal } from '@/components/shared/create-post-modal';
import { FloatingActionButton } from '@/components/shared/floating-action-button';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  useKeyboardShortcut(['meta+k', 'ctrl+k'], () => setCommandOpen(true));

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-white dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      {/* Animated mesh background */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-40" />

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={false}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-20 flex-shrink-0"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCommand={() => setCommandOpen(true)}
          onCreatePost={() => setCreatePostOpen(true)}
        />
        <main className="scrollbar-thin flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Create Post Modal — rendered at layout level for correct stacking context */}
      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} />

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
