'use client';

import { useState } from 'react';
import { BookOpen, Search, Plus, MessageSquare, ThumbsUp, Eye, Tag, Calendar, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const { user } = useAuthStore();

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['knowledge', search, selectedCategory],
    queryFn: async () => {
      const response = await apiClient.get('/knowledge', { 
        params: { search, categoryId: selectedCategory, limit: 50 } 
      });
      return response.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['knowledge-categories'],
    queryFn: async () => {
      const response = await apiClient.get('/knowledge/categories');
      return response.data;
    },
  });

  // Safe array access with fallback
  const articles = Array.isArray(articlesData?.data) ? articlesData.data : [];
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground mt-1">Employee handbooks, policies, and important documents</p>
        </div>
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles, policies, handbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 min-w-[200px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {articlesLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading articles...</p>
        </div>
      )}

      {/* Empty State */}
      {!articlesLoading && articles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Articles Grid */}
      {!articlesLoading && articles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {articles.map((article: any) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-card border border-border rounded-xl p-5 hover:border-green-500/50 transition-all cursor-pointer group"
            >
              {article.coverImageUrl && (
                <img 
                  src={article.coverImageUrl} 
                  alt={article.title} 
                  className="w-full h-40 object-cover rounded-lg mb-4" 
                />
              )}
              <h3 className="font-semibold text-lg group-hover:text-green-400 transition-colors mb-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>
              )}
              {Array.isArray(article.tags) && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {article.author?.displayName || 'Unknown'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.viewCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {article._count?.comments || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {selectedArticle.coverImageUrl && (
                <img 
                  src={selectedArticle.coverImageUrl} 
                  alt={selectedArticle.title} 
                  className="w-full h-64 object-cover rounded-xl mb-6" 
                />
              )}
              <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                <span className="flex items-center gap-2">
                  <img 
                    src={selectedArticle.author?.avatarUrl || '/default-avatar.png'} 
                    alt="" 
                    className="w-6 h-6 rounded-full" 
                  />
                  {selectedArticle.author?.displayName || 'Unknown'}
                </span>
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedArticle.viewCount || 0} views
                </span>
              </div>
              <div 
                className="prose prose-invert max-w-none mb-8" 
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} 
              />
              
              {/* Comments Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Discussion ({selectedArticle._count?.comments || 0})
                </h3>
                <div className="space-y-4">
                  <textarea
                    placeholder="Share your thoughts or ask a question..."
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Post Comment
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
