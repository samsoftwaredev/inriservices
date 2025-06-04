import type { Metadata } from 'next';
import './globals.css';
import { companyName } from '@/constants';
import Script from 'next/script';

export const metadata: Metadata = {
  title: companyName,
  description:
    'Expert Painting, Drywall Repair & Cleaning Services in Garland, TX',
  themeColor: '#ffffff',
  keywords: [
    'painting',
    'drywall repair',
    'home improvement',
    'interior painting',
    'interior painters in garland',
    'interior painters near me',
    'exterior painting',
    'exterior painters in garland',
    'exterior painters near me',
    'drywall installation',
    'drywall finishing',
    'home renovation',
    'home repair',
    'home services',
    'professional painters',
    'garland TX painters',
    'garland painter',
    'painters in garland',
    'painters near me',
    'drywall contractors near me',
    'drywall repair near me',
    'drywall contractors',
    'home maintenance',
    'residential painting',
    'commercial painting',
    'painting services',
    'drywall services',
    'home services near me',
    'local painters',
    'local drywall contractors',
    'home improvement services',
    'home repair services',
    'home renovation services',
  ],
  authors: [
    {
      name: companyName,
      url: 'https://inripaintwall.com',
    },
  ],
  creator: companyName,
  openGraph: {
    title: companyName,
    description: 'Expert Painting & Drywall Repair Services',
    url: 'https://inripaintwall.com',
    siteName: companyName,
    images: [
      {
        url: 'https://inripaintwall.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: companyName + ' - Expert Painting & Drywall Repair Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const GTM_ID = 'G-PVWSHF17ED';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {GTM_ID && (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        </>
      )}
      <body>{children}</body>
    </html>
  );
}
