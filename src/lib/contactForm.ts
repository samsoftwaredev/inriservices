import { business } from '../data/business';

export type ContactValues = { fullName: string; phone: string; email: string; description: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!v.fullName.trim()) errors.fullName = 'Enter your full name.';
  else if (v.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'Enter your first and last name.';
  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) errors.phone = 'Enter a phone number.';
  else if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) errors.phone = 'Enter a valid 10-digit phone number.';
  if (!v.email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = 'Enter a valid email address.';
  if (!v.description.trim()) errors.description = 'Briefly describe what you need done.';
  else if (v.description.trim().length < 10) errors.description = 'Add a little more detail (at least 10 characters).';
  return errors;
}

/** Builds a mailto: link. Line breaks are stripped from header-bound values to prevent header injection. */
export function buildMailto(v: ContactValues): string {
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();
  const subject = `Estimate request from ${oneLine(v.fullName)}`;
  const body = [`Name: ${oneLine(v.fullName)}`, `Phone: ${oneLine(v.phone)}`, `Email: ${oneLine(v.email)}`, '', 'Project description:', v.description.trim()].join('\n');
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
