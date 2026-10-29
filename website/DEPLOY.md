# glazekit Website Deployment Guide

This guide details the continuous integration and deployment architecture for the official glazekit website.

---

## 1. Chosen Platform & Justification

**Chosen Platform: Cloudflare Pages**
- **Edge Performance**: Ultra-fast global CDN with sub-50ms TTFB across 300+ edge locations.
- **Static Output**: Next.js static prerendering generates pure static HTML, CSS, and JS chunks that map directly to Cloudflare Pages.
- **Security & Headers**: Cloudflare \`_headers\` file supports Content Security Policy (CSP), Permissions-Policy, and X-Content-Type-Options out of the box without server runtimes.
- **Zero Cost & Unlimited Bandwidth**: Generous open-source tier suitable for high-traffic documentation sites.

---

## 2. Environment Variables

Configure the following environment variables in your deployment dashboard:

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| \`SITE_URL\` | Yes | \`https://glazekit.dev\` | Canonical origin used for OpenGraph URLs, sitemap generation, and robots feeds. |
| \`NEXT_PUBLIC_ANALYTICS_ID\` | Optional | \`undefined\` | Optional privacy-friendly analytics endpoint (e.g. Plausible or Umami). No cookies used. |

---

## 3. Build & Publish Settings

- **Framework Preset**: Next.js (Static Export)
- **Root Directory**: \`website\`
- **Build Command**: \`npm run build\`
- **Output Directory**: \`website/.next\` or \`website/out\` (when using \`output: 'export'\`)
- **Node.js Version**: \`>= 20.0.0\`

---

## 4. Security Headers (\`_headers\`)

Place a \`_headers\` file in your publish directory to enforce strict security headers:

\`\`\`
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';
\`\`\`

---

## 5. Custom Domain Configuration

1. In Cloudflare Pages, navigate to **Custom Domains**.
2. Add \`glazekit.dev\` and \`www.glazekit.dev\`.
3. Cloudflare will automatically provision a Universal SSL certificate and configure DNS CNAME records.

