# Changes in this delivery

- Updated Next.js, matching ESLint config, Sharp and compatible transitive dependencies; removed unused framer-motion, react-icons and Resend SDK (mail uses the bounded REST call).
- Added shared atomic Redis quotas, protected JSON parsing, exact origin checks, honeypot, field allowlists, duplicate enquiry reservation, email idempotency, provider/browser deadlines and private API responses.
- Added nonce-based CSP and security headers. Pages now render per request and must not be full-page cached.
- Replaced empty Hale Nature desktop asset with an honest labelled placeholder; removed unused empty SVGs.
- Fixed nested 404 landmark, duplicate title branding, mobile focus/background/resize behavior, contact limits and success announcements; added privacy information and removed nonfunctional social-link labels.
- Removed the no-op animation wrapper and obsolete animation props, removed the unused project-specific Results component, centralized more contact constants and shared form choices, and formatted application source.
- Added 45 regression tests and an asset validation script. Included current audits, route/browser results and updated deployment instructions.

Remaining: five development-only lint dependency entries from a single unpatched braces advisory; real provider/proxy setup and live verification; actual Hale Nature desktop screenshot. See SECURITY-NOTES.md, VALIDATION.md and START-HERE.md. Original uploaded ZIP is unchanged.
