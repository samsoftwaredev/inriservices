import { describe, it, expect, vi } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import About from '../src/app/about/page';
import Contact from '../src/app/contact/page';
import SpanishHome from '../src/app/es/page';
import ServiceDetailPage from '../src/app/services/[slug]/page';
import { crewPhotos, crewPhoto, servicePhotoKeys } from '../src/data/team';
import { services } from '../src/data/services';
import { CrewGallery } from '../src/components/CrewGallery';
import { paintingContractorJsonLd } from '../src/lib/seo';

vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('404'); }, usePathname: () => '/' }));

describe('crew photos', () => {
  it('are optimized files on disk with unique, descriptive alt text and captions', () => {
    expect(crewPhotos).toHaveLength(5);
    expect(new Set(crewPhotos.map((p) => p.alt)).size).toBe(5);
    expect(new Set(crewPhotos.map((p) => p.src)).size).toBe(5);
    for (const p of crewPhotos) {
      expect(existsSync(`public${p.src}`)).toBe(true);
      expect(statSync(`public${p.src}`).size).toBeLessThan(900_000); // web-sized, not the 5 MB originals
      expect(p.alt.length).toBeGreaterThan(40);
      expect(p.caption.length).toBeGreaterThan(10);
    }
  });
  it('throws on an unknown photo key and only maps real services', () => {
    expect(() => crewPhoto('nope')).toThrow();
    for (const slug of Object.keys(servicePhotoKeys)) { expect(services.map((s) => s.slug)).toContain(slug); expect(() => crewPhoto(servicePhotoKeys[slug])).not.toThrow(); }
  });
  it('appear on the home page as a labelled team section with a link to About', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('#team')).not.toBeNull();
    expect(screen.getByRole('heading', { name: /meet the crew/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /more about our team/i })).toHaveAttribute('href', '/about');
  });
  it('fill the About page gallery', () => {
    const { container } = render(<About />);
    expect(container.querySelectorAll('.crew-gallery img')).toHaveLength(5);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
  it('show on the contact page, Spanish page and matching service pages only', async () => {
    expect(render(<Contact />).container.querySelectorAll('.contact-aside img')).toHaveLength(1);
    expect(render(<SpanishHome />).container.querySelectorAll('.crew-figure img')).toHaveLength(1);
    const drywall = render(await ServiceDetailPage({ params: Promise.resolve({ slug: 'drywall-repair' }) }));
    expect(drywall.container.querySelectorAll('.crew-figure img')).toHaveLength(1);
    drywall.unmount();
    const other = render(await ServiceDetailPage({ params: Promise.resolve({ slug: 'pressure-washing' }) }));
    expect(other.container.querySelectorAll('.crew-figure img')).toHaveLength(0);
  });
  it('are included in the business structured data', () => {
    expect(JSON.stringify(paintingContractorJsonLd().image)).toContain('/team/crew-garage-team.jpg');
    render(<CrewGallery />);
  });
});
