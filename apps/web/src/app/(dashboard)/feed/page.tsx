import type { Metadata } from 'next';
import { FeedList } from '@/components/feed/feed-list';

export const metadata: Metadata = { title: 'Feed' };

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Company Feed</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Stay updated with what's happening</p>
      </div>
      <FeedList />
    </div>
  );
}
