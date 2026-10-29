import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'glazekit — Complete UI feedback toolkit for modern web and mobile',
  description:
    'Toast notifications, confirm / alert / prompt dialogs, bottom sheets, and loading overlays with an Apple-style glass design. Zero runtime dependencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-[#f4f4f7] selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
