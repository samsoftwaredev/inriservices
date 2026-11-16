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
  { href: '/about', label: 'About' },
  { href: '/frequently-asked-questions', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
] as const;
