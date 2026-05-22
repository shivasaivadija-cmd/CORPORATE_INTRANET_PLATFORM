'use client';

import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';
import { REACTION_EMOJIS, REACTION_LABELS } from '@/lib/utils';

interface ReactionPickerProps {
  onReact: (type: string) => void;
}

export function ReactionPicker({ onReact }: ReactionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="border-border bg-popover absolute bottom-full left-0 z-50 mb-2 flex items-center gap-1 rounded-full border px-2 py-1.5 shadow-lg"
    >
      {Object.entries(REACTION_EMOJIS).map(([type, emoji], i) => (
        <motion.button
          key={type}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.3, y: -4 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => onReact(type)}
          title={REACTION_LABELS[type]}
          className="p-0.5 text-xl leading-none transition-transform"
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}
