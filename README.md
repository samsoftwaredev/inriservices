# INRI Paint & Wall — Marketing-only Next.js website

This is a **replacement frontend** for [`samsoftwaredev/inriservices`](https://github.com/samsoftwaredev/inriservices), based on review of the public code and site. **It is not a commit or pull request.** GitHub write access returned HTTP 403; the original GitHub repository is unchanged.

## What it includes

- Public homepage, about, services index and six detailed service pages
- Service areas, frequently asked questions, estimates and contact pages
- Accessible header, footer, semantic headings, phone and email CTAs
- Next.js 15 App Router metadata, per-page canonicals, dynamic robots and sitemap
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
- The contact form (`ContactForm`) requires full name, phone, email and a project description, validates client-side, and opens the visitor's email app pre-filled via `mailto:`. It does not store or send anything server-side. For direct delivery add a server-side email provider with spam protection.

### Validation status

The current checkout has been validated with `npm run audit:legacy`, `npm run typecheck`, `npm run lint`, `npm test -- --run`, and `npm run build`. The lint command reports one pre-existing warning in `eslint.config.mjs`; there are no lint errors. Before launch, also run a real-device QA pass and submit the generated `/sitemap.xml` in Google Search Console.

## Technical sources

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Next.js metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest)
