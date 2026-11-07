import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Studio & Playground',
  description:
    'Experiment live with all 7 screen placements, 21 Apple-style glass themes, zero-dependency harmonic Web Audio sound cues, async promises, confirm dialogs, and bottom sheets.',
  openGraph: {
    title: 'toastory Playground — Interactive UI Feedback Studio',
    description:
      'Configure every toast, modal, and sheet parameter live in your browser with real-time multi-framework code generation.',
    url: 'https://toastory.tashanto.com/playground',
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

