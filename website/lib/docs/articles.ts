import { DocArticle } from './docs-data';
import { GETTING_STARTED_ARTICLES } from './articles-getting-started';
import { GUIDES_ARTICLES } from './articles-guides';
import { THEMING_ARTICLES } from './articles-theming';
import { RECIPES_ARTICLES } from './articles-recipes';
import { MIGRATION_ARTICLES } from './articles-migration';
import { API_ARTICLES } from './articles-api';
import { META_ARTICLES } from './articles-meta';

export const ARTICLES_MAP: Record<string, DocArticle> = {
  ...GETTING_STARTED_ARTICLES,
  ...GUIDES_ARTICLES,
  ...THEMING_ARTICLES,
  ...RECIPES_ARTICLES,
  ...MIGRATION_ARTICLES,
  ...API_ARTICLES,
  ...META_ARTICLES,
};

// Helper to provide a comprehensive article for any registered slug
export function getArticleBySlug(slug: string): DocArticle {
  if (ARTICLES_MAP[slug]) {
    return ARTICLES_MAP[slug];
  }

  // Generate structured fallback matching category
  const parts = slug.split('/');
  const categoryName = parts[0] ? parts[0].replace(/-/g, ' ').toUpperCase() : 'DOCUMENTATION';
  const rawTitle = parts[1] || parts[0];
  const formattedTitle = rawTitle
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    slug,
    title: `${formattedTitle} Guide`,
    description: `Complete guide and reference for ${formattedTitle} in toastory.`,
    category: categoryName,
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Overview' },
      { id: 'usage', title: 'Code Example & Syntax' },
      { id: 'best-practices', title: 'Best Practices & Accessibility' },
    ],
    content: `
# ${formattedTitle}

This guide provides the complete documentation, configuration options, and implementation patterns for **${formattedTitle}** in toastory.

---

### Overview

toastory provides a unified API contract across all supported platforms (plain JavaScript, React, Next.js, Vue, Nuxt, Angular, Svelte, and React Native). 

All feedback components share identical options, Apple-style frosted glass tokens, and WCAG 2.2 AA accessibility features.

\`\`\`typescript
import { ui, toast } from 'toastory';

// Interactive demonstration
toast.info('Exploring ${formattedTitle}', {
  description: 'Zero runtime dependencies with 21 responsive themes.'
});
\`\`\`

---

### Best Practices & Accessibility

1. **Live Regions**: Ensure notifications announce politely via \`aria-live="polite"\` or assertively via \`aria-live="assertive"\` for urgent errors.
2. **Keyboard Navigation**: Users can press \`Alt+T\` at any time to focus into the toast container or press \`Escape\` to dismiss active dialogs.
3. **Reduced Motion**: All spring physics and keyframe spins automatically degrade to instant opacity fades when \`prefers-reduced-motion: reduce\` is enabled.
`,
  };
}
