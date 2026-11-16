import type { Metadata } from 'next';
import { business, googleMapsUrl, hours, logoPath, socialLinks } from '../data/business';
import { services } from '../data/services';
import { gallery } from '../data/gallery';

export const defaultDescription = 'Interior and exterior painting, drywall repairs, cabinet painting, and ceiling work in Garland and nearby Dallas-area communities. Request an estimate from INRI Paint & Wall LLC.';

/** Shared metadata helper prevents duplicate canonicals and city-stuffed titles. */
const landscape = gallery.filter((g) => g.width > g.height);
/** Gives each page its own share image (stable per key) so links do not all look identical. */
export function shareImageFor(key?: string) {
  if (!key) return { url: '/work/project-04.jpg', width: 1024, height: 768, alt: 'Painted living room with mint green walls and white trim' };
  const hash = [...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const g = landscape[hash % landscape.length];
  return { url: g.src, width: g.width, height: g.height, alt: g.alt };
}

export function pageMetadata(args: { title: string; description: string; path: string; imageKey?: string; languages?: Record<string, string> }): Metadata {
  const image = shareImageFor(args.imageKey);
  const canonical = args.path === '/' ? '/' : args.path.replace(/\/$/, '');
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical, ...(args.languages ? { languages: args.languages } : {}) },
    openGraph: {
      type: 'website', title: args.title, description: args.description,
      url: new URL(canonical, business.url).toString(), siteName: business.name,
      locale: 'en_US', images: [image],
    },
    twitter: { card: 'summary_large_image', title: args.title, description: args.description, images: [image.url] },
  };
}

/** Facts come from the owner's existing site. Intentionally no street address, ratings or review counts (a service-area business). */
export function paintingContractorJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PaintingContractor',
    '@id': `${business.url}/#business`,
    name: business.name,
    url: business.url,
    telephone: business.phone,
    email: business.email,
    description: defaultDescription,
    image: [`${business.url}/work/project-04.jpg`, `${business.url}/team/crew-garage-team.jpg`],
    logo: new URL(logoPath, business.url).toString(),
    sameAs: socialLinks.map((l) => l.href),
    hasMap: googleMapsUrl,
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: [...hours.days], opens: hours.opens, closes: hours.closes }],
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Painting and drywall services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.shortTitle, url: `${business.url}/services/${s.slug}` } })),
    },
    address: { '@type': 'PostalAddress', addressLocality: business.city, addressRegion: business.state, addressCountry: 'US' },
    areaServed: business.areaCities.map((city) => ({ '@type': 'City', name: `${city}, Texas` })),
  };
}

/** Helps Google connect the brand name, canonical URL and site navigation. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${business.url}/#website`,
    name: business.name,
    url: business.url,
    publisher: { '@id': `${business.url}/#business` },
    inLanguage: 'en-US',
  };
}

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** BreadcrumbList structured data. Mirrors the visible breadcrumb on the page. */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, business.url).toString(),
    })),
  };
}

/** Service-area page markup. Links to the site-wide business entity and states no unverifiable facts. */
export function areaServiceJsonLd(args: { name: string; path: string }) {
  const url = new URL(args.path, business.url).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: `Painting and drywall repair in ${args.name}, TX`,
    serviceType: 'Painting and drywall repair',
    url,
    provider: { '@id': `${business.url}/#business` },
    areaServed: { '@type': 'City', name: `${args.name}, Texas` },
  };
}

/** Service markup uses only the service facts shown on the corresponding page. */
export function serviceJsonLd(args: { name: string; description: string; path: string }) {
  const url = new URL(args.path, business.url).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: args.name,
    description: args.description,
    serviceType: args.name,
    url,
    provider: { '@id': `${business.url}/#business` },
    areaServed: business.areaCities.map((city) => ({ '@type': 'City', name: `${city}, Texas` })),
  };
}

/** Article markup for guides. Authored by the business; dates are the real publish date. */
export function articleJsonLd(args: { title: string; description: string; path: string; published: string }) {
  const url = new URL(args.path, business.url).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url,
    mainEntityOfPage: url,
    datePublished: args.published,
    dateModified: args.published,
    author: { '@type': 'Organization', name: business.name, url: business.url },
    publisher: { '@id': `${business.url}/#business` },
    inLanguage: 'en-US',
  };
}
