import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ParticipantsPage() {
  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, ticket_code, created_at, user:users(full_name, email), event:events(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold text-white mb-6">Participants</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 text-caption text-text-muted font-medium">Participant</th>
              <th className="py-3 text-caption text-text-muted font-medium">Event</th>
              <th className="py-3 text-caption text-text-muted font-medium">Ticket code</th>
              <th className="py-3 text-caption text-text-muted font-medium">Registered</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-text-muted">No tickets yet.</td></tr>
            )}
            {tickets?.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="py-3">
                  <span className="text-white">{(t as any).user?.full_name ?? '—'}</span>
                  <span className="block text-caption text-text-muted">{(t as any).user?.email}</span>
                </td>
                <td className="py-3 text-body">{(t as any).event?.name ?? '—'}</td>
                <td className="py-3 font-mono text-caption">{t.ticket_code}</td>
                <td className="py-3 text-caption text-text-muted">{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
