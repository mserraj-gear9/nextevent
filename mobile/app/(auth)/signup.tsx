import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const DEFAULT_ORGANIZATION_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Morocco Events Hub

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required');
      return;
    }
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email,
          role: 'participant',
          organization_id: DEFAULT_ORGANIZATION_ID,
        },
      },
    });
    setLoading(false);
    if (error) {
      console.log(error);
      Alert.alert('Sign up failed', error.message);
      return;
    }
    if (user) router.replace('/(app)/events');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join NextEvent</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor={colors.dark.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.dark.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.dark.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign up'}</Text>
        </TouchableOpacity>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background, justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.xl },
  title: { ...typography.h1, color: colors.dark.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.dark.textSecondary, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.dark.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.dark.text,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  buttonText: { ...typography.h3, color: '#fff' },
  link: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { ...typography.body, color: colors.secondary.blue },
});
