'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X, ArrowRight, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'post' | 'article' | 'document' | 'person';
  id: string;
  title: string;
  description?: string;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch search history
  const { data: historyData } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const response = await apiClient.get('/search/history');
      return response.data;
    },
    enabled: isOpen,
  });

  // Fetch trending searches
  const { data: trendingData } = useQuery({
    queryKey: ['search-trending'],
    queryFn: async () => {
      const response = await apiClient.get('/search/trending');
      return response.data;
    },
    enabled: isOpen,
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await apiClient.get('/search', { params: { q: searchQuery } });
      return response.data;
    },
  });

  // Save search to history
  const saveSearchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      await apiClient.post('/search/history', { query: searchQuery });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });

  // Delete search history item
  const deleteHistoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/search/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });

  const history = Array.isArray(historyData?.data) ? historyData.data.slice(0, 5) : [];
  const trending = Array.isArray(trendingData?.data) ? trendingData.data.slice(0, 5) : [];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    await saveSearchMutation.mutateAsync(searchQuery);
    await searchMutation.mutateAsync(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all group"
      >
        <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-sm text-muted-foreground hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-background border border-border rounded">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(query);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search for people, posts, documents, knowledge..."
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-lg focus:outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Search Results / Suggestions */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!query && (
                  <div className="space-y-4 p-2">
                    {/* Recent Searches */}
                    {history.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          Recent Searches
                        </div>
                        <div className="space-y-1 mt-2">
                          {history.map((item: any) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => handleSuggestionClick(item.query)}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm truncate">{item.query}</span>
                                {item.resultCount > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.resultCount} results
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteHistoryMutation.mutate(item.id);
                                  }}
                                  className="p-1 hover:bg-background rounded transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    {trending.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </div>
                        <div className="space-y-1 mt-2">
                          {trending.map((item: any, index: number) => (
                            <motion.button
                              key={item.query}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSuggestionClick(item.query)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors group"
                            >
                              <div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-primary">
                                {index + 1}
                              </div>
                              <span className="text-sm flex-1 text-left">{item.query}</span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Quick Actions
                      </div>
                      <div className="space-y-1 mt-2">
                        {[
                          { label: 'View all people', url: '/people', icon: '👥' },
                          { label: 'Browse documents', url: '/documents', icon: '📁' },
                          { label: 'Knowledge hub', url: '/knowledge', icon: '📚' },
                          { label: 'Upcoming events', url: '/events', icon: '📅' },
                        ].map((action) => (
                          <button
                            key={action.url}
                            onClick={() => {
                              router.push(action.url);
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors group"
                          >
                            <span className="text-lg">{action.icon}</span>
                            <span className="text-sm flex-1 text-left">{action.label}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {query && searchMutation.data && (
                  <div className="p-2">
                    {searchMutation.data.data?.length > 0 ? (
                      <div className="space-y-1">
                        {searchMutation.data.data.map((result: SearchResult) => (
                          <button
                            key={result.id}
                            onClick={() => {
                              router.push(result.url);
                              setIsOpen(false);
                            }}
                            className="w-full flex items-start gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{result.title}</div>
                              {result.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {result.description}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {result.type}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No results found for "{query}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Loading State */}
                {query && searchMutation.isPending && (
                  <div className="text-center py-8">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                    <p className="mt-3 text-sm text-muted-foreground">Searching...</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↵</kbd>
                    to search
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">esc</kbd>
                    to close
                  </span>
                </div>
                <span>Powered by AI</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
