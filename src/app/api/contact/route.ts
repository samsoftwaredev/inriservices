import { NextResponse } from 'next/server';
import { business } from '../../../data/business';
import { validateContact } from '../../../lib/contactForm';
import { isRateLimited } from '../../../lib/rateLimit';
import { buildLeadEmail, checkPhoto, photoFilename, PHOTO_LIMITS } from '../../../lib/contactEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const field = (form: FormData, key: string) => { const v = form.get(key); return typeof v === 'string' ? v : ''; };

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  // Not configured: the client falls back to opening the visitor's email app.
  if (!apiKey || !from) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  if (Number(request.headers.get('content-length') ?? 0) > PHOTO_LIMITS.maxBytesTotal + 200_000) return NextResponse.json({ error: 'too_large' }, { status: 413 });
  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  // Spam traps: hidden field must stay empty and humans cannot finish the form in under ~2.5s. Bots get a fake success.
  if (field(form, 'website') || Number(field(form, 'elapsed')) < 2500) return NextResponse.json({ ok: true });

  const values = { fullName: field(form, 'fullName'), phone: field(form, 'phone'), email: field(form, 'email'), description: field(form, 'description') };
  const errors = validateContact(values);
  if (Object.keys(errors).length) return NextResponse.json({ error: 'invalid', fields: Object.keys(errors) }, { status: 400 });

  const files = form.getAll('photos').filter((f): f is File => typeof f !== 'string');
  if (files.length > PHOTO_LIMITS.maxFiles) return NextResponse.json({ error: 'too_many_photos' }, { status: 400 });
  const attachments: { filename: string; content: string }[] = [];
  let total = 0;
  for (const [i, file] of files.entries()) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    total += bytes.byteLength;
    if (!checkPhoto(file.type, bytes) || total > PHOTO_LIMITS.maxBytesTotal) return NextResponse.json({ error: 'bad_photo' }, { status: 400 });
    attachments.push({ filename: photoFilename(file.type, i), content: Buffer.from(bytes).toString('base64') });
  }

  const email = buildLeadEmail(values, { service: field(form, 'service'), preferredTime: field(form, 'preferredTime'), pagePath: field(form, 'pagePath'), photoCount: attachments.length });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [process.env.CONTACT_TO_EMAIL || business.email], reply_to: values.email.trim(),
      subject: email.subject, text: email.text, html: email.html, ...(attachments.length ? { attachments } : {}),
    }),
  }).catch(() => null);
  if (!response?.ok) return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
