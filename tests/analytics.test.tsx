import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({ usePathname: () => '/areas/plano' }));
vi.mock('next/script', () => ({ default: (props: { id?: string; src?: string; children?: string }) => <script data-testid={props.id ?? 'gtag-src'} data-src={props.src}>{props.children}</script> }));

async function load(id: string | undefined) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', id ?? '');
  return import('../src/components/Analytics');
}

beforeEach(() => { delete (window as { gtag?: unknown }).gtag; window.dataLayer = []; });
afterEach(() => vi.unstubAllEnvs());

describe('Analytics', () => {
  it('renders nothing and records nothing without a measurement ID', async () => {
    const { Analytics, trackEvent } = await load(undefined);
    const { container } = render(<Analytics />);
    expect(container).toBeEmptyDOMElement();
    trackEvent('phone_click');
    expect(window.dataLayer).toHaveLength(0);
  });

  it('loads gtag.js with privacy-minimizing config and manual page views', async () => {
    const { Analytics } = await load('G-TEST123456');
    render(<Analytics />);
    expect(screen.getByTestId('gtag-src').dataset.src).toContain('id=G-TEST123456');
    const inline = screen.getByTestId('google-analytics').textContent ?? '';
    expect(inline).toContain('send_page_view: false');
    expect(inline).toContain('allow_google_signals: false');
    expect(inline).toContain('allow_ad_personalization_signals: false');
  });

  it('queues events as arguments objects before gtag.js loads, so they are not dropped', async () => {
    const { trackEvent } = await load('G-TEST123456');
    trackEvent('form_start', { form_name: 'estimate_request' });
    const entry = window.dataLayer[0] as ArrayLike<unknown>;
    expect(Array.isArray(entry)).toBe(false);
    expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]');
    expect(Array.from(entry)).toEqual(['event', 'form_start', { form_name: 'estimate_request' }]);
  });

  it('uses window.gtag once it exists', async () => {
    const { trackEvent } = await load('G-TEST123456');
    const gtag = vi.fn(); window.gtag = gtag;
    trackEvent('x', { a: 1 });
    expect(gtag).toHaveBeenCalledWith('event', 'x', { a: 1 });
  });

  it('sends page_view, and labelled phone/email clicks, without personal data', async () => {
    const { Analytics } = await load('G-TEST123456');
    const gtag = vi.fn(); window.gtag = gtag;
    render(<><Analytics /><a href="tel:+14696467286" data-analytics-location="footer">call</a><a href="mailto:a@b.co" data-analytics-cta="estimate_email" data-analytics-location="callout">mail</a></>);
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({ page_path: '/areas/plano' }));
    fireEvent.click(screen.getByText('call'));
    expect(gtag).toHaveBeenCalledWith('event', 'phone_click', { link_location: 'footer' });
    fireEvent.click(screen.getByText('mail'));
    expect(gtag).toHaveBeenCalledWith('event', 'email_click', { link_location: 'callout' });
    expect(gtag).toHaveBeenCalledWith('event', 'select_content', { content_type: 'cta', item_id: 'estimate_email' });
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/4696467286|a@b\.co/);
  });
});

describe('ContactForm analytics', () => {
  it('reports which fields failed (names only) and the form start, never values', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123456');
    const { ContactForm } = await import('../src/components/ContactForm');
    const gtag = vi.fn(); window.gtag = gtag;
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /send estimate request/i }));
    expect(gtag).toHaveBeenCalledWith('event', 'form_start', { form_name: 'estimate_request' });
    expect(gtag).toHaveBeenCalledWith('event', 'form_error', { form_name: 'estimate_request', invalid_fields: 'fullName,phone,email,description' });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('not-an-email');
  });
});
