import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '../src/app/contact/page';
import Home from '../src/app/page';
import { business, contactFormEmbedUrl, contactFormUrl, estimateFee, trustPoints } from '../src/data/business';
import { commonFaqs } from '../src/lib/faq';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

describe('Google Form embed', () => {
  beforeEach(() => { delete (window as { gtag?: unknown }).gtag; });
  afterEach(() => vi.unstubAllEnvs());

  async function load() {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123456');
    const gtag = vi.fn(); window.gtag = gtag;
    const { GoogleFormEmbed } = await import('../src/components/GoogleFormEmbed');
    return { GoogleFormEmbed, gtag };
  }

  it('embeds the owner’s exact Google Form with an accessible title', async () => {
    const { GoogleFormEmbed } = await load();
    render(<GoogleFormEmbed />);
    const frame = screen.getByTitle('Estimate request form');
    expect(frame).toHaveAttribute('src', 'https://docs.google.com/forms/d/e/1FAIpQLSeLwFHFavzS9xZOamOBW46mQN8QYE9MamdgYExtRNo2lfHCfw/viewform?embedded=true');
    expect(contactFormEmbedUrl).toContain('embedded=true');
    expect(screen.getByRole('link', { name: /open it in a new tab/i })).toHaveAttribute('href', contactFormUrl);
  });
  it('counts a lead only when the iframe loads a second time (the confirmation page), once', async () => {
    const { GoogleFormEmbed, gtag } = await load();
    render(<GoogleFormEmbed />);
    const frame = screen.getByTitle('Estimate request form');
    fireEvent.load(frame);
    expect(gtag).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
    fireEvent.load(frame);
    fireEvent.load(frame);
    expect(gtag.mock.calls.filter((c) => c[1] === 'generate_lead')).toEqual([['event', 'generate_lead', { method: 'google_form', form_location: '/' }]]);
  });
  it('records form_start once when the visitor clicks into the iframe', async () => {
    const { GoogleFormEmbed, gtag } = await load();
    render(<GoogleFormEmbed />);
    const frame = screen.getByTitle('Estimate request form');
    frame.focus();
    Object.defineProperty(document, 'activeElement', { configurable: true, get: () => frame });
    fireEvent.blur(window);
    fireEvent.blur(window);
    expect(gtag.mock.calls.filter((c) => c[1] === 'form_start')).toHaveLength(1);
    Object.defineProperty(document, 'activeElement', { configurable: true, get: () => document.body });
  });
  it('tells visitors how to send photos, since Google Forms uploads require a Google sign-in', async () => {
    const { GoogleFormEmbed } = await load();
    render(<GoogleFormEmbed />);
    expect(screen.getByRole('link', { name: business.phoneDisplay })).toHaveAttribute('href', `sms:${business.phone}`);
  });
});

describe('estimate fee and pages', () => {
  it('states the $30 fee is deducted from the final price', () => {
    expect(estimateFee.amount).toBe('$30');
    expect(estimateFee.summary).toMatch(/\$30.*deducted from your final price/);
    expect(commonFaqs.find((f) => f.question === 'How much does an estimate cost?')?.answer).toContain('$30');
    expect(trustPoints.join(' ')).toContain('$30');
  });
  it('contact page shows the fee, the embedded form and no leftover custom form', () => {
    const { container } = render(<Contact />);
    expect(screen.getAllByText(/\$30/).length).toBeGreaterThan(0);
    expect(container.querySelector('iframe[title="Estimate request form"]')).not.toBeNull();
    expect(container.querySelector('form.contact-form')).toBeNull();
    expect(container.querySelector('#estimate')).not.toBeNull();
  });
  it('home page embeds the same form in its own estimate section with in-page links', () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll('iframe[title="Estimate request form"]')).toHaveLength(1);
    expect(container.querySelector('section#estimate')?.textContent).toContain('$30');
    expect(container.querySelector('#estimate-form iframe')).not.toBeNull();
    const hero = container.querySelector('a[data-analytics-location="home_hero"][data-analytics-cta="estimate_form"]');
    expect(hero).toHaveAttribute('href', '#estimate');
  });
});
