'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  User,
  FileText,
  BookOpen,
  Calendar,
  Megaphone,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

const TYPE_ICONS: Record<string, React.ElementType> = {
  USER: User,
  POST: FileText,
  ARTICLE: BookOpen,
  DOCUMENT: FileText,
  EVENT: Calendar,
  ANNOUNCEMENT: Megaphone,
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => apiClient.get(`/search?q=${debouncedQuery}`).then((r) => r.data),
    enabled: debouncedQuery.length >= 2,
  });

  const allResults = data
    ? [
        ...data.users.map((r: any) => ({ ...r, type: 'USER' })),
        ...data.posts.map((r: any) => ({ ...r, type: 'POST' })),
        ...data.articles.map((r: any) => ({ ...r, type: 'ARTICLE' })),
        ...data.documents.map((r: any) => ({ ...r, type: 'DOCUMENT' })),
        ...data.events.map((r: any) => ({ ...r, type: 'EVENT' })),
      ]
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults.length]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelectedIndex((i) => Math.min(i + 1, allResults.length - 1));
      if (e.key === 'ArrowUp') setSelectedIndex((i) => Math.max(i - 1, 0));
      if (e.key === 'Enter' && allResults[selectedIndex]) {
        router.push(allResults[selectedIndex].url);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, allResults, selectedIndex, router, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2">
        <div className="border-border bg-popover overflow-hidden rounded-2xl border shadow-2xl">
          {/* Search input */}
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            {isLoading ? (
              <Loader2 className="text-muted-foreground h-4 w-4 flex-shrink-0 animate-spin" />
            ) : (
              <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            )}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, posts, documents, events..."
              className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
            />
            <kbd className="border-border bg-muted text-muted-foreground hidden h-5 items-center rounded border px-1.5 text-[10px] sm:flex">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="scrollbar-thin max-h-80 overflow-y-auto py-2">
            {query.length < 2 ? (
              <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                Type to search across your organization
              </div>
            ) : allResults.length === 0 && !isLoading ? (
              <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                No results for "{query}"
              </div>
            ) : (
              allResults.map((result: any, i) => {
                const Icon = TYPE_ICONS[result.type] || FileText;
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      router.push(result.url);
                      onClose();
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50',
                    )}
                  >
                    <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                      <Icon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{result.title}</p>
                      {result.excerpt && (
                        <p className="text-muted-foreground truncate text-xs">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
                        {result.type}
                      </span>
                      <ArrowRight className="text-muted-foreground h-3 w-3" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-border text-muted-foreground flex items-center gap-4 border-t px-4 py-2 text-[10px]">
            <span className="flex items-center gap-1">
              <kbd className="border-border rounded border px-1">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border-border rounded border px-1">↵</kbd> open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border-border rounded border px-1">ESC</kbd> close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
