import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'toastory — Complete UI feedback toolkit for modern web and mobile',
  description:
    'Toast notifications, confirm / alert / prompt dialogs, bottom sheets, and loading overlays with an Apple-style frosted glass design. Zero runtime dependencies. 21 themes.',
  keywords: [
    'toastory',
    'toast',
    'notification',
    'dialog',
    'modal',
    'confirm',
    'prompt',
    'bottom-sheet',
    'apple glass',
    'react',
    'nextjs',
    'vue',
    'svelte',
    'angular',
    'react-native',
  ],
  authors: [{ name: 'toastory maintainers' }],
  openGraph: {
    title: 'toastory — Complete UI Feedback Toolkit',
    description:
      'Toast notifications, dialogs, bottom sheets, and loading overlays with Apple glass design and zero dependencies.',
    url: 'https://toastory.dev',
    siteName: 'toastory',
    images: [
      {
        url: 'https://toastory.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'toastory — Frosted glass UI feedback toolkit',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'toastory — Complete UI Feedback Toolkit',
    description:
      'Toast notifications, dialogs, bottom sheets, and loading overlays with Apple glass design and zero dependencies.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0b0c12] text-[#f4f4f7] selection:bg-blue-500/30 font-sans">
        {/* Skip to Main Content Link for WCAG AA compliance */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Global Frosted Glass Header */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
