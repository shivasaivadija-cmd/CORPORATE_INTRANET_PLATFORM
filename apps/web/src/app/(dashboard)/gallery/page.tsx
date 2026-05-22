'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon, Video, Grid3x3, List, X, Download, Share2, Heart, Calendar, User, Play } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'images' | 'videos';

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const { data: media, isLoading } = useQuery({
    queryKey: ['gallery', filter],
    queryFn: async () => {
      const types = filter === 'all' ? 'image,video' : filter === 'images' ? 'image' : 'video';
      const response = await apiClient.get(`/documents?type=${types}&limit=100`);
      return response.data.data || [];
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Media Gallery
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Office events, celebrations, and memorable moments
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              <List className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Media', icon: Grid3x3 },
            { key: 'images', label: 'Images', icon: ImageIcon },
            { key: 'videos', label: 'Videos', icon: Video },
          ].map((item) => (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(item.key as FilterType)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                filter === item.key
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl skeleton" />
          ))}
        </div>
      ) : media?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 mb-4">
            <ImageIcon className="h-10 w-10 text-pink-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No media yet</h3>
          <p className="text-muted-foreground">Upload images and videos to see them here</p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {media?.map((item: any) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-muted"
              onClick={() => setSelectedMedia(item)}
            >
              {/* Media Preview */}
              {item.mimeType?.startsWith('image/') ? (
                <img
                  src={item.url || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Play className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-sm truncate mb-1">{item.name}</p>
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                {item.mimeType?.startsWith('image/') ? (
                  <ImageIcon className="h-3 w-3 text-white" />
                ) : (
                  <Video className="h-3 w-3 text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {media?.map((item: any) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 4 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.mimeType?.startsWith('image/') ? (
                  <img src={item.url || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Play className="h-8 w-8 text-purple-500" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.uploadedBy?.displayName || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Type Badge */}
              <div className="flex items-center gap-2">
                {item.mimeType?.startsWith('image/') ? (
                  <div className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 text-xs font-medium">
                    Image
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-500 text-xs font-medium">
                    Video
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* Media */}
              <div className="rounded-2xl overflow-hidden bg-black">
                {selectedMedia.mimeType?.startsWith('image/') ? (
                  <img
                    src={selectedMedia.url || '/placeholder.jpg'}
                    alt={selectedMedia.name}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[80vh]"
                  />
                )}
              </div>

              {/* Info Bar */}
              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMedia.name}</h3>
                  <p className="text-sm text-white/60 mt-1">
                    Uploaded on {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
