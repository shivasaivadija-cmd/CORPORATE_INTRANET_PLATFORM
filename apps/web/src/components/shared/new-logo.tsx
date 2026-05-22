'use client';

import { motion } from 'framer-motion';

export function NewLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main logo container */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="h-full w-full" viewBox="0 0 40 40">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="40" height="40" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Center icon - stylized conversation bubble with people */}
        <motion.svg
          className="relative h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Main chat bubble */}
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            fill="currentColor"
            opacity="0.1"
          />
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />

          {/* Two small circles representing people/conversation */}
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
        </motion.svg>
      </div>
    </motion.div>
  );
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-2.5">
      <NewLogo className="h-10 w-10" />
      <div>
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-lg font-black text-transparent">
          Workspace
        </div>
        <p className="text-muted-foreground -mt-1 text-[10px] font-semibold">
          Connect & Collaborate
        </p>
      </div>
    </div>
  );
}
