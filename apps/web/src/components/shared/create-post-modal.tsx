'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Smile, AtSign, Hash, Send } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    // TODO: Implement API call
    setTimeout(() => {
      setIsSubmitting(false);
      setContent('');
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal — rendered at z-[201] above everything including sidebar/topbar */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/60 relative w-full max-w-lg rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <h2 className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                  Create Post
                </h2>
                <button
                  onClick={onClose}
                  className="hover:bg-muted rounded-lg p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 p-5">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="ring-border/30 h-9 w-9 ring-2">
                    <AvatarImage src={user?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-xs font-semibold text-white">
                      {getInitials(user?.displayName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user?.displayName}</p>
                    <p className="text-muted-foreground text-xs">{user?.jobTitle}</p>
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="border-border bg-background focus:ring-primary/40 h-28 w-full resize-none rounded-xl border p-3 text-sm focus:outline-none focus:ring-2"
                  autoFocus
                />

                {/* Toolbar */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">
                    <Image className="mr-1.5 h-3.5 w-3.5" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">
                    <Smile className="mr-1.5 h-3.5 w-3.5" />
                    Emoji
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">
                    <Hash className="mr-1.5 h-3.5 w-3.5" />
                    Tag
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">
                    <AtSign className="mr-1.5 h-3.5 w-3.5" />
                    Mention
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-muted/30 border-border/50 flex items-center justify-end gap-2 rounded-b-2xl border-t px-5 py-3">
                <Button variant="ghost" onClick={onClose} className="h-8 rounded-lg px-4 text-sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="h-8 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-5 text-sm font-semibold hover:shadow-lg hover:shadow-primary/30"
                >
                  {isSubmitting ? 'Posting...' : <><Send className="mr-1.5 h-3.5 w-3.5" />Post</>}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
