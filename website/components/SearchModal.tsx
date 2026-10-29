'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface SearchEntry {
  title: string;
  category: string;
  url: string;
  snippet: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  // Getting Started
  {
    title: 'Introduction & Philosophy',
    category: 'Getting Started',
    url: '/docs/getting-started/introduction',
    snippet: 'All feedback UI in one package: toasts, dialogs, bottom sheets, loading overlays. Zero runtime dependencies.',
  },
  {
    title: 'Installation',
    category: 'Getting Started',
    url: '/docs/getting-started/installation',
    snippet: 'Install via npm, pnpm, yarn, bun, or direct script tags. Optional peer dependencies for React, Vue, Svelte, Angular.',
  },
  {
    title: 'Quickstart Guides',
    category: 'Getting Started',
    url: '/docs/getting-started/quickstart',
    snippet: '8-line setup across Vanilla JavaScript, React, Next.js App Router, Vue, Nuxt, Angular, Svelte, and React Native.',
  },
  {
    title: 'Production Setup Checklist',
    category: 'Getting Started',
    url: '/docs/getting-started/setup-checklist',
    snippet: 'SSR hydration safety, CSP headers, z-index layering, and tree-shaking verification.',
  },

  // Guides
  {
    title: 'Toast Notifications',
    category: 'Guides',
    url: '/docs/guides/toasts',
    snippet: 'ui.toast(), success, error, warning, info, loading, titles, descriptions, icons, avatars, timestamps, and action buttons.',
  },
  {
    title: 'Promise Toasts & Unwrapping',
    category: 'Guides',
    url: '/docs/guides/promise-toasts',
    snippet: 'ui.toast.promise() with loading indicators, dynamic success/error messages, and unwrap() resolution.',
  },
  {
    title: 'Updating & Programmatic Dismissal',
    category: 'Guides',
    url: '/docs/guides/updating-dismissing',
    snippet: 'ui.toast.update(id), ui.toast.dismiss(id), dismissAll(), and inspecting getHistory().',
  },
  {
    title: 'Custom Content & Renderers',
    category: 'Guides',
    url: '/docs/guides/custom-content',
    snippet: 'ui.toast.custom() for rendering JSX, HTML templates, avatars, or dynamic custom interactive DOM widgets.',
  },
  {
    title: 'Stacking & Positioning',
    category: 'Guides',
    url: '/docs/guides/stacking-positioning',
    snippet: '6 screen placements, 3D stacked deck mode vs expanded list, hover expansion, and gap tokens.',
  },
  {
    title: 'Swipe Gestures & Physics',
    category: 'Guides',
    url: '/docs/guides/swipe-gestures',
    snippet: '4-directional touch velocity snapping, drag thresholds, and mobile touch-action pan boundaries.',
  },
  {
    title: 'Progress Bars & Countdown Rings',
    category: 'Guides',
    url: '/docs/guides/progress-timers',
    snippet: 'Determinate progress bars, SVG circular countdown rings, pausable timers on hover/focus, and resume hooks.',
  },
  {
    title: 'Dialogs: Confirm, Alert & Modal',
    category: 'Guides',
    url: '/docs/guides/dialogs',
    snippet: 'ui.confirm(), ui.alert(), custom buttons, tone presets (info, warning, danger), icons, and focus trapping.',
  },
  {
    title: 'Prompts & Interactive Inputs',
    category: 'Guides',
    url: '/docs/guides/prompts-inputs',
    snippet: 'ui.prompt() with 16 input types: text, password, select, range, date, file, and 6-box discrete numeric OTP.',
  },
  {
    title: 'Validation & Async Locks',
    category: 'Guides',
    url: '/docs/guides/validation-async',
    snippet: 'Synchronous and asynchronous input validation, live error messages, and preConfirm loading spinners.',
  },
  {
    title: 'Multi-Step Wizard Dialogs',
    category: 'Guides',
    url: '/docs/guides/steps',
    snippet: 'ui.steps() for multi-step onboarding, configuration flows, and backward/forward navigation.',
  },
  {
    title: 'Action Sheets & Bottom Sheets',
    category: 'Guides',
    url: '/docs/guides/sheets-overlays',
    snippet: 'ui.sheet() iOS-style action sheets and ui.bottomSheet() draggable mobile drawer sheets with snap points.',
  },
  {
    title: 'Loading Overlays & Island HUD',
    category: 'Guides',
    url: '/docs/guides/island-hud',
    snippet: 'Full-screen loading overlays with progress bars, and floating dynamic island capsules for transient alerts.',
  },
  {
    title: 'SSR & Next.js Server Actions',
    category: 'Guides',
    url: '/docs/guides/ssr-server-actions',
    snippet: 'Seamless patterns for firing feedback from Next.js Server Actions with zero SSR hydration mismatches.',
  },

  // Theming
  {
    title: 'Theming Architecture',
    category: 'Theming',
    url: '/docs/theming/overview',
    snippet: '21 built-in themes, Apple glass aesthetic, solid fallback via @supports, and scoped theme tokens.',
  },
  {
    title: 'Design Tokens Reference',
    category: 'Theming',
    url: '/docs/theming/tokens',
    snippet: 'Complete CSS variables reference: --gk-bg, --gk-fg, --gk-accent, --gk-border, --gk-radius, --gk-blur, and --gk-shadow.',
  },
  {
    title: 'Creating Themes with defineTheme()',
    category: 'Theming',
    url: '/docs/theming/define-theme',
    snippet: 'Programmatic custom theme definition with runtime injection and strict WCAG contrast checks.',
  },
  {
    title: 'Dark Mode & System Sync',
    category: 'Theming',
    url: '/docs/theming/dark-mode',
    snippet: 'Light, dark, and auto modes, respecting prefers-color-scheme with automatic updates.',
  },
  {
    title: 'Custom CSS Overrides & Headless Mode',
    category: 'Theming',
    url: '/docs/theming/customization',
    snippet: 'Deep customisation using classNames, custom CSS properties, or completely unstyled headless usage.',
  },

  // Accessibility
  {
    title: 'WCAG 2.2 AA Accessibility Principles',
    category: 'Accessibility',
    url: '/docs/accessibility/principles',
    snippet: 'Live regions (aria-live), focus traps, Esc key handling, Alt+T navigation hotkey, and 0 axe-core errors.',
  },

  // Recipes
  {
    title: 'Recipe: Form Submit Feedback',
    category: 'Recipes',
    url: '/docs/recipes/form-submission',
    snippet: 'Form validation and submission handling with promise toasts and error notifications.',
  },
  {
    title: 'Recipe: Optimistic UI with Undo',
    category: 'Recipes',
    url: '/docs/recipes/optimistic-undo',
    snippet: 'Perform optimistic updates immediately with a 5-second countdown toast and one-click undo callback.',
  },
  {
    title: 'Recipe: File Upload Progress',
    category: 'Recipes',
    url: '/docs/recipes/file-upload',
    snippet: 'Simulate or stream multipart file uploads with live percentage, byte counters, and progress tracks.',
  },
  {
    title: 'Recipe: Destructive Delete Guard',
    category: 'Recipes',
    url: '/docs/recipes/delete-type-to-confirm',
    snippet: 'High-security deletion modal requiring users to type repository or project names to enable delete.',
  },
  {
    title: 'Recipe: Session Inactivity Timeout',
    category: 'Recipes',
    url: '/docs/recipes/session-timeout',
    snippet: 'Session expiration alert with live seconds countdown, extend session button, and auto-logout.',
  },
  {
    title: 'Recipe: 6-Box Discrete OTP Input',
    category: 'Recipes',
    url: '/docs/recipes/otp-verification',
    snippet: 'Discrete numeric inputs with auto-advance, clipboard paste parsing, and resend cooldown countdowns.',
  },

  // Migration
  {
    title: 'Migrating from Sonner',
    category: 'Migration',
    url: '/docs/migration/sonner',
    snippet: 'Side-by-side code comparison, option mapping table, and advantages of upgrading to glazekit.',
  },
  {
    title: 'Migrating from SweetAlert2',
    category: 'Migration',
    url: '/docs/migration/sweetalert2',
    snippet: 'Upgrading from Swal.fire() to modern glass ui.confirm(), ui.prompt(), and ui.steps().',
  },
  {
    title: 'Migrating from React-Toastify',
    category: 'Migration',
    url: '/docs/migration/react-toastify',
    snippet: 'Zero dependency transition guide from React-Toastify to glazekit.',
  },
  {
    title: 'Migrating from react-hot-toast',
    category: 'Migration',
    url: '/docs/migration/react-hot-toast',
    snippet: 'Lightweight upgrade from react-hot-toast with full dialog and bottom-sheet capabilities.',
  },

  // API Reference
  {
    title: 'Core API: toastory/core',
    category: 'API Reference',
    url: '/docs/api/core',
    snippet: 'Framework-agnostic Node-safe engine, store, timers, accessibility rules, and managers.',
  },
  {
    title: 'Web API: toastory',
    category: 'API Reference',
    url: '/docs/api/web',
    snippet: 'Default web export containing ui helper, toast API, dialog controllers, and DOM toaster.',
  },
  {
    title: 'React API: toastory/react',
    category: 'API Reference',
    url: '/docs/api/react',
    snippet: 'React integration: <Toaster /> component, useToast() hook, and SSR hydration safety.',
  },
  {
    title: 'Framework Adapters & Support Matrix',
    category: 'API Reference',
    url: '/docs/api/frameworks',
    snippet: 'Official adapters for Vue, Angular, Svelte, and React Native (Expo + bare).',
  },

  // Interactive Hub
  {
    title: 'Features Catalogue',
    category: 'Hub',
    url: '/features',
    snippet: 'Explore all features with live runnable feedback widgets and API copy snippets.',
  },
  {
    title: 'Themes Studio',
    category: 'Hub',
    url: '/themes',
    snippet: 'Interactive gallery of all 21 themes with contrast ratings, light/dark modes, and instant triggers.',
  },
  {
    title: 'Interactive Playground',
    category: 'Hub',
    url: '/playground',
    snippet: 'Test every option, generate copy-paste code for 6 frameworks, and share configurations via URL.',
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // open is handled by parent, but if closed:
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filtered = query.trim() === ''
    ? SEARCH_INDEX.slice(0, 8)
    : SEARCH_INDEX.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.snippet.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      window.location.href = filtered[selectedIndex].url;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation and features"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#12141e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <svg className="w-5 h-5 text-gray-400 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-base focus:outline-none"
            placeholder="Search guides, components, API tokens, recipes..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-gray-400 bg-white/10 border border-white/10 rounded">
            Esc
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No results found for &ldquo;<span className="text-white font-medium">{query}</span>&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    isSelected ? 'bg-blue-600/20 text-white' : 'hover:bg-white/[0.04] text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-blue-400">{item.category}</span>
                    {isSelected && <span className="text-gray-400">Press Enter ↵</span>}
                  </div>
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.snippet}</div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Navigate with <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">↓</kbd></span>
          <span>Select with <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
}
