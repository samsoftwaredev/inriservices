import type { Metadata } from "next";
import "./globals.css";
import { companyName, companyWebsiteURL } from "@/constants";
import Script from "next/script";
import { AuthProvider } from "@/context";
import { CustomerProvider } from "@/context/CustomerContext";

export const metadata: Metadata = {
  title: companyName,
  description:
    "Expert Painting, Drywall Repair & Cleaning Services in Garland, TX",
  keywords: [
    "painting",
    "drywall repair",
    "inri paint wall",
    "inri paint and wall",
    "wall painting",
    "wall repair",
    "drywall repair in garland",
    "paint wall",
    "paint and wall",
    "home painting",
    "home improvement",
    "interior painting",
    "interior painters in garland",
    "interior painters near me",
    "exterior painting",
    "exterior painters in garland",
    "exterior painters near me",
    "drywall installation",
    "drywall finishing",
    "home renovation",
    "home repair",
    "home services",
    "professional painters",
    "garland TX painters",
    "garland painter",
    "painters in garland",
    "painters near me",
    "drywall contractors near me",
    "drywall repair near me",
    "drywall contractors",
    "home maintenance",
    "residential painting",
    "commercial painting",
    "painting services",
    "drywall services",
    "home services near me",
    "local painters",
    "local drywall contractors",
    "home improvement services",
    "home repair services",
    "home renovation services",
  ],
  authors: [
    {
      name: companyName,
      url: companyWebsiteURL,
    },
  ],
  creator: companyName,
  openGraph: {
    title: companyName,
    description: "Expert Painting & Drywall Repair Services",
    url: companyWebsiteURL,
    siteName: companyName,
    images: [
      {
        url: "https://inripaintwall.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: companyName + " - Expert Painting & Drywall Repair Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PVWSHF17ED"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PVWSHF17ED');
        `}
      </Script>
      <body>
        <AuthProvider>
          <CustomerProvider>{children}</CustomerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
