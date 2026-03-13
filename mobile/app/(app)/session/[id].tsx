import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Session = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  room: { name: string; capacity: number | null } | null;
  speakers: { full_name: string; company: string | null }[];
};

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('id, title, description, start_at, end_at, room:rooms(name, capacity)')
        .eq('id', id)
        .single();
      const { data: speakerLinks } = await supabase
        .from('session_speakers')
        .select('user:users(full_name, company)')
        .eq('session_id', id);
      const speakers = (speakerLinks ?? []).map((s: any) => s.user).filter(Boolean);
      setSession(sessionData ? { ...sessionData, speakers } : null);
      setLoading(false);
    })();
  }, [id]);

  if (loading || !session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const start = new Date(session.start_at);
  const end = new Date(session.end_at);
  const timeStr = `${start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.time}>{timeStr}</Text>
        {session.room?.name ? (
          <Text style={styles.meta}>Room: {session.room.name}{session.room.capacity ? ` (${session.room.capacity} capacity)` : ''}</Text>
        ) : null}
        {session.description ? <Text style={styles.body}>{session.description}</Text> : null}
        {session.speakers?.length ? (
          <View style={styles.speakers}>
            <Text style={styles.speakersLabel}>Speakers</Text>
            {session.speakers.map((s, i) => (
              <Text key={i} style={styles.speaker}>{s.full_name}{s.company ? ` · ${s.company}` : ''}</Text>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  content: { padding: spacing.md },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg },
  title: { ...typography.h1, color: colors.dark.text },
  time: { ...typography.h3, color: colors.primary, marginTop: spacing.sm },
  meta: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
  body: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.md },
  speakers: { marginTop: spacing.lg },
  speakersLabel: { ...typography.h3, color: colors.dark.text },
  speaker: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
});
