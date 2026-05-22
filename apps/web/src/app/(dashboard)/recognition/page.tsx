'use client';

import { useState } from 'react';
import { Award, Trophy, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';

export default function RecognitionPage() {
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: recognitions } = useQuery({
    queryKey: ['recognitions'],
    queryFn: () => api.get('/recognition'),
  });

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/recognition/badges'),
  });

  const { data: users } = useQuery({
    queryKey: ['users-all'],
    queryFn: () => api.get('/users', { params: { limit: 100 } }),
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/users/leaderboard', { params: { limit: 10 } }),
  });

  const giveMutation = useMutation({
    mutationFn: (data: any) => api.post('/recognition', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recognitions'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      setShowGiveModal(false);
      setSelectedBadge(null);
      setReceiverId('');
      setMessage('');
    },
  });

  const handleGive = () => {
    if (!selectedBadge || !receiverId || !message) return;
    giveMutation.mutate({ badgeId: selectedBadge.id, receiverId, message, isPublic: true });
  };

  const badgeColors: Record<string, string> = {
    PERFORMANCE: 'from-blue-500 to-cyan-500',
    COLLABORATION: 'from-green-500 to-emerald-500',
    INNOVATION: 'from-purple-500 to-pink-500',
    LEADERSHIP: 'from-amber-500 to-orange-500',
    CULTURE: 'from-rose-500 to-red-500',
    MILESTONE: 'from-indigo-500 to-violet-500',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 bg-clip-text text-transparent">Recognition Wall</h1>
          <p className="text-muted-foreground mt-1">Celebrate achievements and appreciate your colleagues</p>
        </div>
        <button
          onClick={() => setShowGiveModal(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2"
        >
          <Award className="w-4 h-4" />
          Give Recognition
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {Array.isArray(recognitions?.data) && recognitions.data.length > 0 ? (
            recognitions.data.map((rec: any) => (
              <div
                key={rec.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-amber-500/50 transition-all"
              >
                <div className="flex gap-4">
                  <img src={rec.giver.avatarUrl || '/default-avatar.png'} alt={rec.giver.displayName} className="w-11 h-11 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-sm">{rec.giver.displayName}</span>
                      <span className="text-muted-foreground text-sm">recognized</span>
                      <span className="font-semibold text-amber-400 text-sm">{rec.receiver.displayName}</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${badgeColors[rec.badge.category]} rounded-lg text-white text-sm mb-2`}>
                      <Award className="w-3.5 h-3.5" />
                      <span>{rec.badge.name}</span>
                      <span className="text-xs opacity-75">+{rec.points}</span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-2">{rec.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <img src={rec.receiver.avatarUrl || '/default-avatar.png'} alt={rec.receiver.displayName} className="w-11 h-11 rounded-full ring-2 ring-amber-500/50 flex-shrink-0" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No recognitions yet. Be the first to appreciate someone!</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-500/20 rounded-xl p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {Array.isArray(leaderboard?.data) && leaderboard.data.length > 0 ? (
                leaderboard.data.map((user: any, i: number) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full ${i < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-muted'} text-white text-xs font-bold flex-shrink-0`}>
                      {i + 1}
                    </div>
                    <img src={user.avatarUrl || '/default-avatar.png'} alt={user.displayName} className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.jobTitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-amber-400">{user.recognitionPoints || 0}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No leaderboard data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGiveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Give Recognition</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Colleague</label>
                  <select
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="">Choose someone...</option>
                    {users?.data?.filter((u: any) => u.id !== user?.id).map((u: any) => (
                      <option key={u.id} value={u.id}>{u.displayName} - {u.jobTitle}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Badge</label>
                  <div className="grid grid-cols-2 gap-3">
                    {badges?.data?.map((badge: any) => (
                      <button
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedBadge?.id === badge.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-border hover:border-amber-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-sm">{badge.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <span className="text-xs text-amber-400 mt-1 block">+{badge.points} points</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share why this person deserves recognition..."
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowGiveModal(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGive}
                    disabled={!selectedBadge || !receiverId || !message || giveMutation.isPending}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {giveMutation.isPending ? 'Sending...' : 'Send Recognition'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
