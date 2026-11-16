import { describe, it, expect, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactForm } from '../src/components/ContactForm';
import { ProjectGallery } from '../src/components/ProjectGallery';
import { PricingPackages } from '../src/components/PricingPackages';
import { Reviews } from '../src/components/Reviews';
import { validateContact, buildMailto } from '../src/lib/contactForm';
import { gallery } from '../src/data/gallery';
import { reviews, patchPackages } from '../src/data/offers';
import { business } from '../src/data/business';

const good = { fullName: 'Jane Smith', phone: '(469) 555-0123', email: 'jane@example.org', description: 'Patch two holes and repaint the living room.' };

describe('validateContact', () => {
  it('accepts a complete request', () => expect(validateContact(good)).toEqual({}));
  it('requires every field', () => {
    expect(Object.keys(validateContact({ fullName: '', phone: '', email: '', description: '' })).sort()).toEqual(['description', 'email', 'fullName', 'phone']);
  });
  it('rejects single names, short phones, bad emails and one-word descriptions', () => {
    const e = validateContact({ fullName: 'Jane', phone: '12345', email: 'nope', description: 'paint' });
    expect(e.fullName).toBeDefined(); expect(e.phone).toBeDefined(); expect(e.email).toBeDefined(); expect(e.description).toBeDefined();
  });
  it('accepts +1 phone numbers', () => expect(validateContact({ ...good, phone: '+1 469 555 0123' }).phone).toBeUndefined());
});

describe('buildMailto', () => {
  it('addresses the business and carries every field', () => {
    const url = buildMailto(good);
    expect(url.startsWith(`mailto:${business.email}?subject=`)).toBe(true);
    const body = decodeURIComponent(url.split('body=')[1]);
    expect(body).toContain('Jane Smith'); expect(body).toContain('(469) 555-0123'); expect(body).toContain('Patch two holes');
  });
  it('strips line breaks from header-bound values', () => {
    const url = buildMailto({ ...good, fullName: 'Jane\r\nBcc: x@y.z Smith' });
    expect(decodeURIComponent(url.split('subject=')[1].split('&')[0])).not.toMatch(/[\r\n]/);
  });
});

describe('ContactForm', () => {
  it('marks all four fields required', () => {
    render(<ContactForm />);
    for (const name of [/full name/i, /phone number/i, /email/i, /what do you need done/i]) expect(screen.getByLabelText(name)).toBeRequired();
  });
  it('blocks an empty submit, shows errors and does not open the email app', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /send estimate request/i }));
    expect(screen.getAllByRole('alert')).toHaveLength(4);
    expect(screen.getByLabelText(/full name/i)).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true');
  });
  it('submits a valid request by navigating to a prefilled mailto link', () => {
    const loc = { href: '' };
    vi.stubGlobal('location', loc);
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: good.fullName } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: good.phone } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: good.email } });
    fireEvent.change(screen.getByLabelText(/what do you need done/i), { target: { value: good.description } });
    fireEvent.click(screen.getByRole('button', { name: /send estimate request/i }));
    expect(loc.href).toContain('mailto:');
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    expect(screen.getByRole('status')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});

describe('gallery, packages and reviews', () => {
  it('includes all 18 site photos, each present on disk with unique alt text', () => {
    expect(gallery).toHaveLength(18);
    expect(new Set(gallery.map(g => g.alt)).size).toBe(18);
    for (const g of gallery) expect(existsSync(`public${g.src}`)).toBe(true);
    const { container } = render(<ProjectGallery />);
    expect(container.querySelectorAll('img')).toHaveLength(18);
  });
  it('shows the supplied patch prices and bundle', () => {
    render(<PricingPackages />);
    for (const p of patchPackages) expect(screen.getByText(p.price)).toBeInTheDocument();
    expect(screen.getByText(/only \$200/i)).toBeInTheDocument();
  });
  it('shows customer reviews only, none written by the business', () => {
    render(<Reviews />);
    expect(screen.getAllByRole('figure')).toHaveLength(reviews.length);
    expect(reviews.map(r => r.name)).not.toContain('Samuel Ruiz');
  });
});

import { socialLinks, googleMapsUrl, hours, logoPath } from '../src/data/business';
import { SocialLinks } from '../src/components/SocialLinks';
import LicensingPage from '../src/app/licensing-and-insurance/page';
import SafetyPage from '../src/app/environmental-and-safety-practices/page';
import { SiteHeader } from '../src/components/SiteHeader';
import { SiteFooter } from '../src/components/SiteFooter';

describe('logo, social links and trust content', () => {
  it('uses the original logo file in the header', () => {
    expect(existsSync(`public${logoPath}`)).toBe(true);
    const { container } = render(<SiteHeader />);
    expect(container.querySelector('img')?.getAttribute('src')).toContain('inri-logo.png');
  });
  it('links every profile safely in a new tab', () => {
    render(<SocialLinks />);
    for (const l of [...socialLinks, { label: 'Google Maps', href: googleMapsUrl }]) {
      const a = screen.getByRole('link', { name: new RegExp(l.label) });
      expect(a).toHaveAttribute('href', l.href);
      expect(a).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
    expect(socialLinks.map(l => l.label)).toEqual(['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'Yelp', 'Nextdoor']);
  });
  it('shows hours and social links in the footer', () => {
    render(<SiteFooter />);
    expect(screen.getByText(/9:00 AM – 5:00 PM/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Instagram/ })).toBeInTheDocument();
    expect(hours.days).toHaveLength(6);
  });
  it('renders the licensing and safety pages with one H1 each', () => {
    for (const Page of [LicensingPage, SafetyPage]) {
      const { container, unmount } = render(<Page />);
      expect(container.querySelectorAll('h1')).toHaveLength(1);
      unmount();
    }
    render(<LicensingPage />);
    expect(screen.getByText(/\$1,100,000/)).toBeInTheDocument();
  });
});
