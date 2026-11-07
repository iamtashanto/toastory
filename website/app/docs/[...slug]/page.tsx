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

interface MarkdownBlock {
  type: 'heading' | 'code' | 'table' | 'list' | 'ordered-list' | 'callout' | 'paragraph' | 'divider';
  level?: number;
  text?: string;
  code?: string;
  language?: string;
  filename?: string;
  items?: string[];
  calloutType?: 'note' | 'tip' | 'important' | 'warning';
  tableHeaders?: string[];
  tableRows?: string[][];
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Code block
    if (trimmed.startsWith('```')) {
      const header = trimmed.slice(3).trim();
      let language = header || 'typescript';
      let filename: string | undefined;
      if (header.includes(':') || header.includes(' ')) {
        const parts = header.split(/[:\s]+/);
        language = parts[0];
        filename = parts.slice(1).join(' ');
      }
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing ```
      blocks.push({
        type: 'code',
        code: codeLines.join('\n'),
        language,
        filename,
      });
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          text: match[2],
        });
        i++;
        continue;
      }
    }

    // Callout / Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      let calloutType: 'note' | 'tip' | 'important' | 'warning' = 'note';
      let calloutText = quoteLines.join('\n');
      const alertMatch = calloutText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
      if (alertMatch) {
        const tag = alertMatch[1].toLowerCase();
        calloutType =
          tag === 'tip'
            ? 'tip'
            : tag === 'warning' || tag === 'caution'
              ? 'warning'
              : tag === 'important'
                ? 'important'
                : 'note';
        calloutText = alertMatch[2] + (quoteLines.length > 1 ? '\n' + quoteLines.slice(1).join('\n') : '');
      }
      blocks.push({
        type: 'callout',
        calloutType,
        text: calloutText.trim(),
      });
      continue;
    }

    // Table
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const rawHeaders = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
        const dataRows = tableLines
          .slice(1)
          .filter((l) => !l.includes('---'))
          .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
        blocks.push({
          type: 'table',
          tableHeaders: rawHeaders,
          tableRows: dataRows,
        });
        continue;
      }
    }

    // Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'list',
        items: listItems,
      });
      continue;
    }

    // Ordered List
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'ordered-list',
        items: listItems,
      });
      continue;
    }

    // Paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      lines[i].trim() !== '---'
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraphLines.join(' '),
      });
    }
  }

  return blocks;
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
        {parseMarkdownBlocks(article.content).map((block, idx) => {
          if (block.type === 'heading') {
            const headingText = block.text ?? '';
            const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (block.level === 1) {
              return null; // Skip main title as it is already rendered in header
            }
            if (block.level === 2) {
              return (
                <h2
                  key={idx}
                  id={id}
                  className="text-2xl sm:text-3xl font-extrabold text-[var(--site-fg)] pt-8 pb-2 border-b border-[var(--site-border)] tracking-tight scroll-mt-24"
                >
                  <a href={`#${id}`} className="hover:underline">
                    {headingText}
                  </a>
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={idx}
                  id={id}
                  className="text-lg sm:text-xl font-bold text-[var(--site-fg)] pt-4 scroll-mt-24"
                >
                  <a href={`#${id}`} className="hover:underline">
                    {headingText}
                  </a>
                </h3>
              );
            }
            return (
              <h4 key={idx} id={id} className="text-base font-semibold text-[var(--site-fg)] pt-2 scroll-mt-24">
                {headingText}
              </h4>
            );
          }

          if (block.type === 'code') {
            return (
              <CodeSnippet
                key={idx}
                code={block.code ?? ''}
                language={block.language ?? 'typescript'}
                filename={block.filename}
              />
            );
          }

          if (block.type === 'callout') {
            const alertTone =
              block.calloutType === 'tip'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : block.calloutType === 'warning'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : block.calloutType === 'important'
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                    : 'border-blue-500/40 bg-blue-500/10 text-blue-300';

            const badgeLabel =
              block.calloutType === 'tip'
                ? 'TIP'
                : block.calloutType === 'warning'
                  ? 'WARNING'
                  : block.calloutType === 'important'
                    ? 'IMPORTANT'
                    : 'NOTE';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 border ${alertTone} my-4 text-xs sm:text-sm text-[var(--site-fg)]`}
              >
                <div className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>{badgeLabel}</span>
                </div>
                <div
                  className="leading-relaxed opacity-90 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: renderInline(block.text ?? '') }}
                />
              </div>
            );
          }

          if (block.type === 'table') {
            return (
              <div key={idx} className="overflow-x-auto my-6 rounded-xl border border-[var(--site-border)]">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[var(--site-border)] bg-[var(--site-surface-raised)]">
                      {block.tableHeaders?.map((h, i) => (
                        <th key={i} className="py-3 px-4 font-semibold text-[var(--site-fg)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--site-border-subtle)]">
                    {block.tableRows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[var(--site-surface-raised)]/50">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="py-3 px-4 text-[var(--site-muted)]"
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

          if (block.type === 'list') {
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 my-3">
                {block.items?.map((li, i) => (
                  <li key={i} className="text-[var(--site-muted)]">
                    <span dangerouslySetInnerHTML={{ __html: renderInline(li) }} />
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === 'ordered-list') {
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1.5 pl-2 my-3">
                {block.items?.map((li, i) => (
                  <li key={i} className="text-[var(--site-muted)]">
                    <span dangerouslySetInnerHTML={{ __html: renderInline(li) }} />
                  </li>
                ))}
              </ol>
            );
          }

          if (block.type === 'divider') {
            return <hr key={idx} className="my-8 border-[var(--site-border)]" />;
          }

          return (
            <p
              key={idx}
              className="text-[var(--site-muted)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderInline(block.text ?? '') }}
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

