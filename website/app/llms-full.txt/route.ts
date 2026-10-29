import { DOC_NAVIGATION } from '@/lib/docs/docs-data';
import { getArticleBySlug } from '@/lib/docs/articles';

export async function GET() {
  let fullOutput = `# glazekit — Full Reference Documentation (llms-full.txt)
Package: glazekit
Version: 0.1.0
License: MIT
Repository: https://github.com/glazekit/glazekit

================================================================================
`;

  DOC_NAVIGATION.forEach((sec) => {
    fullOutput += `\n\n# SECTION: ${sec.title.toUpperCase()}\n`;
    sec.items.forEach((it) => {
      const art = getArticleBySlug(it.slug);
      fullOutput += `\n--------------------------------------------------------------------------------\n`;
      fullOutput += `## Document: ${art.title} (slug: /docs/${art.slug})\n`;
      fullOutput += `Description: ${art.description}\n\n`;
      fullOutput += art.content + '\n';
      if (art.optionsTable) {
        fullOutput += '\nOptions Table:\n';
        art.optionsTable.forEach((opt) => {
          fullOutput += `- ${opt.name} (${opt.type}, default: ${opt.defaultVal}): ${opt.description}\n`;
        });
      }
    });
  });

  return new Response(fullOutput, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

