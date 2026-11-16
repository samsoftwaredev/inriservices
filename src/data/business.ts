/** Public business facts. Verify all displayed facts before deployment. */
export const business = {
  name: 'INRI Paint & Wall LLC',
  shortName: 'INRI Paint & Wall',
  url: 'https://www.inripaintwall.com',
  phone: '+14696467286',
  phoneDisplay: '(469) 646-7286',
  email: 'samuel@inripaintwall.com',
  city: 'Garland',
  state: 'TX',
  areaCities: ['Garland', 'Dallas', 'Richardson', 'Plano', 'Mesquite', 'Rowlett', 'Rockwall', 'Addison'] as const,
} as const;

export const publicPaths = [
  '/', '/about', '/services', '/areas', '/contact',
  '/frequently-asked-questions', '/pricing-and-estimates',
  '/licensing-and-insurance', '/environmental-and-safety-practices',
  '/guides', '/privacy-policy', '/es',
] as const;

/** Source: the owner's existing inripaintwall.com. Keep in sync with the Google Business Profile. */
export const hours = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,
  opens: '09:00', closes: '17:00',
  display: 'Monday–Saturday, 9:00 AM – 5:00 PM',
  closed: 'Sunday: closed',
} as const;

export const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61576814137140' },
  { label: 'Instagram', href: 'https://www.instagram.com/inripaintwall/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/inri-paint-wall/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@INRIPaintWall' },
  { label: 'Yelp', href: 'https://www.yelp.com/biz/inri-paint-and-wall-llc-garland-2' },
  { label: 'Nextdoor', href: 'https://nextdoor.com/pages/inri-paint-wall-llc-garland-tx/' },
] as const;
export const googleMapsUrl = 'https://maps.app.goo.gl/f5QAd9NT7ZUtNxt76';
export const logoPath = '/inri-logo.png';

/** Trust facts the owner publishes on the existing site. Verify before launch. */
export const trustPoints = ['Family owned & operated', 'Licensed & insured', 'Free estimates', '6-month workmanship warranty', 'EPA lead-safe (RRP) certified'] as const;

export const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Service Areas' },
  { href: '/guides', label: 'Guides' },
  { href: '/about', label: 'About' },
  { href: '/frequently-asked-questions', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Payment methods shown on the owner's existing site. */
export const paymentMethods = ['American Express', 'Mastercard', 'Visa', 'Discover'] as const;

/** Optional integrations. Leave unset to hide the related UI. */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
export const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;

/** Google Maps embed for the Garland business listing (from the owner's previous site). */
export const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d428502.0922754842!2d-96.67232899999999!3d32.95965245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x42b7eb5354124873%3A0xfddef2cad263c247!2sINRI%20Paint%20%26%20Wall!5e0!3m2!1sen!2sus!4v1750204434395!5m2!1sen!2sus';
