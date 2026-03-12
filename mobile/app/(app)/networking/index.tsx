import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

type Profile = { id: string; full_name: string | null; company: string | null; bio: string | null };
type ConnectionRow = { id: string; status: string; to_user_id?: string; from_user_id?: string };

export default function NetworkingScreen() {
  const { user } = useSession();
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<ConnectionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.organization_id) return;
    (async () => {
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, company, bio')
        .eq('organization_id', user.organization_id)
        .neq('id', user.id);
      setParticipants(users ?? []);

      const { data: connOut } = await supabase
        .from('connections')
        .select('id, status, to_user_id')
        .eq('from_user_id', user.id);
      const { data: connIn } = await supabase
        .from('connections')
        .select('id, status, from_user_id')
        .eq('to_user_id', user.id);
      const outIds = new Set((connOut ?? []).map((c) => c.to_user_id));
      const inIds = new Set((connIn ?? []).map((c) => c.from_user_id));
      setConnections([
        ...(connOut ?? []).map((c) => ({ id: c.id, status: c.status, to_user_id: c.to_user_id })),
        ...(connIn ?? []).map((c) => ({ id: c.id, status: c.status, from_user_id: c.from_user_id })),
      ]);
      setLoading(false);
    })();
  }, [user?.id, user?.organization_id]);

  async function requestConnection(toUserId: string) {
    const { error } = await supabase.from('connections').insert({
      organization_id: user!.organization_id,
      from_user_id: user!.id,
      to_user_id: toUserId,
      status: 'pending',
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Sent', 'Connection request sent.');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const connectedIds = new Set(
    connections.flatMap((c) => [c.to_user_id, c.from_user_id].filter(Boolean) as string[])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const connected = connectedIds.has(item.id);
          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.full_name || 'No name'}</Text>
              {item.company ? <Text style={styles.company}>{item.company}</Text> : null}
              {item.bio ? <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text> : null}
              {!connected && (
                <TouchableOpacity style={styles.button} onPress={() => requestConnection(item.id)}>
                  <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No other participants in your organization.</Text>}
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
  name: { ...typography.h3, color: colors.dark.text },
  company: { ...typography.caption, color: colors.primary, marginTop: spacing.xs },
  bio: { ...typography.body, color: colors.dark.textSecondary, marginTop: spacing.sm },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.sm, alignSelf: 'flex-start', marginTop: spacing.md },
  buttonText: { ...typography.caption, color: '#fff' },
  empty: { ...typography.body, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
