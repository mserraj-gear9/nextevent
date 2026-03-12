import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">NextEvent Admin</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          <Link href="/dashboard" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Dashboard</h2>
            <p className="text-body text-text-muted mt-1">Analytics and overview</p>
          </Link>
          <Link href="/dashboard/events" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Events</h2>
            <p className="text-body text-text-muted mt-1">Create and manage events</p>
          </Link>
          <Link href="/dashboard/sessions" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Sessions</h2>
            <p className="text-body text-text-muted mt-1">Agenda and rooms</p>
          </Link>
          <Link href="/dashboard/participants" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Participants</h2>
            <p className="text-body text-text-muted mt-1">Attendees and tickets</p>
          </Link>
          <Link href="/dashboard/checkins" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Check-ins</h2>
            <p className="text-body text-text-muted mt-1">Monitor check-in activity</p>
          </Link>
          <Link href="/dashboard/speakers" className="card hover:border-primary/30 transition">
            <h2 className="text-h2 font-semibold text-white">Speakers</h2>
            <p className="text-body text-text-muted mt-1">Manage speakers</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
