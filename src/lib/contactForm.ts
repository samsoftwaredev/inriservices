import { business } from '../data/business';

export type ContactValues = { fullName: string; phone: string; email: string; description: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export type Locale = 'en' | 'es';
const MESSAGES = {
  en: { name: 'Enter your full name.', name2: 'Enter your first and last name.', phone: 'Enter a phone number.', phone2: 'Enter a valid 10-digit phone number.', email: 'Enter your email address.', email2: 'Enter a valid email address.', desc: 'Briefly describe what you need done.', desc2: 'Add a little more detail (at least 10 characters).' },
  es: { name: 'Escriba su nombre completo.', name2: 'Escriba su nombre y apellido.', phone: 'Escriba un número de teléfono.', phone2: 'Escriba un número de 10 dígitos válido.', email: 'Escriba su correo electrónico.', email2: 'Escriba un correo electrónico válido.', desc: 'Describa brevemente lo que necesita.', desc2: 'Agregue un poco más de detalle (al menos 10 caracteres).' },
} as const;

export function validateContact(v: ContactValues, locale: Locale = 'en'): ContactErrors {
  const m = MESSAGES[locale];
  const errors: ContactErrors = {};
  if (!v.fullName.trim()) errors.fullName = m.name;
  else if (v.fullName.trim().split(/\s+/).length < 2) errors.fullName = m.name2;
  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) errors.phone = m.phone;
  else if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) errors.phone = m.phone2;
  if (!v.email.trim()) errors.email = m.email;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = m.email2;
  if (!v.description.trim()) errors.description = m.desc;
  else if (v.description.trim().length < 10) errors.description = m.desc2;
  return errors;
}

/** Builds a mailto: link. Line breaks are stripped from header-bound values to prevent header injection. */
export function buildMailto(v: ContactValues): string {
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();
  const subject = `Estimate request from ${oneLine(v.fullName)}`;
  const body = [`Name: ${oneLine(v.fullName)}`, `Phone: ${oneLine(v.phone)}`, `Email: ${oneLine(v.email)}`, '', 'Project description:', v.description.trim()].join('\n');
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
