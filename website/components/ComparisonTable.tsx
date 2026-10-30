import React from 'react';

interface ComparisonRow {
  feature: string;
  toastory: string | boolean;
  sonner: string | boolean;
  reactToastify: string | boolean;
  reactHotToast: string | boolean;
  notyf: string | boolean;
  sweetAlert2: string | boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: 'Zero Runtime Dependencies',
    toastory: 'Yes (0 B)',
    sonner: 'No',
    reactToastify: 'No',
    reactHotToast: 'No',
    notyf: 'Yes',
    sweetAlert2: 'Yes',
  },
  {
    feature: 'Measured Gzip Size (Core + Toast)',
    toastory: '5.2 KB',
    sonner: '~4.5 KB',
    reactToastify: '~14.0 KB',
    reactHotToast: '~5.2 KB',
    notyf: '~3.8 KB',
    sweetAlert2: '~15.0 KB',
  },
  {
    feature: 'Frameworks Supported',
    toastory: 'JS, React, Next, Vue, Nuxt, Angular, Svelte, RN',
    sonner: 'React only',
    reactToastify: 'React only',
    reactHotToast: 'React only',
    notyf: 'Vanilla only',
    sweetAlert2: 'Vanilla / Wrappers',
  },
  {
    feature: 'Dialog Toolkit (Confirm, Prompt, Alert)',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: true,
  },
  {
    feature: 'Mobile Bottom Sheet & Action Sheet',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: false,
  },
  {
    feature: 'Multi-Step Wizard Dialogs',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: 'Basic',
  },
  {
    feature: '6-Box Discrete Numeric OTP Input',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: false,
  },
  {
    feature: 'Type-to-Confirm Deletion Guard',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: false,
  },
  {
    feature: 'Real-time Session Countdown Timer',
    toastory: true,
    sonner: false,
    reactToastify: false,
    reactHotToast: false,
    notyf: false,
    sweetAlert2: 'Timer only',
  },
  {
    feature: 'Apple-Style Frosted Glass Tokens',
    toastory: '21 Themes',
    sonner: 'Flat minimal',
    reactToastify: 'Flat card',
    reactHotToast: 'Minimal card',
    notyf: 'Flat banner',
    sweetAlert2: 'Flat / Skewed',
  },
  {
    feature: 'Gesture Swipe Physics (4-Direction)',
    toastory: true,
    sonner: '1-Direction',
    reactToastify: '2-Direction',
    reactHotToast: 'Basic',
    notyf: false,
    sweetAlert2: false,
  },
  {
    feature: 'WCAG 2.2 AA Verified (0 axe-core errors)',
    toastory: 'Yes (96 runs)',
    sonner: 'not verified',
    reactToastify: 'not verified',
    reactHotToast: 'not verified',
    notyf: 'not verified',
    sweetAlert2: 'not verified',
  },
  {
    feature: 'License',
    toastory: 'MIT',
    sonner: 'MIT',
    reactToastify: 'MIT',
    reactHotToast: 'MIT',
    notyf: 'MIT',
    sweetAlert2: 'MIT',
  },
];

export function ComparisonTable() {
  const renderCell = (val: string | boolean, isToastory = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isToastory ? 'bg-blue-500/20 text-blue-500 font-bold' : 'text-emerald-500'}`}>
          ✓
        </span>
      ) : (
        <span className="text-[var(--site-muted)] text-sm opacity-50">—</span>
      );
    }
    if (val === 'not verified') {
      return <span className="text-xs text-[var(--site-muted)] italic">not verified</span>;
    }
    return (
      <span className={isToastory ? 'font-semibold text-[var(--site-fg)]' : 'text-[var(--site-muted)]'}>
        {val}
      </span>
    );
  };

  return (
    <div className="w-full my-16 text-left">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--site-fg)] mb-3">
          Honest, Verifiable Feature Comparison
        </h2>
        <p className="text-[var(--site-muted)] text-sm sm:text-base leading-relaxed">
          Measured via automated build tests and repository analysis. Facts are checked against official documentation.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-[var(--site-border)] bg-[var(--site-surface-raised)]">
              <th className="py-4 px-4 font-semibold text-[var(--site-fg)]">Feature & Specification</th>
              <th className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10">toastory</th>
              <th className="py-4 px-4 font-medium text-[var(--site-muted)]">Sonner</th>
              <th className="py-4 px-4 font-medium text-[var(--site-muted)]">React-Toastify</th>
              <th className="py-4 px-4 font-medium text-[var(--site-muted)]">react-hot-toast</th>
              <th className="py-4 px-4 font-medium text-[var(--site-muted)]">Notyf</th>
              <th className="py-4 px-4 font-medium text-[var(--site-muted)]">SweetAlert2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--site-border-subtle)]">
            {COMPARISON_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-[var(--site-surface-raised)] transition-colors">
                <td className="py-3 px-4 font-medium text-[var(--site-fg)]">{row.feature}</td>
                <td className="py-3 px-4 bg-blue-500/[0.04]">{renderCell(row.toastory, true)}</td>
                <td className="py-3 px-4">{renderCell(row.sonner)}</td>
                <td className="py-3 px-4">{renderCell(row.reactToastify)}</td>
                <td className="py-3 px-4">{renderCell(row.reactHotToast)}</td>
                <td className="py-3 px-4">{renderCell(row.notyf)}</td>
                <td className="py-3 px-4">{renderCell(row.sweetAlert2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[var(--site-surface)] border border-[var(--site-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--site-muted)] gap-2">
        <span>Method: Measured with gzipSync over esbuild standalone bundles. Script: `scripts/size.mjs`.</span>
        <span className="italic">Notice: toastory is not affiliated with any referenced open-source projects.</span>
      </div>
    </div>
  );
}

