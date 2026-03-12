import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSession } from '../../../lib/SessionContext';
import { supabase } from '../../../lib/supabase';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';
import { offlineCheckIn } from '../../../lib/offlineCheckIn';

export default function ScannerScreen() {
  const { user } = useSession();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const isScanner = user?.role === 'scanner' || user?.role === 'organizer' || user?.role === 'super_admin';

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    setLastResult(data);
    try {
      const { data: ticket } = await supabase.from('tickets').select('id, event_id').eq('ticket_code', data).single();
      if (!ticket) {
        Alert.alert('Invalid', 'Ticket not found');
        setScanned(false);
        return;
      }
      const { error } = await supabase.from('checkins').insert({
        organization_id: user?.organization_id,
        event_id: ticket.event_id,
        ticket_id: ticket.id,
        scanned_by: user?.id,
      });
      if (error) {
        if (error.code === '23505') {
          Alert.alert('Already checked in', 'This ticket was already scanned.');
        } else {
          await offlineCheckIn.queue({ ticket_code: data, event_id: ticket.event_id, ticket_id: ticket.id, ts: Date.now() });
          Alert.alert('Saved offline', 'Check-in will sync when online.');
        }
      } else {
        Alert.alert('Success', 'Check-in recorded.');
      }
    } catch {
      await offlineCheckIn.queue({ ticket_code: data, ts: Date.now() });
      Alert.alert('Offline', 'Check-in saved. Will sync when online.');
    }
    setScanned(false);
  }

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Camera permission is required to scan tickets.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isScanner) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>You need the Scanner or Organizer role to use check-in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.hint}>Point at ticket QR code</Text>
        {lastResult ? <Text style={styles.last}>Last: {lastResult.slice(0, 12)}…</Text> : null}
        {scanned ? <Text style={styles.processing}>Processing…</Text> : null}
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Scan again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: 'rgba(0,0,0,0.6)' },
  hint: { ...typography.body, color: '#fff', textAlign: 'center' },
  last: { ...typography.caption, color: colors.dark.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  processing: { ...typography.caption, color: colors.primary, textAlign: 'center', marginTop: spacing.xs },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  buttonText: { ...typography.h3, color: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background, padding: spacing.lg },
  text: { ...typography.body, color: colors.dark.text, textAlign: 'center' },
});
