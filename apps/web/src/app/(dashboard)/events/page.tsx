'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Video, Clock, Plus, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';

export default function EventsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      const { data } = await apiClient.get('/events');
      return data.data;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStatus = (startAt: string) => {
    const now = new Date();
    const start = new Date(startAt);
    return start > now ? 'upcoming' : 'past';
  };

  const filteredEvents = Array.isArray(events) ? events.filter((event: any) => {
    if (filter === 'all') return true;
    return getEventStatus(event.startAt) === filter;
  }) : [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-500" />
            Events
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Upcoming company events and activities</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-semibold">
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'upcoming', label: 'Upcoming', icon: Calendar },
          { key: 'all', label: 'All Events', icon: Calendar },
          { key: 'past', label: 'Past', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
              filter === key
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                : 'bg-card border border-border hover:border-blue-500/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event: any, index: number) => {
            const isUpcoming = getEventStatus(event.startAt) === 'upcoming';
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card border rounded-2xl p-6 hover:shadow-lg transition-all ${
                  isUpcoming
                    ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5'
                    : 'border-border hover:border-blue-500/30'
                }`}
              >
                <div className="flex gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-2xl font-bold">
                        {new Date(event.startAt).getDate()}
                      </span>
                      <span className="text-xs uppercase">
                        {new Date(event.startAt).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                        <p className="text-foreground/80 leading-relaxed">{event.description}</p>
                      </div>
                      {isUpcoming && (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-sm font-semibold rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>

                    {/* Event Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{formatDate(event.startAt)} at {formatTime(event.startAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {event.isVirtual ? (
                          <>
                            <Video className="w-4 h-4 text-cyan-500" />
                            <span>Virtual Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      {event.organizer && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>Organized by {event.organizer.displayName}</span>
                        </div>
                      )}
                      {event._count?.attendees !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>{event._count.attendees} attending</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {Array.isArray(event.tags) && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {event.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* RSVP Buttons */}
                    {isUpcoming && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                        <button className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-2 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Attending
                        </button>
                        <button className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center gap-2 text-sm font-medium">
                          <HelpCircle className="w-4 h-4" />
                          Maybe
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Can't Attend
                        </button>
                        {event.isVirtual && event.meetingUrl && (
                          <a
                            href={event.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20 animate-pulse" />
            <div className="relative flex items-center justify-center w-full h-full">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
          <p className="text-muted-foreground">Check back later for upcoming events</p>
        </div>
      )}
    </div>
  );
}
