import { hasDom } from './dom';

/** Function that turns untrusted HTML into safe HTML. Compatible with `DOMPurify.sanitize`. */
export type Sanitizer = (html: string) => string;

let custom: Sanitizer | undefined;

/**
 * Replaces the built-in sanitizer, for example with DOMPurify:
 * `setSanitizer((html) => DOMPurify.sanitize(html))`.
 * Pass `undefined` to restore the built-in allowlist sanitizer.
 */
export function setSanitizer(fn: Sanitizer | undefined): void {
  custom = fn;
}

const TAGS = new Set(
  'a,abbr,b,blockquote,br,code,div,em,h1,h2,h3,h4,h5,h6,hr,i,img,kbd,li,mark,ol,p,pre,s,small,span,strong,sub,sup,u,ul'.split(
    ',',
  ),
);
const ATTRS = new Set('href,src,alt,title,target,rel,width,height,lang,dir'.split(','));
const URL_ATTRS = new Set(['href', 'src']);
const SAFE_URL = /^(?:https?:|mailto:|tel:|\/|#|\.\/|\.\.\/|[^:]*$)/i;

/** Whether a URL is safe to place in `href` or `src`. Rejects `javascript:` and similar schemes. */
export function safeUrl(url: string): boolean {
  // eslint-disable-next-line no-control-regex -- control character stripping is essential for url security
  return SAFE_URL.test(url.replace(/[\s\u0000-\u001f]/g, ''));
}

function walk(parent: Node): void {
  for (const node of [...parent.childNodes]) {
    if (node.nodeType === 3) continue;
    if (node.nodeType !== 1) {
      parent.removeChild(node);
      continue;
    }
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    if (!TAGS.has(tag)) {
      if (/^(script|style|iframe|object|template)$/.test(tag)) {
        parent.removeChild(node);
      } else {
        walk(element);
        while (element.firstChild) parent.insertBefore(element.firstChild, element);
        parent.removeChild(element);
      }
      continue;
    }
    for (const attr of [...element.attributes]) {
      const name = attr.name.toLowerCase();
      const unsafeUrl = URL_ATTRS.has(name) && !safeUrl(attr.value);
      if (!ATTRS.has(name) || unsafeUrl) element.removeAttribute(attr.name);
    }
    if (element.getAttribute('target') === '_blank')
      element.setAttribute('rel', 'noopener noreferrer');
    walk(element);
  }
}

/**
 * Parses untrusted HTML into an inert fragment containing only allowlisted tags and attributes.
 * Scripts, event handlers, styles and `javascript:` URLs are removed.
 * Returns `null` when no DOM exists.
 */
export function sanitizeToFragment(html: string): DocumentFragment | null {
  if (!hasDom()) return null;
  const pur = (globalThis as { DOMPurify?: { sanitize(h: string): string } }).DOMPurify;
  const external = custom ?? (pur ? (v: string) => pur.sanitize(v) : undefined);
  const template = document.createElement('template');
  template.innerHTML = external ? external(html) : html;
  if (!external) walk(template.content);
  return template.content;
}
