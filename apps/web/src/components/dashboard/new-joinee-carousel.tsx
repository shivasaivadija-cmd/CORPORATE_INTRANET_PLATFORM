'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

export function NewJoineeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: newJoinees, isLoading } = useQuery({
    queryKey: ['new-joinees'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const response = await apiClient.get(`/users?joinedAfter=${thirtyDaysAgo.toISOString()}&limit=10`);
      return response.data.data || [];
    },
  });

  // Auto-rotate carousel
  useEffect(() => {
    if (!newJoinees || newJoinees.length <= 1) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % newJoinees.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [newJoinees]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const handlePrev = () => {
    if (!newJoinees) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + newJoinees.length) % newJoinees.length);
  };

  const handleNext = () => {
    if (!newJoinees) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % newJoinees.length);
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-lg skeleton" />
          <div className="h-4 w-32 rounded skeleton" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full skeleton mb-4" />
          <div className="h-5 w-40 rounded skeleton mb-2" />
          <div className="h-4 w-32 rounded skeleton" />
        </div>
      </div>
    );
  }

  if (!newJoinees || newJoinees.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-3">
          <UserPlus className="h-6 w-6 text-green-500" />
        </div>
        <p className="text-sm text-muted-foreground">No new joiners this month</p>
      </div>
    );
  }

  const currentJoinee = newJoinees[currentIndex];

  return (
    <div className="glass-card rounded-xl p-6 h-full relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500"
          >
            <UserPlus className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold">Welcome New Joiners!</h3>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            disabled={newJoinees.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            disabled={newJoinees.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative h-48 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Avatar with Glow */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <Avatar className="relative h-24 w-24 ring-4 ring-background shadow-2xl">
                <AvatarImage src={currentJoinee.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-2xl font-bold">
                  {getInitials(currentJoinee.displayName)}
                </AvatarFallback>
              </Avatar>
              {/* Sparkle Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-6 w-6 text-yellow-500 drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Info */}
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-center mb-1"
            >
              {currentJoinee.displayName}
            </motion.h4>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground text-center mb-2"
            >
              {currentJoinee.jobTitle || 'New Team Member'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Calendar className="h-3 w-3" />
              Joined {new Date(currentJoinee.createdAt).toLocaleDateString()}
            </motion.div>

            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              className="mt-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow-lg"
            >
              🎉 Welcome to 2coms!
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {newJoinees.length > 1 && (
        <div className="relative flex justify-center gap-1.5 mt-4">
          {newJoinees.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
