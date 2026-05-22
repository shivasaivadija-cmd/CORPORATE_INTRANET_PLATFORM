'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Megaphone, Pin, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await apiClient.get('/announcements');
      return data.data;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
          <Megaphone className="w-10 h-10 text-orange-500" />
          Announcements
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Stay updated with important company news</p>
      </div>

      {/* Announcements List */}
      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement: any, index: number) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card border rounded-2xl p-6 hover:shadow-lg transition-all ${
                announcement.isPinned
                  ? 'border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-red-500/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        announcement.priority === 'HIGH'
                          ? 'bg-red-500/10 text-red-500'
                          : announcement.priority === 'MEDIUM'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {announcement.priority}
                    </span>
                    {announcement.requiresAck && (
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Action Required
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{announcement.title}</h2>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-4 leading-relaxed">{announcement.content}</p>

              {/* Footer */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{announcement.author?.displayName || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {announcement.publishedAt ? formatDate(announcement.publishedAt) : 'Recently'}
                  </span>
                </div>
                {announcement.requiresAck && (
                  <button className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Acknowledge
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full opacity-20 animate-pulse" />
            <div className="relative flex items-center justify-center w-full h-full">
              <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Announcements Yet</h3>
          <p className="text-muted-foreground">Check back later for important updates</p>
        </div>
      )}
    </div>
  );
}
