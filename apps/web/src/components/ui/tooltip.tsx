'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, side = 'top', delay = 0.2 }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    left: 'left-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
    right: 'right-full top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-none absolute z-50 ${positionClasses[side]}`}
          >
            <div className="relative">
              <div className="whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-50 shadow-lg dark:bg-slate-50 dark:text-slate-950">
                {content}
              </div>
              <div
                className={`absolute h-1.5 w-1.5 bg-slate-950 dark:bg-slate-50 ${arrowPositions[side]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
