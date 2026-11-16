# INRI Paint & Wall — Marketing-only Next.js website

This is a **replacement frontend** for [`samsoftwaredev/inriservices`](https://github.com/samsoftwaredev/inriservices), based on review of the public code and site. **It is not a commit or pull request.** GitHub write access returned HTTP 403; the original GitHub repository is unchanged.

## What it includes

- Public homepage, about, services index and six detailed service pages
- Service areas, frequently asked questions, estimates and contact pages
- Accessible header, footer, semantic headings, phone and email CTAs
- Next.js 15 App Router metadata, per-page canonicals, dynamic robots and sitemap
- Optional GA4 instrumentation with route page views, form starts, estimate-request attempts, phone clicks and email clicks; no visitor form values are sent to Google
- Realistic service descriptions without fabricated testimonials, projects, time-limited promos, flat-rate prices, customer portal or admin application
- No Supabase, accounts, login, signup, admin dashboard, financial management or contact form backend
- Vitest / React Testing Library unit and component tests plus a source audit script

**Lead collection:** Click-to-call and `mailto:` only, so there is no backend database or form. If you later want a web form, add a dedicated server-side provider with spam protection and a privacy notice. Do not place service API keys in frontend code.

## Routes

`/`, `/about`, `/services`, `/services/[slug]`, `/areas`, `/areas/[slug]`, `/frequently-asked-questions`, `/pricing-and-estimates`, `/contact`. All other original app routes are removed. Selected relevant old public routes redirect; internal routes deliberately 404.

## Setup

Requires Node.js 20 or later and network access to npm.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:coverage
npm run audit:legacy
npm run build
```

Or `npm run validate` to run typecheck, lint, tests, and build.

## How to publish

1. **Back up the original repository** and use a new branch, e.g. `refactor/marketing-only-seo`.
2. Copy these project files over the existing repo, **remove all old application directories and files**, and commit as a replacement. A clean checkout is safer than layering these files over the old project. A brand-new repository connected to the existing Vercel project is another option.
3. Run `npm install` to generate `package-lock.json` and commit the lockfile, then `npm run validate`.
4. Confirm business details: Garland service-area base, phone/email, actual available cities and services, and the preferred `www` hostname.
5. Deploy to a preview URL and QA mobile navigation, click-to-call and mailto links. Verify no original client or auth routes remain accessible. Review the generated sitemap and redirect behavior.
6. After launch, set up Google Search Console, submit `/sitemap.xml`, and check key pages for indexing; optimize Google Business Profile separately.

### Important content decisions

- The original schema contained an Austin address (`5900 Balcones Drive`) inconsistent with Garland-area service claims. The replacement does **not** expose a street address, coordinates or office hours. Verify GBP address visibility and business facts before publishing.
- The original `/service/[slugName]` used `Jane Doe`, `example.com` and generic hard-coded content. It has been replaced with actual service copy and an explicit 404 for unknown slugs.
- Unverified pricing, expired 2025 promotions, author attributions, reviews and fake project data are excluded.
- Community pages (`/areas/[slug]`, content in `src/data/areas.ts`) exist for each service city. Google treats near-identical city pages as doorway spam, so each has its own housing context, project mix, local considerations and FAQs, and `tests/areas.test.tsx` fails if copy is shared between cities or is too thin. Only general, verifiable local context is used. Add real project photos/testimonials per city when you have them, and do not add a city you do not actually serve.
- Project photos in `public/work/` are the 18 images from the "What We Can Do for You" section of the existing inripaintwall.com. Descriptions live in `src/data/gallery.ts`. Reviews and patch pricing in `src/data/offers.ts` were supplied by the owner; only add reviews left by customers.
- The contact form (`ContactForm`) requires full name, phone, email and a project description; service, best time and up to 4 photos are optional (photos are shrunk in the browser first). It posts to `/api/contact`, which validates, applies spam traps (hidden field, minimum fill time, rate limit, image signature checks) and emails the request through Resend. If `RESEND_API_KEY`/`CONTACT_FROM_EMAIL` are not set (HTTP 503) or the network fails, the form falls back to opening the visitor's email app pre-filled. Nothing is stored in a database.

### Validation status

The current checkout has been validated with `npm run audit:legacy`, `npm run typecheck`, `npm run lint`, `npm test -- --run`, and `npm run build`. The lint command reports one pre-existing warning in `eslint.config.mjs`; there are no lint errors. Before launch, also run a real-device QA pass and submit the generated `/sitemap.xml` in Google Search Console.

### Analytics setup

Create a GA4 web data stream for the production domain, copy its Measurement ID, and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the deployment environment before building. The site then sends `page_view`, `form_start`, `generate_lead` (a valid estimate-request attempt that opens the visitor's email app), `phone_click`, `email_click`, and CTA selection events. Mark `generate_lead`, `phone_click`, and `email_click` as key events in GA4 only if they match the business's definition of a qualified conversion. Verify events in GA4 Realtime and DebugView after deployment. Search Console remains the source for Google Search impressions, clicks, CTR, queries and average position; Analytics does not directly control ranking.

**GA4 settings to match the code.** In the web stream's Enhanced measurement, turn off "Page changes based on browser history events" (the site already sends its own `page_view` on navigation, so leaving it on double-counts). Events sent: `page_view`, `form_start`, `form_error` (`invalid_fields` lists field names only, never what was typed), `generate_lead`, `phone_click` and `email_click` (each with `link_location`: `home_hero`, `area_hero`, `contact_page`, `callout`, `header`, `footer`), plus `select_content` for CTAs. No names, phone numbers or emails are ever sent, and Google Signals and ad personalization are disabled.

**Answering "why aren't people calling or booking?"**
- *Funnel:* Explore > Funnel exploration: `page_view` > `form_start` > `generate_lead`. Big drop at `form_start` means the form is not inviting; big drop at `generate_lead` plus `form_error` means friction, and `invalid_fields` shows which field.
- *Placement:* Reports > Events > `phone_click` by `link_location` (register `link_location` as a custom dimension) shows which button works.
- *Pages and sources:* compare `phone_click`/`generate_lead` per landing page (city pages vs service pages) and per channel.
- *Limits:* `phone_click` counts taps on the number, not completed calls, and `generate_lead` means the email app opened, not that the email was sent. Real call volume lives in Google Business Profile, or add a call-tracking number. Link GA4 to Search Console to connect queries to these outcomes.

If Search Console provides an HTML-tag verification token, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` before building. Domain-property verification through DNS is also supported and does not require a code change.

### Delivery, booking and optional integrations

Set these in the deployment environment (see `.env.example`): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (a sender on a domain verified in Resend), optional `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_BOOKING_URL` (shows "Book online"), `NEXT_PUBLIC_GOOGLE_REVIEW_URL` (shows "Leave us a review") and `NEXT_PUBLIC_BING_SITE_VERIFICATION`. Vercel serverless requests are limited to about 4.5 MB, so uploads are capped at 4 photos / 4 MB total.

### Added content and pages

- `/guides` and four articles (`src/data/guides.ts`) with Article and breadcrumb markup. Dates are the real publish date, so update `published` if you materially revise a guide.
- `/privacy-policy` is a plain-language template matching what the site actually does. Have it reviewed before relying on it.
- `/es` is a Spanish landing page with hreflang alternates. Have a native speaker review the Spanish before launch; the header and footer remain English.
- Before/after photos come from the previous site's `public/beforeAfterPictures`. The AI-generated "team" images in that repo were deliberately not used.
- Sticky call/text/estimate bar on phones and tablets, "Text us" buttons, accepted payment methods and a Google Maps embed on the contact page.
- Per-page social share images are chosen from the project photos by page slug.
- Lighthouse (mobile, production build): accessibility, best practices and SEO 100 on the home, area and contact pages; performance 94–99 (the first cold request can score lower while images are optimized).

## Technical sources

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Next.js metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest)
