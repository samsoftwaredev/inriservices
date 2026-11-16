import { describe, it, expect, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import GuidePage, { generateMetadata as guideMeta, generateStaticParams as guideParams } from '../src/app/guides/[slug]/page';
import GuidesIndex from '../src/app/guides/page';
import PrivacyPage from '../src/app/privacy-policy/page';
import SpanishHome, { metadata as esMeta } from '../src/app/es/page';
import ServiceDetailPage from '../src/app/services/[slug]/page';
import { guides, getGuide, guidePath } from '../src/data/guides';
import { services } from '../src/data/services';
import { beforeAfter } from '../src/data/gallery';
import { MobileActionBar } from '../src/components/MobileActionBar';
import { BeforeAfter } from '../src/components/BeforeAfter';
import { Reviews } from '../src/components/Reviews';
import { PricingPackages } from '../src/components/PricingPackages';
import { shareImageFor, pageMetadata, articleJsonLd } from '../src/lib/seo';
import { business, paymentMethods, publicPaths, navLinks, googleMapsUrl } from '../src/data/business';
import sitemap from '../src/app/sitemap';

vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); }, usePathname: () => '/' }));

describe('guides', () => {
  it('has unique slugs, substantive sections and valid related services', () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const g of guides) {
      expect(g.sections.length).toBeGreaterThanOrEqual(5);
      expect(g.description.length).toBeGreaterThanOrEqual(100);
      expect(g.description.length).toBeLessThanOrEqual(170);
      for (const s of g.related) expect(services.map((x) => x.slug)).toContain(s);
    }
    expect(guideParams()).toEqual(guides.map((g) => ({ slug: g.slug })));
  });
  it.each(guides)('renders $slug with one H1, Article and Breadcrumb markup', async (g) => {
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: g.slug }) }));
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent ?? '')['@type']);
    expect(types).toEqual(['BreadcrumbList', 'Article']);
    const meta = await guideMeta({ params: Promise.resolve({ slug: g.slug }) });
    expect(meta.alternates?.canonical).toBe(guidePath(g.slug));
  });
  it('404s and noindexes unknown guides', async () => {
    await expect(GuidePage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow('404');
    expect((await guideMeta({ params: Promise.resolve({ slug: 'nope' }) })).robots).toEqual({ index: false, follow: false });
    expect(getGuide('nope')).toBeUndefined();
  });
  it('lists all guides and is in nav, paths and sitemap', () => {
    render(<GuidesIndex />);
    for (const g of guides) expect(screen.getByRole('link', { name: g.title })).toHaveAttribute('href', guidePath(g.slug));
    expect(publicPaths).toContain('/guides');
    expect(navLinks.map((n) => n.href)).toContain('/guides');
    const urls = sitemap().map((e) => e.url);
    for (const g of guides) expect(urls).toContain(business.url + guidePath(g.slug));
    expect(urls).toContain(business.url + '/privacy-policy');
    expect(urls).toContain(business.url + '/es');
  });
  it('builds Article markup with the real publish date', () => {
    const a = articleJsonLd({ title: 'T', description: 'D', path: '/guides/x', published: '2026-11-15' });
    expect(a.datePublished).toBe('2026-11-15');
    expect(a.author.name).toBe(business.name);
  });
});

describe('privacy and Spanish pages', () => {
  it('renders the privacy policy describing analytics and form data', () => {
    const { container } = render(<PrivacyPage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByText(/Google Analytics 4/)).toBeInTheDocument();
  });
  it('renders the Spanish landing page with hreflang alternates and a Spanish form', () => {
    const { container } = render(<SpanishHome />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('main')?.getAttribute('lang')).toBe('es');
    expect(esMeta.alternates?.languages).toMatchObject({ 'en-US': '/', 'es-US': '/es', 'x-default': '/' });
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(services.length);
  });
});

describe('conversion components', () => {
  it('renders the mobile bar with call, text and estimate links', () => {
    render(<MobileActionBar />);
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', `tel:${business.phone}`);
    expect(screen.getByRole('link', { name: /Text/ })).toHaveAttribute('href', `sms:${business.phone}`);
    expect(screen.getByRole('link', { name: /Estimate/ })).toHaveAttribute('href', '/contact#estimate');
  });
  it('shows five before/after photos that exist on disk', () => {
    expect(beforeAfter).toHaveLength(5);
    for (const b of beforeAfter) expect(existsSync(`public${b.src}`)).toBe(true);
    const { container } = render(<BeforeAfter />);
    expect(container.querySelectorAll('img')).toHaveLength(5);
  });
  it('links to Google reviews and lists accepted payment methods', () => {
    render(<><Reviews /><PricingPackages /></>);
    expect(screen.getByRole('link', { name: /Read all reviews on Google/ })).toHaveAttribute('href', googleMapsUrl);
    expect(screen.getByText(new RegExp(paymentMethods[0]))).toBeInTheDocument();
  });
  it('shows patch pricing on the drywall service page only', async () => {
    const drywall = render(await ServiceDetailPage({ params: Promise.resolve({ slug: 'drywall-repair' }) }));
    expect(screen.getByText('$50 – $100')).toBeInTheDocument();
    drywall.unmount();
    render(await ServiceDetailPage({ params: Promise.resolve({ slug: 'pressure-washing' }) }));
    expect(screen.queryByText('$50 – $100')).not.toBeInTheDocument();
  });
  it('mobile bar clicks are labelled for analytics', () => {
    render(<MobileActionBar />);
    expect(screen.getByRole('link', { name: /Text/ })).toHaveAttribute('data-analytics-location', 'mobile_bar');
  });
});

describe('per-page share images', () => {
  it('is stable per key, varies across keys and defaults when no key', () => {
    expect(shareImageFor('plano')).toEqual(shareImageFor('plano'));
    expect(new Set(['plano', 'rowlett', 'drywall-repair', 'mesquite', 'garland'].map((k) => shareImageFor(k).url)).size).toBeGreaterThan(1);
    expect(shareImageFor().url).toBe('/work/project-04.jpg');
    const meta = pageMetadata({ title: 'T', description: 'D', path: '/x', imageKey: 'plano' });
    expect((meta.openGraph as { images: { url: string }[] }).images[0].url).toBe(shareImageFor('plano').url);
  });
});
