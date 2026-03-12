import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#08090E' },
        headerTintColor: '#F4F5F8',
        tabBarStyle: { backgroundColor: '#08090E', borderTopColor: '#1e293b' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />
      <Tabs.Screen name="ticket" options={{ title: 'My Ticket', tabBarIcon: ({ color, size }) => <Ionicons name="qr-code" size={size} color={color} /> }} />
      <Tabs.Screen name="scanner" options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size} color={color} /> }} />
      <Tabs.Screen name="networking" options={{ title: 'Network', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
      <Tabs.Screen name="event/[id]" options={{ href: null }} />
      <Tabs.Screen name="agenda/[eventId]" options={{ href: null }} />
      <Tabs.Screen name="session/[id]" options={{ href: null }} />
      <Tabs.Screen name="speakers/[eventId]" options={{ href: null }} />
    </Tabs>
  );
}
