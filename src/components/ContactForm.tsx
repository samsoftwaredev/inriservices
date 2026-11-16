'use client';
import { useRef, useState, type FormEvent } from 'react';
import { business } from '../data/business';
import { buildMailto, validateContact, type ContactErrors, type ContactValues } from '../lib/contactForm';

const empty: ContactValues = { fullName: '', phone: '', email: '', description: '' };
const order: (keyof ContactValues)[] = ['fullName', 'phone', 'email', 'description'];

/** All four fields are required. Submitting opens the visitor's email app pre-filled (no server or database). */
export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof ContactValues) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setSent(false);
    const first = order.find((k) => found[k]);
    if (first) { (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus(); return; }
    window.location.href = buildMailto(values);
    setSent(true);
  }

  const field = (key: keyof ContactValues) => ({
    id: `cf-${key}`, name: key, value: values[key], onChange: set(key), required: true,
    'aria-required': true as const, 'aria-invalid': errors[key] ? true : undefined, 'aria-describedby': errors[key] ? `cf-${key}-error` : undefined,
  });
  const err = (key: keyof ContactValues) => errors[key] ? <p className="field-error" id={`cf-${key}-error`} role="alert">{errors[key]}</p> : null;

  return (
    <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate aria-label="Request an estimate">
      <p className="form-note"><span aria-hidden="true">*</span> All fields are required.</p>
      <div className="form-row">
        <label htmlFor="cf-fullName">Full name <span aria-hidden="true">*</span></label>
        <input type="text" autoComplete="name" {...field('fullName')} />
        {err('fullName')}
      </div>
      <div className="form-row">
        <label htmlFor="cf-phone">Phone number <span aria-hidden="true">*</span></label>
        <input type="tel" inputMode="tel" autoComplete="tel" {...field('phone')} />
        {err('phone')}
      </div>
      <div className="form-row">
        <label htmlFor="cf-email">Email <span aria-hidden="true">*</span></label>
        <input type="email" autoComplete="email" {...field('email')} />
        {err('email')}
      </div>
      <div className="form-row">
        <label htmlFor="cf-description">What do you need done? <span aria-hidden="true">*</span></label>
        <textarea rows={5} placeholder="Example: patch two holes in a living room wall and repaint the room. Garland, TX." {...field('description')} />
        {err('description')}
      </div>
      <button className="button primary" type="submit">Send estimate request</button>
      {sent && <p className="form-status" role="status">Your email app should open with your request ready to send. If it does not, call <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a> or email <a href={`mailto:${business.email}`}>{business.email}</a>.</p>}
    </form>
  );
}
