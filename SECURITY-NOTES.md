# Security notes

## Implemented controls

- Patched Next.js 16.4.2, matching Next ESLint config, and Sharp 0.35.5. Lockfile refreshed; unused animation/icon/email SDK dependencies removed.
- Shared atomic Redis quotas for both paid-provider entry points; per-client, global-per-minute and global-24-hour limits. Failure of configuration or Redis blocks provider calls. Hashed client identities, no raw IP or message storage in quota keys.
- JSON content type and exact browser Origin validation, Fetch Metadata cross-site rejection, byte-counted stream reads with a deadline, rejection of unexpected fields, strict roles, bounded lengths, honeypot and service/budget allowlists.
- Fixed-recipient plain-text email, 24-hour duplicate reservation, provider idempotency and no blind retry after ambiguous delivery. Server and browser deadlines. Raw provider responses and user messages are not logged.
- Per-request nonce script CSP, framing denial, no-sniff, referrer and permissions policy. Optional HSTS when HTTPS is configured. JSON-LD uses nonce and escapes `<`. Inline styles are permitted because the UI/image layout uses them; arbitrary inline scripts are not.
- User-facing privacy explanation, accessible submission feedback and improved mobile navigation handling.

## Remaining development dependency advisory

At this delivery's audit, the only remaining full-tree findings are five **high** package entries on one development-only dependency chain:

`eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces@3.0.3`

Underlying advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm — deeply nested brace patterns can exhaust the stack. The registry's latest `braces` was 3.0.3 when checked; no compatible published patched release was available. The other four entries are propagation of that dependency finding, not four separate demonstrated exploits.

The production-only audit is recorded separately in `validation/npm-audit-production.json`. Do not run `npm audit fix --force`: npm proposed downgrading Next's ESLint config to 14.2.35, which would mismatch this Next 16 project. Lint tooling has been retained instead of being removed to hide the audit warning. Restrict CI to trusted source/configuration; do not feed arbitrary user glob patterns into the linter, and keep lint tooling out of the running production artifact where your hosting workflow permits. Update this dependency chain once a compatible upstream fix is released. No private patched fork or audit suppression has been introduced.

## Deployment and residual boundaries

The code cannot set up the host's proxy trust, Redis account, email domain verification or provider keys for you. See START-HERE.md. Rate limiting reduces abuse, but does not replace edge DDoS protection, monitoring or provider spending controls. Bots may still consume the deliberately bounded quotas and temporarily deny legitimate service. A honeypot is an additional signal, not a proof of humanity. Browser-origin checks do not authenticate non-browser callers.

AI conversation history is visitor-supplied and untrusted. Structured roles and instructions improve handling but cannot guarantee resistance to prompt injection or factual errors. The assistant has no action tools or access to other visitors' data. The existing client portfolio is authoritative for examples.

No real emails/AI calls or production changes were made in preparing this ZIP. Review and test the deployment with your configured services. No claim of 100% security is made.
