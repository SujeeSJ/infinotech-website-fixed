# Validation — 16 October 2026

## Current checks

- Installed patched Next.js 16.4.2 with matching ESLint config and Sharp 0.35.5.
- Production Webpack build and TypeScript: passed.
- ESLint: passed without errors or warnings.
- Node regression suite: 45 tests passed, zero failed. Covers both route handlers' boundary validation, rate-limit failure/429 paths, unknown fields, payload size, honeypot, strict role handling, fixed email recipient, duplicates, idempotency, provider failures and ambiguity. Providers and Redis REST responses are mocked; no real email or paid AI call occurred.
- Asset validation: all 27 referenced images decode; no empty public files. The missing Hale Nature desktop image is an explicitly labelled SVG placeholder.
- Production dependency audit: zero reported vulnerabilities at audit time. Full development tree: five high entries on the braces lint dependency chain; see SECURITY-NOTES.md and the saved JSON audit reports.
- All 14 normal public page routes (including the new privacy page): HTTP 200, one main and H1, nonce-bearing scripts and private/no-store HTML.
- `/missing-page`: HTTP 404 with one main and H1. `/work/unknown-project`: HTTP 404; its initial HTML response is a framework shell. The hydrated browser UI correctly contains one main and one H1.
- robots.txt and sitemap.xml: HTTP 200.
- Nonce values differ between page responses. No arbitrary inline-script allowance in production CSP. Inline styles remain permitted.

- Chromium checks at 375px and 1440px: all 14 pages and two 404 routes have one main/H1, no horizontal document overflow and no broken loaded images. Zero page JavaScript errors and zero observed CSP violations.
- Mobile navigation: open/background inert, Escape close, and desktop-resize scroll unlocking passed. Chat displays a mocked HTTP 429 error correctly. These are targeted interaction checks, not a full accessibility certification.
- Home/mobile and contact/desktop screenshots inspected internally for layout. Screenshots are not included in this delivery.

Browser evidence: `validation/browser-checks.json`.

Raw local HTTP results: `validation/routes.json`. Dependency results: `validation/npm-audit-production.json` and `validation/npm-audit-all.json`.

## Not verified against live services

Hostinger deployment, authentic proxy headers, live Redis connection/Lua execution under concurrent traffic, actual OpenAI responses, Resend domain verification/mailbox delivery, WhatsApp account ownership, edge DDoS controls, TLS configuration, and billing settings. Run the checklist in START-HERE.md before production activation.

Old Lighthouse scores are archived in `validation/previous-delivery/`; they do not apply to this dynamically rendered nonce-CSP delivery. No fresh Lighthouse certification or guarantee of perfect security is implied.
