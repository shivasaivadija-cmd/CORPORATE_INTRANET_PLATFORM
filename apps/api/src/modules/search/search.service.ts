import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(tenantId: string, query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase();

    // Search across multiple entities
    const [posts, articles, documents, users] = await Promise.all([
      // Search posts
      this.prisma.post.findMany({
        where: {
          tenantId,
          isDeleted: false,
          OR: [
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { hashtags: { hasSome: [searchTerm] } },
          ],
        },
        take: 5,
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { displayName: true } },
        },
      }),

      // Search knowledge articles
      this.prisma.knowledgeArticle.findMany({
        where: {
          tenantId,
          isPublished: true,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
        },
      }),

      // Search documents
      this.prisma.document.findMany({
        where: {
          tenantId,
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          mimeType: true,
        },
      }),

      // Search users
      this.prisma.user.findMany({
        where: {
          tenantId,
          status: 'ACTIVE',
          OR: [
            { displayName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { jobTitle: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          displayName: true,
          jobTitle: true,
          avatarUrl: true,
          department: { select: { name: true } },
        },
      }),
    ]);

    // Format results
    const results = [
      ...posts.map((post) => ({
        type: 'post',
        id: post.id,
        title: `Post by ${post.author.displayName}`,
        description: post.content.substring(0, 100) + '...',
        url: `/feed?post=${post.id}`,
      })),
      ...articles.map((article) => ({
        type: 'article',
        id: article.id,
        title: article.title,
        description: article.excerpt,
        url: `/knowledge/${article.slug}`,
      })),
      ...documents.map((doc) => ({
        type: 'document',
        id: doc.id,
        title: doc.name,
        description: doc.type === 'FOLDER' ? 'Folder' : doc.mimeType,
        url: `/documents?id=${doc.id}`,
      })),
      ...users.map((user) => ({
        type: 'person',
        id: user.id,
        title: user.displayName,
        description: `${user.jobTitle} • ${user.department?.name || 'No department'}`,
        url: `/people/${user.id}`,
      })),
    ];

    return results;
  }

  async getSearchHistory(userId: string) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async saveSearchHistory(userId: string, query: string, resultCount = 0) {
    // Check if query already exists in history
    const existing = await this.prisma.searchHistory.findFirst({
      where: { userId, query },
    });

    if (existing) {
      // Update existing entry
      return this.prisma.searchHistory.update({
        where: { id: existing.id },
        data: { resultCount, createdAt: new Date() }, // Update timestamp
      });
    }

    // Create new entry
    return this.prisma.searchHistory.create({
      data: { userId, query, resultCount },
    });
  }

  async deleteSearchHistory(userId: string, id: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { id, userId }, // Ensure user owns the history item
    });
  }

  async getTrendingSearches(tenantId: string) {
    // Get most common searches from all users in tenant
    const searches = await this.prisma.searchHistory.findMany({
      where: {
        user: { tenantId },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: { query: true },
    });

    // Count occurrences
    const counts = searches.reduce((acc, { query }) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and return top 10
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }
}
