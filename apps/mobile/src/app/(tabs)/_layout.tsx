import { Tabs } from 'expo-router';
import { Home, Rss, Bell, Users, Award } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: '#1f2937',
          paddingBottom: 8,
          height: 60,
        },
        headerStyle: { backgroundColor: '#0a0a0f' },
        headerTintColor: '#f9fafb',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Rss color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="recognition"
        options={{
          title: 'Kudos',
          tabBarIcon: ({ color, size }) => <Award color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
