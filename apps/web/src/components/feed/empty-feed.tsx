'use client';

import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';

export function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Rss className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1">Nothing here yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Be the first to share something with your team. Posts, updates, and announcements will appear here.
      </p>
    </motion.div>
  );
}
