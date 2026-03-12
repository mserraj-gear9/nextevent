import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CheckinsPage() {
  const { data: checkins } = await supabase
    .from('checkins')
    .select('id, checked_in_at, ticket:tickets(ticket_code, user:users(full_name)), event:events(name)')
    .order('checked_in_at', { ascending: false })
    .limit(100);

  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold text-white mb-6">Check-in Monitoring</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 text-caption text-text-muted font-medium">Event</th>
              <th className="py-3 text-caption text-text-muted font-medium">Participant</th>
              <th className="py-3 text-caption text-text-muted font-medium">Ticket</th>
              <th className="py-3 text-caption text-text-muted font-medium">Checked in</th>
            </tr>
          </thead>
          <tbody>
            {checkins?.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-text-muted">No check-ins yet.</td></tr>
            )}
            {checkins?.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="py-3 text-body">{(c as any).event?.name ?? '—'}</td>
                <td className="py-3 text-white">{(c as any).ticket?.user?.full_name ?? '—'}</td>
                <td className="py-3 font-mono text-caption">{(c as any).ticket?.ticket_code ?? '—'}</td>
                <td className="py-3 text-caption text-text-muted">{new Date(c.checked_in_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
