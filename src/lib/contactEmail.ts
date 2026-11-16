import type { ContactValues } from './contactForm';

export type LeadExtras = { service?: string; preferredTime?: string; pagePath?: string; photoCount: number };

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim().slice(0, 200);
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Builds the notification email. Visitor-supplied text is escaped in HTML and flattened in headers. */
export function buildLeadEmail(v: ContactValues, x: LeadExtras) {
  const rows: [string, string][] = [
    ['Name', oneLine(v.fullName)], ['Phone', oneLine(v.phone)], ['Email', oneLine(v.email)],
    ['Service', oneLine(x.service ?? '') || 'Not specified'],
    ['Best time to reach', oneLine(x.preferredTime ?? '') || 'Not specified'],
    ['Page', oneLine(x.pagePath ?? '') || '/'],
    ['Photos attached', String(x.photoCount)],
  ];
  const description = v.description.trim().slice(0, 4000);
  const text = [...rows.map(([k, val]) => `${k}: ${val}`), '', 'Project description:', description].join('\n');
  const html = `<table cellpadding="6">${rows.map(([k, val]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(val)}</td></tr>`).join('')}</table><h3>Project description</h3><p style="white-space:pre-wrap">${escapeHtml(description)}</p>`;
  return { subject: `New estimate request from ${oneLine(v.fullName)}`, text, html };
}

const SIGNATURES: Record<string, (b: Uint8Array) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/webp': (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
};
export const PHOTO_LIMITS = { maxFiles: 4, maxBytesEach: 2_000_000, maxBytesTotal: 4_000_000 } as const;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/** Verifies type, size and the file's real signature (not just its claimed MIME type). */
export function checkPhoto(type: string, bytes: Uint8Array): boolean {
  return Boolean(SIGNATURES[type]?.(bytes)) && bytes.byteLength > 0 && bytes.byteLength <= PHOTO_LIMITS.maxBytesEach;
}
export const photoFilename = (type: string, i: number) => `photo-${i + 1}.${EXT[type] ?? 'jpg'}`;
