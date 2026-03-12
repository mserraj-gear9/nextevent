import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Session = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  room: { name: string } | null;
};

export default function AgendaScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const { data: event } = await supabase.from('events').select('name').eq('id', eventId).single();
      if (event) setEventName(event.name);
      const { data } = await supabase
        .from('sessions')
        .select('id, title, start_at, end_at, room:rooms(name)')
        .eq('event_id', eventId)
        .order('start_at', { ascending: true });
      setSessions((data as any) ?? []);
      setLoading(false);
    })();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const formatTime = (d: string) => new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{eventName} – Agenda</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(app)/session/${item.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.time}>{formatTime(item.start_at)} – {formatTime(item.end_at)}</Text>
            <Text style={styles.title}>{item.title}</Text>
            {item.room?.name ? <Text style={styles.room}>{item.room.name}</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No sessions scheduled.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  header: { ...typography.h2, color: colors.dark.text, padding: spacing.md },
  list: { padding: spacing.md, paddingTop: 0 },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  time: { ...typography.caption, color: colors.primary },
  title: { ...typography.h3, color: colors.dark.text, marginTop: spacing.xs },
  room: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
  empty: { ...typography.body, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
