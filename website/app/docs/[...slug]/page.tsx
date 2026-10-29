import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/docs/articles';
import { DOC_NAVIGATION } from '@/lib/docs/docs-data';
import { CodeSnippet } from '@/components/CodeSnippet';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// Generate static params for all known slugs so Next.js statically prerenders them
export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const section of DOC_NAVIGATION) {
    for (const item of section.items) {
      params.push({ slug: item.slug.split('/') });
    }
  }
  return params;
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[var(--site-fg)]">$1</strong>')
    .replace(/\`(.*?)\`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] font-mono text-xs">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
}

export default async function DocArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Calculate Previous and Next links from navigation
  const allArticles: { slug: string; title: string }[] = [];
  DOC_NAVIGATION.forEach((sec) => {
    sec.items.forEach((item) => allArticles.push(item));
  });

  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <article className="w-full text-left">
      {/* Breadcrumbs & Metadata */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[var(--site-muted)] gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Link href="/docs" className="hover:text-[var(--site-fg)]">Docs</Link>
          <span>/</span>
          <span className="font-medium text-[var(--site-muted)]">{article.category}</span>
          <span>/</span>
          <span className="text-blue-500 font-medium">{article.title}</span>
        </div>

        <span className="text-[var(--site-muted)]">Updated {article.lastUpdated}</span>
      </div>

      {/* Title & Description */}
      <div className="border-b border-[var(--site-border)] pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--site-fg)] tracking-tight">
          {article.title}
        </h1>
        <p className="text-base text-[var(--site-muted)] mt-2 leading-relaxed">
          {article.description}
        </p>
      </div>

      {/* Table of Contents Pill Bar */}
      {article.headings && article.headings.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] mb-8">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider block mb-2">
            On this page:
          </span>
          <div className="flex flex-wrap gap-2">
            {article.headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className="text-xs text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 transition-colors"
              >
                {h.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Markdown Body Content */}
      <div className="space-y-6 text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
        {article.content.split('\n\n').map((paragraph, idx) => {
          const trimmed = paragraph.trim();
          if (trimmed.startsWith('# ')) {
            return null; // Skip main title as it is already rendered in header
          }
          if (trimmed.startsWith('### ')) {
            const headingText = trimmed.replace('### ', '');
            const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <h3 key={idx} id={id} className="text-xl sm:text-2xl font-bold text-[var(--site-fg)] pt-6 border-t border-[var(--site-border)]">
                {headingText}
              </h3>
            );
          }
          if (trimmed.startsWith('```')) {
            const lines = trimmed.split('\n');
            const lang = lines[0].replace('```', '') || 'typescript';
            const codeContent = lines.slice(1, -1).join('\n');
            return <CodeSnippet key={idx} code={codeContent} language={lang} />;
          }
          if (trimmed.startsWith('|')) {
            const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
            if (lines.length >= 2) {
              const rawHeaders = lines[0].split('|').slice(1, -1).map((c) => c.trim());
              const dataRows = lines
                .slice(1)
                .filter((l) => !l.includes('---'))
                .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));

              return (
                <div key={idx} className="overflow-x-auto my-6">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        {rawHeaders.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              dangerouslySetInnerHTML={{ __html: renderInline(cell) }}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }
          if (trimmed.startsWith('- ')) {
            const listItems = trimmed.split('\n').map((li) => li.replace(/^[-\*]\s+/, ''));
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2">
                {listItems.map((li, i) => (
                  <li key={i} className="text-[var(--site-muted)]">
                    <span dangerouslySetInnerHTML={{ __html: renderInline(li) }} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p
              key={idx}
              className="text-[var(--site-muted)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
            />
          );
        })}
      </div>

      {/* Optional Options Table */}
      {article.optionsTable && (
        <div className="mt-10 pt-6 border-t border-[var(--site-border)]">
          <h3 id="options" className="text-xl font-bold text-[var(--site-fg)] mb-4">
            Configuration Options
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[var(--site-border)] bg-[var(--site-code-bg)]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--site-border)] bg-[var(--site-table-header)]">
                  <th className="py-3 px-4 font-semibold text-[var(--site-fg)]">Option</th>
                  <th className="py-3 px-4 font-semibold text-[var(--site-fg)]">Type</th>
                  <th className="py-3 px-4 font-semibold text-[var(--site-fg)]">Default</th>
                  <th className="py-3 px-4 font-semibold text-[var(--site-fg)]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--site-border-subtle)] font-mono text-xs">
                {article.optionsTable.map((opt) => (
                  <tr key={opt.name} className="hover:bg-[var(--site-surface-raised)]">
                    <td className="py-3 px-4 text-blue-500 font-semibold">{opt.name}</td>
                    <td className="py-3 px-4 text-purple-400">{opt.type}</td>
                    <td className="py-3 px-4 text-[var(--site-muted)]">{opt.defaultVal}</td>
                    <td className="py-3 px-4 font-sans text-xs text-[var(--site-muted)]">{opt.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Playground Action Pill */}
      <div className="mt-12 p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-[var(--site-fg)]">Want to test these options live?</h4>
          <p className="text-xs text-[var(--site-muted)] mt-1">
            Launch the interactive playground to experiment with themes, positions, and live generators.
          </p>
        </div>
        <Link
          href="/playground"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs whitespace-nowrap transition-colors"
        >
          Open in Playground →
        </Link>
      </div>

      {/* Footer Navigation: Previous & Next Links */}
      <div className="mt-12 pt-6 border-t border-[var(--site-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          {prevArticle ? (
            <Link
              href={`/docs/${prevArticle.slug}`}
              className="group flex flex-col items-start gap-1 p-3 rounded-xl hover:bg-[var(--site-surface-raised)] transition-colors"
            >
              <span className="text-[var(--site-muted)]">← Previous</span>
              <span className="font-semibold text-[var(--site-fg)] group-hover:text-blue-500">{prevArticle.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div>
          {nextArticle ? (
            <Link
              href={`/docs/${nextArticle.slug}`}
              className="group flex flex-col items-end gap-1 p-3 rounded-xl hover:bg-[var(--site-surface-raised)] transition-colors text-right"
            >
              <span className="text-[var(--site-muted)]">Next →</span>
              <span className="font-semibold text-[var(--site-fg)] group-hover:text-blue-500">{nextArticle.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* GitHub Edit Link */}
      <div className="mt-8 text-center sm:text-left text-xs text-[var(--site-muted)]">
        <a
          href={`https://github.com/iamtashanto/toastory/edit/main/docs/${slug}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--site-fg)] transition-colors underline"
        >
          Edit this page on GitHub ↗
        </a>
      </div>
    </article>
  );
}

