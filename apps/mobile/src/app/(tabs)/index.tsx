import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth.store';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { data: digest, isLoading: digestLoading, refetch } = useQuery({
    queryKey: ['mobile-digest'],
    queryFn: () => apiClient.get('/ai/digest').then((r) => r.data.data),
    staleTime: 30 * 60 * 1000,
  });

  const { data: announcements } = useQuery({
    queryKey: ['mobile-announcements'],
    queryFn: () => apiClient.get('/announcements?limit=3').then((r) => r.data.data),
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={digestLoading} onRefresh={refetch} tintColor="#6366f1" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting()}, {user?.firstName} 👋</Text>
        <Text style={styles.subtext}>Here's your daily briefing</Text>
      </View>

      {/* AI Digest */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>✨</Text>
          <Text style={styles.cardTitle}>AI Daily Digest</Text>
        </View>
        {digestLoading ? (
          <View style={styles.skeleton} />
        ) : (
          <Text style={styles.digestText}>{digest?.digest || 'No digest available yet.'}</Text>
        )}
      </View>

      {/* Announcements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        {announcements?.map((ann: any) => (
          <View key={ann.id} style={[styles.announcementCard, ann.priority === 'HIGH' && styles.highPriority]}>
            <Text style={styles.announcementTitle}>{ann.title}</Text>
            <Text style={styles.announcementBody} numberOfLines={2}>{ann.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { padding: 20, paddingTop: 16 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#f9fafb' },
  subtext: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  cardIcon: { fontSize: 16 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#f9fafb' },
  digestText: { fontSize: 14, color: '#9ca3af', lineHeight: 22 },
  skeleton: { height: 60, backgroundColor: '#1f2937', borderRadius: 8 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#f9fafb', marginBottom: 12 },
  announcementCard: {
    padding: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 8,
  },
  highPriority: { borderColor: '#f59e0b', backgroundColor: '#1c1a0a' },
  announcementTitle: { fontSize: 14, fontWeight: '600', color: '#f9fafb', marginBottom: 4 },
  announcementBody: { fontSize: 13, color: '#6b7280', lineHeight: 20 },
});
