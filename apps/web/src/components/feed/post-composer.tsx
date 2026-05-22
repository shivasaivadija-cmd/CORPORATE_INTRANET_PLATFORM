'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, BarChart2, Globe, Users, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';
import { getInitials, cn } from '@/lib/utils';
import { toast } from 'sonner';

export function PostComposer() {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'DEPARTMENT'>('PUBLIC');
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "What's on your mind? Share an update..." }),
    ],
    editorProps: {
      attributes: { 
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-1',
        style: 'min-height: 80px;'
      },
    },
    immediatelyRender: false,
  });

  const createPost = useMutation({
    mutationFn: (data: { content: string; visibility: string }) =>
      apiClient.post('/feed/posts', data),
    onSuccess: () => {
      editor?.commands.clearContent();
      setIsExpanded(false);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('🎉 Post shared successfully!');
    },
    onError: () => toast.error('Failed to share post. Please try again.'),
  });

  const handleSubmit = () => {
    const content = editor?.getText().trim();
    if (!content) {
      toast.error('Please write something before posting');
      return;
    }
    createPost.mutate({ content: editor!.getHTML(), visibility });
  };

  const handleCancel = () => {
    setIsExpanded(false);
    editor?.commands.clearContent();
  };

  if (!user) return null;

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md"
    >
      <div className="flex gap-4">
        <Avatar className="h-11 w-11 flex-shrink-0 ring-2 ring-border/30">
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-bold">
            {getInitials(user.displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'rounded-xl border transition-all duration-300 cursor-text',
              isExpanded 
                ? 'bg-background border-primary/40 shadow-lg ring-4 ring-primary/10 p-4' 
                : 'bg-muted/40 border-border/50 hover:border-primary/30 hover:bg-muted/60 p-3',
            )}
            onClick={() => { 
              setIsExpanded(true); 
              setTimeout(() => editor?.commands.focus(), 100);
            }}
          >
            <EditorContent editor={editor} />
          </div>

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl transition-all"
                    >
                      <Image className="h-4 w-4" />
                      Photo
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl transition-all"
                    >
                      <BarChart2 className="h-4 w-4" />
                      Poll
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVisibility(visibility === 'PUBLIC' ? 'DEPARTMENT' : 'PUBLIC')}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                        visibility === 'PUBLIC' 
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
                      )}
                    >
                      {visibility === 'PUBLIC' ? <Globe className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      {visibility === 'PUBLIC' ? 'Everyone' : 'Department'}
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs font-medium rounded-xl hover:bg-muted"
                      onClick={handleCancel}
                      disabled={createPost.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-9 px-5 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:shadow-lg hover:shadow-primary/40 transition-all"
                      onClick={handleSubmit}
                      disabled={createPost.isPending || !editor?.getText().trim()}
                    >
                      {createPost.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Share Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
