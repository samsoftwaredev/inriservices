import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AreaPage, { generateMetadata, generateStaticParams } from '../src/app/areas/[slug]/page';
import { areas, getArea, areaPath } from '../src/data/areas';
import { services } from '../src/data/services';
import { business } from '../src/data/business';
import { areaServiceJsonLd, breadcrumbJsonLd } from '../src/lib/seo';
import sitemap from '../src/app/sitemap';

vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); } }));

const words = (a: typeof areas[number]) => [a.lead, ...a.context, ...a.needs.flatMap(n => [n.title, n.text]), a.goodToKnow, ...a.questions.flatMap(q => [q.question, q.answer])].join(' ').split(/\s+/).length;

describe('area data (doorway-page guard)', () => {
  it('covers exactly the declared service cities', () => {
    expect(areas.map(a => a.name).sort()).toEqual([...business.areaCities].sort());
  });
  it('has unique slugs, titles, descriptions and leads', () => {
    for (const key of ['slug', 'metaTitle', 'metaDescription', 'lead', 'goodToKnow', 'contextHeading'] as const)
      expect(new Set(areas.map(a => a[key])).size).toBe(areas.length);
  });
  it('shares no body paragraph, need text or FAQ answer between cities', () => {
    const all = areas.flatMap(a => [...a.context, ...a.needs.map(n => n.text), ...a.questions.map(q => q.answer)]);
    expect(new Set(all).size).toBe(all.length);
  });
  it.each(areas)('$slug has substantive, correctly sized copy', area => {
    expect(words(area)).toBeGreaterThan(300);
    expect(area.metaTitle.length).toBeLessThanOrEqual(40);
    expect(area.metaTitle).toContain(area.name);
    expect(area.metaDescription.length).toBeGreaterThanOrEqual(120);
    expect(area.metaDescription.length).toBeLessThanOrEqual(160);
    expect(area.metaDescription).toContain('INRI Paint & Wall');
    for (const n of area.needs) expect(services.map(s => s.slug)).toContain(n.serviceSlug);
    for (const s of area.nearby) { expect(getArea(s)).toBeDefined(); expect(s).not.toBe(area.slug); }
  });
  it('does not fabricate reviews, ratings, projects or an address', () => {
    const text = JSON.stringify(areas);
    expect(text).not.toMatch(/\b\d+ (reviews|projects)\b|5-star|five-star|aggregateRating|Austin|Balcones|completed .* in/i);
  });
});

describe('area routes', () => {
  it('generates one static route per area and 404s unknown ones', async () => {
    expect(generateStaticParams()).toEqual(areas.map(a => ({ slug: a.slug })));
    await expect(AreaPage({ params: Promise.resolve({ slug: 'nowhere' }) })).rejects.toThrow('404');
    expect((await generateMetadata({ params: Promise.resolve({ slug: 'nowhere' }) })).robots).toEqual({ index: false, follow: false });
  });
  it.each(areas)('has self-canonical metadata for $slug', async area => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: area.slug }) });
    expect(meta.title).toBe(area.metaTitle);
    expect(meta.alternates?.canonical).toBe(areaPath(area.slug));
  });
  it.each(areas)('renders one H1, breadcrumb and valid JSON-LD for $slug', async area => {
    const { container } = render(await AreaPage({ params: Promise.resolve({ slug: area.slug }) }));
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(area.name);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent ?? ''));
    expect(blocks.map(b => b['@type'])).toEqual(['BreadcrumbList', 'Service']);
    expect(JSON.stringify(blocks)).not.toMatch(/aggregateRating|review|streetAddress/i);
  });
  it('lists every area in the sitemap without ignored fields', () => {
    const entries = sitemap();
    const urls = entries.map(e => e.url);
    for (const a of areas) expect(urls).toContain(business.url + areaPath(a.slug));
    expect(entries.every(e => !('priority' in e) && !('changeFrequency' in e))).toBe(true);
  });
  it('builds structured data that points at the site-wide business entity', () => {
    expect(areaServiceJsonLd({ name: 'Plano', path: '/areas/plano' }).provider['@id']).toBe(`${business.url}/#business`);
    expect(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'X', path: '/x' }]).itemListElement[1].position).toBe(2);
  });
});
