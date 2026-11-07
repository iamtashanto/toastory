import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://toastory.tashanto.com'),
  title: {
    default: 'toastory — The All-in-One UI Feedback Toolkit for Modern Web & Mobile',
    template: '%s | toastory',
  },
  description:
    'Complete UI feedback toolkit: toasts, confirm / alert / prompt dialogs, bottom sheets, and loading overlays. Apple-style glass design, closed-form spring physics, Web Audio synthesizer, and zero runtime dependencies.',
  keywords: [
    'toastory',
    'toast notifications',
    'react toast',
    'nextjs toast',
    'vue toast',
    'svelte toast',
    'angular toast',
    'react-native toast',
    'best react toast library 2026',
    'sonner alternative',
    'sweetalert2 alternative',
    'react-toastify alternative',
    'react-hot-toast alternative',
    'notyf alternative',
    'confirm dialog',
    'prompt modal',
    'bottom sheet',
    'apple glass design',
    'frosted glass toast',
    'web audio chimes',
    'dynamic island toast',
    'spring physics notifications',
    'accessible toast library',
    'wcag 2.2 aa toast',
    'zero runtime dependencies',
  ],
  authors: [
    { name: 'Tanvir Ahamed Shanto', url: 'https://www.supportkori.com/iamtashanto' },
    { name: 'toastory maintainers', url: 'https://toastory.tashanto.com' },
  ],
  creator: 'Md Tanvir Ahamed Shanto',
  publisher: 'toastory',
  alternates: {
    canonical: 'https://toastory.tashanto.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'toastory — Complete UI Feedback Toolkit',
    description:
      'Toasts, dialogs, bottom sheets, and loading overlays with Apple-style glass and zero runtime dependencies. 7 screen placements & Web Audio synthesizer.',
    url: 'https://toastory.tashanto.com',
    siteName: 'toastory',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'toastory — Apple-style frosted glass UI feedback toolkit',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'toastory — Complete UI Feedback Toolkit',
    description:
      'Toasts, dialogs, bottom sheets, and loading overlays with Apple-style glass and zero runtime dependencies.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'toastory',
  softwareVersion: '0.3.4',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any (Web, React, Next.js, Vue, Angular, Svelte, React Native)',
  description:
    'Complete UI feedback toolkit shipping toasts, confirm / alert / prompt dialogs, bottom sheets, and loading overlays with Apple-style glass design and zero dependencies.',
  url: 'https://toastory.tashanto.com',
  sameAs: [
    'https://github.com/iamtashanto/toastory',
    'https://www.npmjs.com/package/toastory',
    'https://www.supportkori.com/iamtashanto',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Md Tanvir Ahamed Shanto',
    url: 'https://www.supportkori.com/iamtashanto',
  },
  publisher: {
    '@type': 'Organization',
    name: 'toastory',
    url: 'https://toastory.tashanto.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('toastory-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var mode = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', mode);
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(mode);
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--site-bg)] text-[var(--site-fg)] transition-colors duration-200 selection:bg-blue-500/30 font-sans">
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
