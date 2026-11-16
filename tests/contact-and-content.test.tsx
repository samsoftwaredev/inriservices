import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => vi.unstubAllGlobals());
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
  const fill = () => {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: good.fullName } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: good.phone } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: good.email } });
    fireEvent.change(screen.getByLabelText(/what do you need done/i), { target: { value: good.description } });
    fireEvent.click(screen.getByRole('button', { name: /send estimate request/i }));
  };
  it('posts the request to the API and shows a confirmation on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm />);
    fill();
    expect(await screen.findByRole('status')).toHaveTextContent(/received your request/i);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/contact');
    expect((init.body as FormData).get('fullName')).toBe(good.fullName);
    expect((init.body as FormData).get('website')).toBe('');
  });
  it('falls back to a prefilled mailto link when server delivery is not configured (503)', async () => {
    const loc = { href: '', pathname: '/contact' };
    vi.stubGlobal('location', loc);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    render(<ContactForm />);
    fill();
    expect(await screen.findByRole('status')).toHaveTextContent(/email app should open/i);
    expect(loc.href).toContain('mailto:');
  });
  it('falls back to mailto when the network request itself fails', async () => {
    const loc = { href: '', pathname: '/contact' };
    vi.stubGlobal('location', loc);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    render(<ContactForm />);
    fill();
    await screen.findByRole('status');
    expect(loc.href).toContain('mailto:');
  });
  it('shows the phone number when the server rejects the request (not a mailto fallback)', async () => {
    const loc = { href: '', pathname: '/contact' };
    vi.stubGlobal('location', loc);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));
    render(<ContactForm />);
    fill();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not send/i);
    expect(loc.href).toBe('');
  });
  it('renders Spanish labels and validation messages', () => {
    render(<ContactForm locale="es" />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeRequired();
    fireEvent.click(screen.getByRole('button', { name: /enviar solicitud/i }));
    expect(screen.getAllByRole('alert')[0]).toHaveTextContent(/escriba su nombre/i);
  });
  it('offers optional service, time and photo fields that are not required', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/service \(optional\)/i)).not.toBeRequired();
    expect(screen.getByLabelText(/best time/i)).not.toBeRequired();
    expect(screen.getByLabelText(/photos/i)).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
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
