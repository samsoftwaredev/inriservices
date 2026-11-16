import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { business } from '../data/business';
import { defaultDescription, paintingContractorJsonLd, safeJsonLd, websiteJsonLd } from '../lib/seo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { MobileActionBar } from '../components/MobileActionBar';
import { Analytics } from '../components/Analytics';
import './globals.css';

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: { default: 'House Painters & Drywall Repair in Garland, TX | INRI Paint & Wall', template: '%s | INRI Paint & Wall' },
  description: defaultDescription,
  robots: { index: true, follow: true },
  verification: googleSiteVerification || bingSiteVerification ? { ...(googleSiteVerification ? { google: googleSiteVerification } : {}), ...(bingSiteVerification ? { other: { 'msvalidate.01': bingSiteVerification } } : {}) } : undefined,
  applicationName: business.name,
  openGraph: {
    type: 'website', title: 'House Painters & Drywall Repair in Garland, TX | INRI Paint & Wall', description: defaultDescription,
    url: business.url, siteName: business.name, locale: 'en_US', images: [{ url: '/work/project-04.jpg', width: 1024, height: 768, alt: 'Painted living room with mint green walls and white trim' }],
  },
  twitter: { card: 'summary_large_image', title: 'House Painters & Drywall Repair in Garland, TX | INRI Paint & Wall', description: defaultDescription, images: ['/work/project-04.jpg'] },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileActionBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(paintingContractorJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd()) }} />
      </body>
    </html>
  );
}
