import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const OFFLINE_QUEUE_KEY = 'nextevent_checkin_queue';

export type QueuedCheckIn = {
  ticket_code: string;
  event_id?: string | null;
  ticket_id?: string | null;
  ts: number;
};

async function getQueue(): Promise<QueuedCheckIn[]> {
  const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setQueue(queue: QueuedCheckIn[]) {
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export const offlineCheckIn = {
  async queue(item: Omit<QueuedCheckIn, 'ts'>) {
    const q = await getQueue();
    q.push({ ...item, ts: Date.now() });
    await setQueue(q);
  },
  async sync(userId: string, organizationId: string) {
    const q = await getQueue();
    if (q.length === 0) return;
    for (const item of q) {
      const { data: ticket } = await supabase.from('tickets').select('id, event_id').eq('ticket_code', item.ticket_code).single();
      if (!ticket) continue;
      await supabase.from('checkins').insert({
        organization_id: organizationId,
        event_id: ticket.event_id,
        ticket_id: ticket.id,
        scanned_by: userId,
        offline_id: `offline-${item.ts}`,
        synced_at: new Date().toISOString(),
      });
    }
    await setQueue([]);
  },
  async pendingCount(): Promise<number> {
    const q = await getQueue();
    return q.length;
  },
};
