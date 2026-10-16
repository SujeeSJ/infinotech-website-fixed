# Infinotech website

Next.js App Router + React + TypeScript + Tailwind CSS. Uses local assets/system fonts, a protected AI route and a protected plain-text enquiry route.

Read **START-HERE.md** before deployment, **SECURITY-NOTES.md** for security boundaries and remaining dependency advisories, and **VALIDATION.md** for checks performed on this delivery.

```bash
npm ci
npm run lint
npm test
npm run check:assets
npm run build
npm run dev
```

See `.env.example` for required credentials and shared quota configuration. No secrets are included. Tests use provider mocks. Complete application source and assets are included; installed dependencies and generated build files are intentionally excluded and recreated with the commands above.
