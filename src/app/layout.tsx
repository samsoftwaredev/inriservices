import type { Metadata } from 'next';
import './globals.css';
import { companyName } from '@/constants';
import { GoogleTagManager } from '@next/third-parties/google';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-PVWSHF17ED" />
      <body>{children}</body>
    </html>
  );
}
