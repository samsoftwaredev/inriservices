'use client';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { bookingUrl, business } from '../data/business';
import { services } from '../data/services';
import { buildMailto, validateContact, type ContactErrors, type ContactValues, type Locale } from '../lib/contactForm';
import { resizeImage } from '../lib/resizeImage';
import { trackEvent } from './Analytics';

const empty: ContactValues = { fullName: '', phone: '', email: '', description: '' };
const order: (keyof ContactValues)[] = ['fullName', 'phone', 'email', 'description'];
const MAX_PHOTOS = 4;

const T = {
  en: {
    aria: 'Request an estimate', required: 'All fields marked * are required.', fullName: 'Full name', phone: 'Phone number', email: 'Email',
    description: 'What do you need done?', placeholder: 'Example: patch two holes in a living room wall and repaint the room. Garland, TX.',
    service: 'Service (optional)', serviceAny: 'Not sure yet', time: 'Best time to reach you (optional)', timePlaceholder: 'Example: weekday mornings',
    photos: 'Photos (optional)', photosHelp: 'Up to 4 photos help us estimate patches and repairs faster.', submit: 'Send estimate request', sending: 'Sending…',
    sent: 'Thank you. We received your request and will respond within 24 hours (business hours Monday to Saturday).',
    fallback: 'Your email app should open with your request ready to send. If it does not, call',
    failed: 'We could not send your request. Please call', or: 'or email', bad: 'Only JPG, PNG or WebP photos are accepted.', tooBig: 'That photo is too large. Try a smaller one.',
    book: 'Prefer to pick a time? Book online', remove: 'Remove',
  },
  es: {
    aria: 'Solicitar un presupuesto', required: 'Todos los campos marcados con * son obligatorios.', fullName: 'Nombre completo', phone: 'Teléfono', email: 'Correo electrónico',
    description: '¿Qué necesita que hagamos?', placeholder: 'Ejemplo: reparar dos agujeros en una pared de la sala y pintar el cuarto. Garland, TX.',
    service: 'Servicio (opcional)', serviceAny: 'Todavía no estoy seguro', time: 'Mejor horario para contactarlo (opcional)', timePlaceholder: 'Ejemplo: mañanas entre semana',
    photos: 'Fotos (opcional)', photosHelp: 'Hasta 4 fotos nos ayudan a presupuestar reparaciones más rápido.', submit: 'Enviar solicitud', sending: 'Enviando…',
    sent: 'Gracias. Recibimos su solicitud y responderemos en 24 horas (horario de lunes a sábado).',
    fallback: 'Se abrirá su app de correo con la solicitud lista para enviar. Si no se abre, llame al',
    failed: 'No pudimos enviar su solicitud. Por favor llame al', or: 'o escriba a', bad: 'Solo se aceptan fotos JPG, PNG o WebP.', tooBig: 'Esa foto es muy grande. Pruebe con una más pequeña.',
    book: '¿Prefiere elegir un horario? Reserve en línea', remove: 'Quitar',
  },
} as const;

type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'failed';

