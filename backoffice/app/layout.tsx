import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextEvent Admin',
  description: 'Multi-tenant event management backoffice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-dark">{children}</body>
    </html>
  );
}
