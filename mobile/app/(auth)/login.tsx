import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }
    router.replace('/(app)/events');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>NextEvent</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background, justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.xl },
  title: { ...typography.display, color: colors.primary, marginBottom: spacing.xs },
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
