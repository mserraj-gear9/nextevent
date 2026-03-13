import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabase/supabase';
import QRCode from 'react-native-qrcode-svg';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Ticket = { id: string; ticket_code: string; event: { name: string; start_at: string } };

export default function MyTicketScreen() {
  const { user } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from('tickets')
        .select('id, ticket_code, event:events(name, start_at)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTickets((data as any) ?? []);
      setLoading(false);
    })();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Tickets</Text>
      {tickets.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>You don't have any tickets yet. Register for an event to get your QR code.</Text>
        </View>
      ) : (
        tickets.map((t) => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.eventName}>{(t as any).event?.name ?? 'Event'}</Text>
            <Text style={styles.date}>
              {((t as any).event?.start_at)
                ? new Date((t as any).event.start_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                : ''}
            </Text>
            <View style={styles.qrWrap}>
              <QRCode value={t.ticket_code} size={200} color={colors.dark.text} backgroundColor={colors.dark.surface} />
            </View>
            <Text style={styles.code}>{t.ticket_code}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background },
  content: { padding: spacing.md },
  title: { ...typography.h1, color: colors.dark.text, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eventName: { ...typography.h2, color: colors.dark.text },
  date: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.xs },
  qrWrap: { marginVertical: spacing.lg, padding: spacing.md, backgroundColor: '#fff', borderRadius: borderRadius.md },
  code: { ...typography.caption, color: colors.dark.textSecondary },
  empty: { ...typography.body, color: colors.dark.textSecondary, textAlign: 'center' },
});
