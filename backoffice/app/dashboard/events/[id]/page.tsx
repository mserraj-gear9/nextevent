'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    location: '',
    start_at: '',
    end_at: '',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id).single();
      if (data) {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description ?? '',
          location: data.location ?? '',
          start_at: data.start_at?.slice(0, 16) ?? '',
          end_at: data.end_at?.slice(0, 16) ?? '',
        });
      }
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('events')
      .update({
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        location: form.location || null,
        start_at: form.start_at,
        end_at: form.end_at,
      })
      .eq('id', id);
    setLoading(false);
    if (error) return alert(error.message);
    router.push('/dashboard/events');
    router.refresh();
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-h1 font-bold text-white mb-6">Edit event</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-caption text-text-muted mb-1">Name</label>
          <input
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-caption text-text-muted mb-1">Slug</label>
          <input
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-caption text-text-muted mb-1">Location</label>
          <input
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-caption text-text-muted mb-1">Description</label>
          <textarea
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white min-h-[80px]"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-caption text-text-muted mb-1">Start</label>
            <input
              type="datetime-local"
              className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
              value={form.start_at}
              onChange={(e) => setForm((f) => ({ ...f, start_at: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-caption text-text-muted mb-1">End</label>
            <input
              type="datetime-local"
              className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
              value={form.end_at}
              onChange={(e) => setForm((f) => ({ ...f, end_at: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
