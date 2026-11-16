import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceDetailPage, { generateMetadata, generateStaticParams } from '../src/app/services/[slug]/page';
import { services } from '../src/data/services';

vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); } }));

describe('generated service routes', () => {
  it('creates precisely one route for each listed service', () => {
    expect(generateStaticParams()).toEqual(services.map(s=>({slug:s.slug})));
  });
  it.each(services)('has distinct metadata for $slug', async service => {
    const meta=await generateMetadata({params:Promise.resolve({slug:service.slug})});
    expect(meta.title).toBe(service.title);
    expect(meta.alternates?.canonical).toBe(`/services/${service.slug}`);
    expect(String(meta.description)).toContain('INRI Paint & Wall');
  });
  it.each(services)('renders service detail content for $slug', async service => {
    const component = await ServiceDetailPage({ params: Promise.resolve({ slug: service.slug }) });
    const { container } = render(component);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: service.title })).toBeInTheDocument();
    expect(screen.getByText(service.details)).toBeInTheDocument();
  });
  it('returns not found for nonexistent services', async () => {
    await expect(ServiceDetailPage({ params: Promise.resolve({ slug:'not-a-service' }) })).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
  });
  it('does not index unknown service slugs', async () => {
    const meta=await generateMetadata({params:Promise.resolve({slug:'nothing-here'})});
    expect(meta.robots).toEqual({index:false,follow:false});
  });
});
