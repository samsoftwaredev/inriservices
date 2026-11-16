// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../src/app/api/contact/route';
import { resetRateLimit } from '../src/lib/rateLimit';
import { buildLeadEmail, checkPhoto, escapeHtml, photoFilename } from '../src/lib/contactEmail';

const good = { fullName: 'Jane Smith', phone: '(469) 555-0123', email: 'jane@example.org', description: 'Patch two holes and repaint the living room.', elapsed: '9000', website: '' };
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4, 5, 6, 7, 8]);

function req(fields: Record<string, string> = {}, photos: File[] = [], headers: Record<string, string> = {}) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...good, ...fields })) form.set(k, v);
  photos.forEach((p) => form.append('photos', p));
  return new Request('http://localhost/api/contact', { method: 'POST', body: form, headers: { 'x-forwarded-for': '1.2.3.4', ...headers } });
}

beforeEach(() => {
  resetRateLimit();
  vi.stubEnv('RESEND_API_KEY', 're_test');
  vi.stubEnv('CONTACT_FROM_EMAIL', 'INRI <estimates@example.com>');
  vi.stubEnv('CONTACT_TO_EMAIL', 'owner@example.com');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('POST /api/contact', () => {
  it('returns 503 when email delivery is not configured so the client can fall back', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await POST(req())).status).toBe(503);
  });
  it('sends a valid request through Resend with reply-to, recipient and photo attachments', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(req({ service: 'Drywall Repair', preferredTime: 'mornings' }, [new File([JPEG], 'a.jpg', { type: 'image/jpeg' })]));
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(['owner@example.com']);
    expect(body.reply_to).toBe('jane@example.org');
    expect(body.attachments).toHaveLength(1);
    expect(body.attachments[0].filename).toBe('photo-1.jpg');
    expect(body.text).toContain('Drywall Repair');
  });
  it('silently accepts but never sends honeypot and too-fast submissions', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    expect((await POST(req({ website: 'http://spam.example' }))).status).toBe(200);
    expect((await POST(req({ elapsed: '300' }))).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('rejects missing or invalid required fields', async () => {
    const res = await POST(req({ email: 'nope', description: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toEqual(expect.arrayContaining(['email', 'description']));
  });
  it('rejects a file whose bytes do not match its claimed type, and too many photos', async () => {
    vi.stubGlobal('fetch', vi.fn());
    expect((await POST(req({}, [new File([PNG], 'x.jpg', { type: 'image/jpeg' })]))).status).toBe(400);
    const five = Array.from({ length: 5 }, () => new File([JPEG], 'a.jpg', { type: 'image/jpeg' }));
    expect((await POST(req({}, five))).status).toBe(400);
  });
  it('rejects oversize requests and rate-limits repeated submissions', async () => {
    expect((await POST(req({}, [], { 'content-length': '9999999' }))).status).toBe(413);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    const codes: number[] = [];
    for (let i = 0; i < 7; i++) codes.push((await POST(req())).status);
    expect(codes.slice(0, 5).every((c) => c === 200)).toBe(true);
    expect(codes[6]).toBe(429);
  });
  it('reports a 502 when the email provider fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect((await POST(req())).status).toBe(502);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    resetRateLimit();
    expect((await POST(req())).status).toBe(502);
  });
  it('returns 400 for a body that is not form data', async () => {
    const bad = new Request('http://localhost/api/contact', { method: 'POST', body: 'x', headers: { 'content-type': 'text/plain' } });
    expect((await POST(bad)).status).toBe(400);
  });
});

describe('lead email helpers', () => {
  it('escapes HTML and flattens headers', () => {
    expect(escapeHtml('<script>"&\'')).toBe('&lt;script&gt;&quot;&amp;&#39;');
    const e = buildLeadEmail({ ...good, fullName: 'Jane\r\nBcc: x@y.z', description: '<b>hi</b> there you' }, { photoCount: 0 });
    expect(e.subject).not.toMatch(/[\r\n]/);
    expect(e.html).not.toContain('<b>hi</b>');
    expect(e.text).toContain('Not specified');
  });
  it('validates image signatures and names', () => {
    expect(checkPhoto('image/jpeg', JPEG)).toBe(true);
    expect(checkPhoto('image/png', JPEG)).toBe(false);
    expect(checkPhoto('image/gif', JPEG)).toBe(false);
    expect(checkPhoto('image/jpeg', new Uint8Array(0))).toBe(false);
    expect(photoFilename('image/png', 1)).toBe('photo-2.png');
  });
});
