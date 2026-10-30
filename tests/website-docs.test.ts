import { describe, it, expect } from 'vitest';
import { DOC_NAVIGATION } from '../website/lib/docs/docs-data';
import { ARTICLES_MAP, getArticleBySlug } from '../website/lib/docs/articles';

describe('Website Documentation Completeness', () => {
  it('has documented articles for every item in DOC_NAVIGATION', () => {
    const allNavigationItems = DOC_NAVIGATION.flatMap((section) => section.items);
    expect(allNavigationItems.length).toBeGreaterThanOrEqual(40);

    for (const item of allNavigationItems) {
      const article = ARTICLES_MAP[item.slug];
      expect(article, `Missing article definition for slug "${item.slug}"`).toBeDefined();
      if (!article) continue;

      expect(article.title.length, `Title too short for "${item.slug}"`).toBeGreaterThan(3);
      expect(
        article.description.length,
        `Description too short for "${item.slug}"`,
      ).toBeGreaterThan(10);
      expect(article.content.length, `Content too short for "${item.slug}"`).toBeGreaterThan(100);
      expect(article.category.length, `Category missing for "${item.slug}"`).toBeGreaterThan(1);
      expect(
        article.headings && article.headings.length,
        `Headings missing for "${item.slug}"`,
      ).toBeGreaterThan(0);
    }
  });

  it('covers all migration guides with code comparisons and option tables', () => {
    const migrationSlugs = [
      'migration/sonner',
      'migration/sweetalert2',
      'migration/react-toastify',
      'migration/react-hot-toast',
    ];

    for (const slug of migrationSlugs) {
      const article = ARTICLES_MAP[slug];
      expect(article, `Missing migration article for ${slug}`).toBeDefined();
      if (!article) continue;

      expect(article.content).toContain('Side-by-Side');
      expect(article.content).toContain('|');
      expect(article.content.length).toBeGreaterThan(1500);
    }
  });

  it('provides a resilient fallback via getArticleBySlug for unknown or dynamic slugs', () => {
    const fallback = getArticleBySlug('experimental/future-widget');
    expect(fallback).toBeDefined();
    expect(fallback.title).toContain('Future Widget');
    expect(fallback.category).toBe('EXPERIMENTAL');
    expect(fallback.headings && fallback.headings.length).toBeGreaterThan(0);
  });

  it('verifies package version consistency across package.json and website', async () => {
    const { default: rootPkg } = await import('../package.json');
    const { default: websitePkg } = await import('../website/package.json');
    expect(rootPkg.version).toBe('0.1.2');
    expect(websitePkg.dependencies.toastory).toContain('0.1.2');
  });
});
