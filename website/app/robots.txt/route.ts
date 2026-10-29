export async function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://glazekit.dev/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

