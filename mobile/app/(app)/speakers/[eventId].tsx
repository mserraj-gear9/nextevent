import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Speaker = { id: string; full_name: string; bio: string | null; company: string | null; photo_url: string | null };

export default function SpeakersScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const { data: event } = await supabase.from('events').select('name').eq('id', eventId).single();
      if (event) setEventName(event.name);
      const { data } = await supabase
        .from('speakers')
        .select('id, full_name, bio, company, photo_url')
        .eq('event_id', eventId)
        .order('sort_order', { ascending: true });
      setSpeakers(data ?? []);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{eventName} – Speakers</Text>
      <FlatList
        data={speakers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.photo_url ? (
              <Image source={{ uri: item.photo_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{item.full_name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.full_name}</Text>
              {item.company ? <Text style={styles.company}>{item.company}</Text> : null}
              {item.bio ? <Text style={styles.bio} numberOfLines={3}>{item.bio}</Text> : null}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No speakers listed.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  header: { ...typography.h2, color: colors.dark.text, padding: spacing.md },
  list: { padding: spacing.md, paddingTop: 0 },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, flexDirection: 'row' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.h2, color: '#fff' },
  cardBody: { flex: 1, marginLeft: spacing.md },
  name: { ...typography.h3, color: colors.dark.text },
  company: { ...typography.caption, color: colors.primary, marginTop: spacing.xs },
  bio: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.sm },
  empty: { ...typography.body, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
