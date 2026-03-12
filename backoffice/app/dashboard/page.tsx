import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [eventsRes, ticketsRes, checkinsRes, sessionsRes] = await Promise.all([
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('tickets').select('id', { count: 'exact', head: true }),
    supabase.from('checkins').select('id', { count: 'exact', head: true }),
    supabase.from('sessions').select('id', { count: 'exact', head: true }),
  ]);
  return {
    events: eventsRes.count ?? 0,
    participants: ticketsRes.count ?? 0,
    checkins: checkinsRes.count ?? 0,
    sessions: sessionsRes.count ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold text-white mb-6">Analytics Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <p className="text-caption text-text-muted">Events</p>
          <p className="text-display font-bold text-primary">{stats.events}</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-muted">Participants (tickets)</p>
          <p className="text-display font-bold text-secondary-blue">{stats.participants}</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-muted">Check-ins</p>
          <p className="text-display font-bold text-secondary-amber">{stats.checkins}</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-muted">Sessions</p>
          <p className="text-display font-bold text-secondary-purple">{stats.sessions}</p>
        </div>
      </div>
      <div className="card">
        <h2 className="text-h2 font-semibold text-white mb-4">Quick actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/dashboard/events/new" className="btn-primary">New event</Link>
          <Link href="/dashboard/sessions" className="btn-secondary">Manage sessions</Link>
          <Link href="/dashboard/checkins" className="btn-secondary">View check-ins</Link>
        </div>
      </div>
    </div>
  );
}
