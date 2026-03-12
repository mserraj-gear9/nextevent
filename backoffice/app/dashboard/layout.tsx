import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-white/10 bg-surface-dark/50 p-4 flex flex-col gap-2">
        <Link href="/" className="text-primary font-semibold mb-4">NextEvent</Link>
        <Link href="/dashboard" className="text-body text-text-muted hover:text-white py-2">Dashboard</Link>
        <Link href="/dashboard/events" className="text-body text-text-muted hover:text-white py-2">Events</Link>
        <Link href="/dashboard/sessions" className="text-body text-text-muted hover:text-white py-2">Sessions</Link>
        <Link href="/dashboard/participants" className="text-body text-text-muted hover:text-white py-2">Participants</Link>
        <Link href="/dashboard/checkins" className="text-body text-text-muted hover:text-white py-2">Check-ins</Link>
        <Link href="/dashboard/speakers" className="text-body text-text-muted hover:text-white py-2">Speakers</Link>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
