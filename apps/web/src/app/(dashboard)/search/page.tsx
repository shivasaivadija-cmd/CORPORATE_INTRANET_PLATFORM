'use client';

import { useState } from 'react';
import { Search, FileText, Users, Calendar, Award, Megaphone, Folder, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

type SearchFilter = 'all' | 'posts' | 'people' | 'articles' | 'events' | 'documents';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  useState(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, filter],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const response = await apiClient.get('/search', {
        params: { q: debouncedQuery, type: filter !== 'all' ? filter : undefined }
      });
      return response.data;
    },
    enabled: debouncedQuery.length > 0,
  });

  const filters = [
    { key: 'all', label: 'All', icon: Search },
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'people', label: 'People', icon: Users },
    { key: 'articles', label: 'Articles', icon: FileText },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'documents', label: 'Documents', icon: Folder },
  ];

  const trendingSearches = [
    'Company policies',
    'Team building',
    'Benefits',
    'IT support',
    'Holiday schedule',
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Search
        </h1>
        <p className="text-muted-foreground">Find posts, people, articles, events, and more</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-lg transition-all"
          autoFocus
        />
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {filters.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(item.key as SearchFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              filter === item.key
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-card border border-border hover:border-primary/50'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* Results */}
      {!query ? (
        <div className="space-y-6">
          {/* Trending Searches */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <motion.button
                  key={term}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/50 transition-all text-sm"
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Searches
            </h2>
            <div className="text-muted-foreground text-sm">No recent searches</div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Searching...</p>
        </div>
      ) : !results || (Array.isArray(results.data) && results.data.length === 0) ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">Try different keywords or filters</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {Array.isArray(results.data) ? results.data.length : 0} results for "{query}"
          </p>
          {Array.isArray(results.data) && results.data.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Icon/Avatar */}
                {item.type === 'user' ? (
                  <Avatar className="w-12 h-12 ring-2 ring-border/30">
                    <AvatarImage src={item.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(item.displayName || '')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {item.type === 'post' && <FileText className="w-6 h-6 text-primary" />}
                    {item.type === 'article' && <FileText className="w-6 h-6 text-green-500" />}
                    {item.type === 'event' && <Calendar className="w-6 h-6 text-orange-500" />}
                    {item.type === 'document' && <Folder className="w-6 h-6 text-blue-500" />}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">
                    {item.title || item.displayName || item.name}
                  </h3>
                  {item.content && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.content}
                    </p>
                  )}
                  {item.jobTitle && (
                    <p className="text-sm text-muted-foreground mb-2">{item.jobTitle}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium capitalize">
                      {item.type}
                    </span>
                    {item.createdAt && (
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
