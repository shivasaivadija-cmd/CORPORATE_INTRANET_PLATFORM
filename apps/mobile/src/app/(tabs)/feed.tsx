import React from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth.store';
import { formatDistanceToNow } from 'date-fns';

function PostItem({ post }: { post: any }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.author?.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author?.displayName}</Text>
          <Text style={styles.postTime}>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Text>
        </View>
      </View>
      <Text style={styles.postContent} numberOfLines={4}>{post.content}</Text>
      <View style={styles.postActions}>
        <Text style={styles.actionText}>👍 {post.reactionCounts?.like || 0}</Text>
        <Text style={styles.actionText}>💬 {post.commentCount || 0}</Text>
        <Text style={styles.actionText}>🔖 {post.bookmarkCount || 0}</Text>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['mobile-feed'],
      queryFn: ({ pageParam = 1 }) =>
        apiClient.get(`/feed?page=${pageParam}&limit=15`).then((r) => r.data),
      getNextPageParam: (last) => (last.meta?.hasNextPage ? last.meta.page + 1 : undefined),
      initialPageParam: 1,
    });

  const posts = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#6366f1" />
      }
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color="#6366f1" style={{ padding: 16 }} />
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        ) : null
      }
      contentContainerStyle={{ padding: 12, gap: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  postCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#312e81',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#a5b4fc', fontWeight: '700', fontSize: 15 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#f9fafb' },
  postTime: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  postContent: { fontSize: 14, color: '#d1d5db', lineHeight: 22 },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  actionText: { fontSize: 13, color: '#6b7280' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#6b7280', fontSize: 14 },
});
