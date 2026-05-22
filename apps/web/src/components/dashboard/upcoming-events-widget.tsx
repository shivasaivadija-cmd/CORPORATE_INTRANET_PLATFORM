'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Video } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';

export function UpcomingEventsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () =>
      apiClient.get('/events?status=PUBLISHED&limit=4&upcoming=true').then((r) => r.data.data),
  });

  return (
    <div className="glass-card h-full rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-all">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold">Upcoming Events</h3>
        <Link 
          href="/events" 
          className="text-primary hover:text-primary/80 text-xs font-semibold transition-colors flex items-center gap-1 group"
        >
          <span>View all</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3.5">
              <div className="skeleton h-12 w-12 flex-shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="skeleton h-3 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm font-medium">No upcoming events</p>
      ) : (
        <div className="space-y-3.5">
          {data?.map((event: any, i: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 25 }}
              className="group flex cursor-pointer gap-3.5 p-3 rounded-xl hover:bg-accent/50 transition-all"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-primary/20 shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all"
              >
                <span className="text-[10px] font-bold uppercase leading-none">
                  {format(new Date(event.startAt), 'MMM')}
                </span>
                <span className="text-lg font-black leading-none mt-0.5">
                  {format(new Date(event.startAt), 'd')}
                </span>
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary truncate text-sm font-bold transition-colors mb-1">
                  {event.title}
                </p>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  {event.isVirtual ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                  <span className="truncate">
                    {event.isVirtual ? 'Virtual' : event.location || 'TBD'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
