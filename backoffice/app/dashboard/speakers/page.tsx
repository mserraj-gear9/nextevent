import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SpeakersPage() {
  const { data: speakers } = await supabase
    .from('speakers')
    .select('id, full_name, company, event:events(name)')
    .order('sort_order', { ascending: true });

  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold text-white mb-6">Speakers Management</h1>
      <div className="space-y-4">
        {speakers?.length === 0 && (
          <div className="card text-center text-text-muted">No speakers yet. Add speakers per event (via API or future form).</div>
        )}
        {speakers?.map((s) => (
          <div key={s.id} className="card flex justify-between items-center">
            <div>
              <h2 className="text-h2 font-semibold text-white">{s.full_name}</h2>
              <p className="text-body text-text-muted">{(s as any).event?.name ?? '—'} · {s.company ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
