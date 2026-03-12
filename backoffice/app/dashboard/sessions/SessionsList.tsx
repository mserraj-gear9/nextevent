'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Session = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  room: { name: string } | null;
  event: { name: string } | null;
};

type Event = { id: string; name: string };

export default function SessionsList({ eventId }: { eventId?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eid = eventId ?? searchParams.get('eventId') ?? undefined;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from('events').select('id, name').order('start_at', { ascending: false }).then(({ data }) => setEvents(data ?? []));
  }, []);

  useEffect(() => {
    let q = supabase
      .from('sessions')
      .select('id, title, start_at, end_at, room:rooms(name), event:events(name)')
      .order('start_at', { ascending: true });
    if (eid) q = q.eq('event_id', eid);
    q.then(({ data }) => setSessions((data as Session[]) ?? []));
  }, [eid]);

  return (
    <>
      <div className="flex gap-4 mb-6">
        <select
          className="bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
          value={eid ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            router.push(v ? `/dashboard/sessions?eventId=${v}` : '/dashboard/sessions');
          }}
        >
          <option value="">All events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
      {sessions.length === 0 && (
        <div className="card text-center text-text-muted">No sessions. Create events and add sessions (via API or a future form).</div>
      )}
      {sessions.map((s) => (
        <div key={s.id} className="card flex justify-between items-center">
          <div>
            <h2 className="text-h2 font-semibold text-white">{s.title}</h2>
            <p className="text-body text-text-muted">
              {(s as any).event?.name ?? '—'} · {(s as any).room?.name ?? 'No room'} · {new Date(s.start_at).toLocaleTimeString()} – {new Date(s.end_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
