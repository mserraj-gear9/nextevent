import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const { data: events } = await supabase
    .from('events')
    .select('id, name, location, start_at, end_at')
    .order('start_at', { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h1 font-bold text-white">Event Management</h1>
        <Link href="/dashboard/events/new" className="btn-primary">New event</Link>
      </div>
      <div className="space-y-4">
        {events?.length === 0 && (
          <div className="card text-center text-text-muted">No events yet. Create one to get started.</div>
        )}
        {events?.map((e) => (
          <div key={e.id} className="card flex justify-between items-center">
            <div>
              <h2 className="text-h2 font-semibold text-white">{e.name}</h2>
              <p className="text-body text-text-muted">
                {e.location ?? '—'} · {new Date(e.start_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/events/${e.id}`} className="btn-secondary text-sm">Edit</Link>
              <Link href={`/dashboard/sessions?eventId=${e.id}`} className="btn-secondary text-sm">Sessions</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
