import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionContextProvider } from '../lib/SessionContext';

export default function RootLayout() {
  return (
    <SessionContextProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#08090E' },
          headerTintColor: '#F4F5F8',
          contentStyle: { backgroundColor: '#050709' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </SessionContextProvider>
  );
}
