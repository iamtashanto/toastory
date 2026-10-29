import { DOC_NAVIGATION } from '@/lib/docs/docs-data';

export async function GET() {
  const baseUrl = 'https://toastory.tashanto.com';

  const staticRoutes = [
    '',
    '/features',
    '/themes',
    '/playground',
    '/docs',
    '/changelog',
    '/roadmap',
    '/security',
    '/privacy',
  ];

  const docRoutes: string[] = [];
  DOC_NAVIGATION.forEach((sec) => {
    sec.items.forEach((it) => {
      docRoutes.push(`/docs/${it.slug}`);
    });
  });

  const allUrls = [...staticRoutes, ...docRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
      .map(
        (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>2026-10-30</lastmod>
    <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/docs') ? '0.8' : '0.6'}</priority>
  </url>`
      )
      .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
