import SessionsList from './SessionsList';

export const dynamic = 'force-dynamic';

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const { eventId } = await searchParams;
  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold text-white mb-6">Session Management</h1>
      <SessionsList eventId={eventId} />
    </div>
  );
}
