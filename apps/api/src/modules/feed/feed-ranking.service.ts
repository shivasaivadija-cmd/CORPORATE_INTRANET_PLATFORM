import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedRankingService {
  /**
   * Engagement-based feed ranking algorithm
   * Score = recency_score * engagement_multiplier * relevance_boost
   */
  rank(posts: any[], userId: string): any[] {
    const now = Date.now();

    const scored = posts.map((post) => {
      const ageHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      const recencyScore = Math.exp(-ageHours / 48); // decay over 48h

      const totalReactions = Object.values(post.reactionCounts || {}).reduce(
        (sum: number, v: any) => sum + (v || 0),
        0,
      ) as number;

      const engagementScore =
        totalReactions * 1.0 +
        (post.commentCount || 0) * 2.0 +
        (post.bookmarkCount || 0) * 1.5 +
        (post.viewCount || 0) * 0.1;

      const pinnedBoost = post.isPinned ? 10 : 0;
      const authorBoost = post.authorId === userId ? 0.5 : 0;

      const score = recencyScore * (1 + engagementScore * 0.1) + pinnedBoost + authorBoost;

      return { ...post, _score: score };
    });

    return scored.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b._score - a._score;
    });
  }
}
