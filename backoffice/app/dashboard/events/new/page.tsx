'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    location: '',
    start_at: '',
    end_at: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data: org } = await supabase.from('organizations').select('id').limit(1).single();
    if (!org) {
      setLoading(false);
      return alert('No organization found. Run seed.');
    }
    const { error } = await supabase.from('events').insert({
      organization_id: org.id,
      name: form.name,
      slug,
      description: form.description || null,
      location: form.location || null,
      start_at: form.start_at,
      end_at: form.end_at,
    });
    setLoading(false);
    if (error) return alert(error.message);
    router.push('/dashboard/events');
    router.refresh();
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-h1 font-bold text-white mb-6">New event</h1>
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
          <label className="block text-caption text-text-muted mb-1">Slug (optional)</label>
          <input
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="auto from name"
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
            {loading ? 'Creating…' : 'Create event'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
