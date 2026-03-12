import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';

export default function ProfileScreen() {
  const { user, session } = useSession();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [interests, setInterests] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '');
      setBio(user.bio ?? '');
      setCompany(user.company ?? '');
      setInterests(Array.isArray(user.interests) ? user.interests.join(', ') : '');
    }
  }, [user]);

  async function save() {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName || null,
        bio: bio || null,
        company: company || null,
        interests: interests ? interests.split(',').map((s) => s.trim()).filter(Boolean) : [],
      })
      .eq('id', user.id);
    setSaving(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Saved', 'Profile updated.');
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
          placeholderTextColor={colors.dark.textSecondary}
        />
        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Company"
          placeholderTextColor={colors.dark.textSecondary}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="Short bio"
          placeholderTextColor={colors.dark.textSecondary}
          multiline
        />
        <Text style={styles.label}>Interests (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={interests}
          onChangeText={setInterests}
          placeholder="e.g. AI, Startups"
          placeholderTextColor={colors.dark.textSecondary}
        />
        <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.email}>{session?.user?.email}</Text>
      <TouchableOpacity style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  content: { padding: spacing.md },
  title: { ...typography.h1, color: colors.dark.text, marginBottom: spacing.md },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.dark.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.dark.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.dark.text,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  textArea: { minHeight: 80 },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  buttonText: { ...typography.h3, color: '#fff' },
  email: { ...typography.caption, color: colors.dark.textSecondary, textAlign: 'center', marginBottom: spacing.sm },
  signOut: { alignItems: 'center' },
  signOutText: { ...typography.body, color: colors.secondary.red },
});
