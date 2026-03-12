import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Event = { id: string; organization_id: string; name: string; description: string | null; location: string | null; start_at: string; end_at: string };

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id).single();
      setEvent(data ?? null);
      if (user?.id) {
        const { data: ticket } = await supabase.from('tickets').select('id').eq('event_id', id).eq('user_id', user.id).maybeSingle();
        setHasTicket(!!ticket);
      }
      setLoading(false);
    })();
  }, [id, user?.id]);

  if (loading || !event) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const dateStr = start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = `${start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;

  async function registerForEvent() {
    if (!user?.id || !event) return;
    const { error } = await supabase.from('tickets').insert({
      organization_id: event.organization_id,
      event_id: event.id,
      user_id: user.id,
    });
    if (error) {
      if (error.code === '23505') setHasTicket(true);
      else Alert.alert('Error', error.message);
      return;
    }
    setHasTicket(true);
    Alert.alert('Success', 'You’re registered. Your ticket is in My Ticket.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.time}>{timeStr}</Text>
        {event.location ? <Text style={styles.meta}>📍 {event.location}</Text> : null}
        {event.description ? <Text style={styles.body}>{event.description}</Text> : null}
      </View>
      {!hasTicket && (
        <TouchableOpacity style={styles.button} onPress={registerForEvent}>
          <Text style={styles.buttonText}>Get ticket</Text>
        </TouchableOpacity>
      )}
      {hasTicket && (
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/(app)/ticket')}>
          <Text style={styles.buttonTextSecondary}>View my ticket</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => router.push(`/(app)/agenda/${event.id}`)}
      >
        <Text style={styles.buttonTextSecondary}>View Agenda</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => router.push(`/(app)/speakers/${event.id}`)}
      >
        <Text style={styles.buttonTextSecondary}>Speakers</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  content: { padding: spacing.md },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.dark.text },
  date: { ...typography.h3, color: colors.primary, marginTop: spacing.sm },
  time: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
  meta: { ...typography.body, color: colors.dark.text, marginTop: spacing.md },
  body: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.md },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.sm },
  buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  buttonText: { ...typography.h3, color: '#fff' },
  buttonTextSecondary: { ...typography.h3, color: colors.primary },
});
