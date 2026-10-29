import { DOC_NAVIGATION } from '@/lib/docs/docs-data';

export async function GET() {
  let output = `# glazekit — AI Assistant Summary (llms.txt)
> Complete UI feedback toolkit for modern web and mobile: toasts, dialogs, bottom sheets, and loading overlays with an Apple-style frosted glass aesthetic. Zero runtime dependencies.

## Key APIs
- \`import { ui, toast } from 'glazekit'\`
- \`toast.success(message, options)\` / \`toast.error()\` / \`toast.warning()\` / \`toast.info()\`
- \`toast.promise(promise, { loading, success, error })\`
- \`await ui.confirm({ title, text, tone: 'danger' })\`
- \`await ui.prompt({ title, input: 'text' | 'otp' | 'range' | ... })\`
- \`await ui.steps(stepsArray)\`
- \`ui.bottomSheet({ title, snapPoints: [0.4, 0.8] })\`
- \`ui.sheet({ title, actions: [...] })\`
- \`ui.loading({ text, progress })\`

## Documentation Pages
`;

  DOC_NAVIGATION.forEach((sec) => {
    output += `\n### ${sec.title}\n`;
    sec.items.forEach((it) => {
      output += `- [${it.title}](https://glazekit.dev/docs/${it.slug}): ${it.summary}\n`;
    });
  });

  return new Response(output, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