/** All four main fields are required. Sends via /api/contact (with photos); falls back to the visitor's email app. */
export function ContactForm({ locale = 'en' }: { locale?: Locale }) {
  const t = T[locale];
  const [values, setValues] = useState<ContactValues>(empty);
  const [extras, setExtras] = useState({ service: '', preferredTime: '', website: '' });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const formStarted = useRef(false);
  const openedAt = useRef(0);
  useEffect(() => { openedAt.current = Date.now(); }, []);

  const set = (key: keyof ContactValues) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onPhotos(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    setPhotoError('');
    const next = [...photos];
    for (const file of picked) {
      if (next.length >= MAX_PHOTOS) break;
      try { next.push(await resizeImage(file)); }
      catch (err) { setPhotoError((err as Error).message === 'too_large' ? t.tooBig : t.bad); }
    }
    setPhotos(next);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateContact(values, locale);
    setErrors(found);
    setStatus('idle');
    const first = order.find((k) => found[k]);
    if (first) {
      trackEvent('form_error', { form_name: 'estimate_request', invalid_fields: order.filter((k) => found[k]).join(',') });
      (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus('sending');
    const body = new FormData();
    for (const key of order) body.set(key, values[key]);
    body.set('service', extras.service); body.set('preferredTime', extras.preferredTime); body.set('website', extras.website);
    body.set('pagePath', window.location.pathname); body.set('elapsed', String(Date.now() - openedAt.current));
    photos.forEach((p) => body.append('photos', p, p.name));
    try {
      const res = await fetch('/api/contact', { method: 'POST', body });
      if (res.ok) {
        trackEvent('generate_lead', { method: 'form', form_location: window.location.pathname, photo_count: photos.length });
        setStatus('sent');
        return;
      }
      // 503 means server delivery is not configured: use the email-app fallback below. Anything else is a real failure.
      if (res.status !== 503) {
        trackEvent('form_send_failed', { form_name: 'estimate_request', status: res.status });
        setStatus('failed');
        return;
      }
    } catch { /* network error: use the email-app fallback below */ }
    // Server delivery unavailable (not configured or offline): open the visitor's email app instead.
    trackEvent('generate_lead', { method: 'mailto', form_location: window.location.pathname, photo_count: 0 });
    window.location.href = buildMailto(values);
    setStatus('fallback');
  }

  const field = (key: keyof ContactValues) => ({
    id: `cf-${key}`, name: key, value: values[key], onChange: set(key), required: true,
    'aria-required': true as const, 'aria-invalid': errors[key] ? true : undefined, 'aria-describedby': errors[key] ? `cf-${key}-error` : undefined,
  });
  const err = (key: keyof ContactValues) => errors[key] ? <p className="field-error" id={`cf-${key}-error`} role="alert">{errors[key]}</p> : null;
  const phoneLink = <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>;
  const emailLink = <a href={`mailto:${business.email}`}>{business.email}</a>;

  if (status === 'sent') {
    return <div className="form-status form-success" role="status"><p>{t.sent}</p>{bookingUrl && <p><a className="button outline" href={bookingUrl} target="_blank" rel="noopener noreferrer">{t.book}</a></p>}</div>;
  }
  return (
    <form className="contact-form" id="estimate-form" ref={formRef} onSubmit={onSubmit} noValidate aria-label={t.aria} onFocus={() => {
      if (!formStarted.current) { formStarted.current = true; trackEvent('form_start', { form_name: 'estimate_request' }); }
    }}>
      <p className="form-note"><span aria-hidden="true">*</span> {t.required}</p>
      <div className="form-row"><label htmlFor="cf-fullName">{t.fullName} <span aria-hidden="true">*</span></label><input type="text" autoComplete="name" {...field('fullName')} />{err('fullName')}</div>
      <div className="form-row"><label htmlFor="cf-phone">{t.phone} <span aria-hidden="true">*</span></label><input type="tel" inputMode="tel" autoComplete="tel" {...field('phone')} />{err('phone')}</div>
      <div className="form-row"><label htmlFor="cf-email">{t.email} <span aria-hidden="true">*</span></label><input type="email" autoComplete="email" {...field('email')} />{err('email')}</div>
      <div className="form-row"><label htmlFor="cf-description">{t.description} <span aria-hidden="true">*</span></label><textarea rows={5} placeholder={t.placeholder} {...field('description')} />{err('description')}</div>
      <div className="form-row">
        <label htmlFor="cf-service">{t.service}</label>
        <select id="cf-service" name="service" value={extras.service} onChange={(e) => setExtras((x) => ({ ...x, service: e.target.value }))}>
          <option value="">{t.serviceAny}</option>
          {services.map((s) => <option key={s.slug} value={s.shortTitle}>{s.shortTitle}</option>)}
        </select>
      </div>
      <div className="form-row"><label htmlFor="cf-preferredTime">{t.time}</label><input id="cf-preferredTime" name="preferredTime" type="text" placeholder={t.timePlaceholder} value={extras.preferredTime} onChange={(e) => setExtras((x) => ({ ...x, preferredTime: e.target.value }))} /></div>
      <div className="form-row">
        <label htmlFor="cf-photos">{t.photos}</label>
        <input id="cf-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPhotos} disabled={photos.length >= MAX_PHOTOS} aria-describedby="cf-photos-help" />
        <p className="form-note" id="cf-photos-help">{t.photosHelp}</p>
        {photoError && <p className="field-error" role="alert">{photoError}</p>}
        {photos.length > 0 && <ul className="photo-list">{photos.map((p, i) => <li key={p.name + i}>{p.name} <button type="button" onClick={() => setPhotos((all) => all.filter((_, j) => j !== i))}>{t.remove}<span className="visually-hidden"> {p.name}</span></button></li>)}</ul>}
      </div>
      <div className="hp-field" aria-hidden="true"><label htmlFor="cf-website">Website</label><input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={extras.website} onChange={(e) => setExtras((x) => ({ ...x, website: e.target.value }))} /></div>
      <button className="button primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t.sending : t.submit}</button>
      {status === 'fallback' && <p className="form-status" role="status">{t.fallback} {phoneLink}.</p>}
      {status === 'failed' && <p className="form-status" role="alert">{t.failed} {phoneLink} {t.or} {emailLink}.</p>}
      {bookingUrl && <p className="form-note"><a href={bookingUrl} target="_blank" rel="noopener noreferrer">{t.book}</a></p>}
    </form>
  );
}
