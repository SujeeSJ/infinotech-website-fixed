# Start here — corrected Infinotech website

This ZIP contains the complete application source, public images, lockfile, security regression tests and setup documentation. Your design, project content and primary routes are retained. The original empty Hale Nature desktop image is replaced with a clearly labelled SVG placeholder; replace it with the real image when available.

## 1. Run locally

Use Node.js 24 and npm. Extract to a new folder, open that folder in VS Code, then run:

```bash
npm ci
npm run lint
npm test
npm run check:assets
npm run build
npm run dev
```

Open http://localhost:3000. Use `npm start` for the production server after building. There is no static-export deployment: the app needs a Node.js server.

## 2. Configure the protected contact form and AI

Copy `.env.example` to `.env.local` locally. Set the same variables in Hostinger's environment settings for deployment. Your existing API keys were NOT included in this ZIP.

Required for both public APIs:

- Create a persistent Upstash Redis database. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from its REST connection settings, using the write-capable token. Configure it for **no eviction**; eviction of quota keys can reset limits. Use the primary REST endpoint and allow EVAL, GET, INCR, TTL, EXPIRE, SET and DEL commands. Use separate databases for staging and production.
- Generate `RATE_LIMIT_SECRET` once with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Store it as a server secret; use the same value on every replica. Never place it in NEXT_PUBLIC variables. Rotating it resets client/dedup keys.
- Ask your host which **single client-IP header it overwrites**, stripping any client-supplied value before forwarding. Set its name as `TRUSTED_IP_HEADER`. The app deliberately does not guess this or trust the first entry in X-Forwarded-For. Restrict direct access to the Node origin so visitors cannot bypass the trusted proxy. If the host cannot guarantee a trustworthy header, have it provide one before enabling the APIs.
- The default limits are six AI requests per client/minute, thirty AI requests globally/minute, three enquiries per client/ten minutes, ten enquiries globally/minute, and one hundred requests per service per 24-hour quota window. Windows begin with the first request. Failed provider requests consume quota too. Configure `AI_DAILY_REQUEST_LIMIT` and `CONTACT_DAILY_REQUEST_LIMIT` based on capacity and budget (1–10,000). These are request-count caps, not an exact currency spending limit. Configure billing alerts and any available hard provider usage caps as well.

AI needs `OPENAI_API_KEY` with access to `gpt-5-mini`. Responses use at most 1,000 output tokens, bounded history, a 25-second deadline and no automatic retries. `store:false` is sent; it does not override provider abuse-monitoring policies.

Contact needs `RESEND_API_KEY`, a Resend-verified sender in `CONTACT_FROM_EMAIL`, and optionally `CONTACT_TO_EMAIL`. The recipient defaults to info@infinotech.com. A configured address does not verify a domain. Identical enquiry payloads are suppressed for 24 hours, with provider idempotency as a second layer. If delivery is uncertain, the interface asks the visitor to contact the team instead of claiming success or automatically resending.

**Missing/failed Redis or an untrusted/missing production IP header means HTTP 503 and no provider call.** This is deliberate protection, not a broken installation. The main website and WhatsApp/call links still work. There is no insecure in-memory production fallback. During `npm run dev`, a local shared identity is allowed if no trusted IP header is set, but Redis and its secret are still required for real API calls. The test suite uses isolated mocks and requires no real services.

## 3. Deploy with Hostinger

- Application: Next.js/Node.js; Node 24.
- Build: `npm ci` followed by `npm run build`.
- Output: `.next`; start: `npm start`.
- Set the required environment variables above and redeploy.
- Configure HTTPS, a maximum inbound API body of 64 KiB, ingress request timeouts, connection/concurrency limits and edge rate limits. Application byte limits also protect both routes, but the host must protect the connection layer and page rendering.
- Preserve `Cache-Control: private, no-store` for HTML. Pages use a per-request nonce CSP and dynamic rendering. Do NOT enable full-page HTML caching or static export; static JS/CSS/images may still be cached. This has a server-rendering/performance cost compared with the original static pages. Old Lighthouse scores do not apply.
- Enable `ENABLE_HSTS=true` after HTTPS is confirmed, or set HSTS at the HTTPS reverse proxy. The app does not enable includeSubDomains/preload automatically.
- The www host redirects to https://infinotech.com. Additional preview origins must be explicitly added via `ADDITIONAL_ALLOWED_ORIGINS` as exact HTTPS origins. Do not use wildcards.

## 4. Checks before making the deployment public

1. Confirm the business phone is +94 72 131 2154 and recipient mailbox is correct.
2. Submit one real enquiry and verify delivery. Test the assistant once with configured credentials.
3. Confirm the proxy supplies the genuine IP and strips spoofed copies. Confirm limits work across replicas and fail closed if Redis is unavailable. Repeated legitimate users on a shared network share an IP bucket.
4. Check mobile navigation, the privacy page and portfolio images. The Hale Nature desktop placeholder is intentional.
5. Review the privacy page against your actual mailbox/provider retention policies and company details. It describes this implementation; no legal certification is implied.
6. Run `npm audit --omit=dev` and inspect the full `npm audit` separately. See SECURITY-NOTES.md for the remaining lint-tool advisory.
7. Run PageSpeed and accessibility checks on the actual deployed domain. Verify HTTPS and response headers at the outermost proxy.

Do not upload node_modules, build outputs, credentials or an old .env file as public assets. If merging into an existing checkout, remove the old empty `public/projects/hale-nature-desktop.webp`, empty `public/tech` SVGs, `components/MotionDiv.tsx` and `components/case-study/Results.tsx`; these are intentionally absent in this ZIP. Prefer testing this extracted folder as a clean checkout.
