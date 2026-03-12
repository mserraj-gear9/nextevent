import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Event = { id: string; name: string; location: string | null; start_at: string; end_at: string };

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, location, start_at, end_at')
        .order('start_at', { ascending: true });
      if (!error) setEvents(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(app)/event/${item.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.location ? <Text style={styles.cardMeta}>{item.location}</Text> : null}
            <Text style={styles.cardDate}>{formatDate(item.start_at)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No events yet. Check back later.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  list: { padding: spacing.md },
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.h2, color: colors.dark.text },
  cardMeta: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
  cardDate: { ...typography.caption, color: colors.primary, marginTop: spacing.sm },
  empty: { ...typography.body, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
