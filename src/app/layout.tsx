import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INRI Services",
  description: "Expert Painting & Drywall Repair Services",
  keywords: [
    "painting",
    "drywall repair",
    "home improvement",
    "interior painting",
    "exterior painting",
    "drywall installation",
    "drywall finishing",
    "home renovation",
    "home repair",
    "home services",
    "professional painters",
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
      name: "INRI Services",
      url: "https://inriservices.com",
    },
  ],
  creator: "INRI Services",
  openGraph: {
    title: "INRI Services",
    description: "Expert Painting & Drywall Repair Services",
    url: "https://inriservices.com",
    siteName: "INRI Services",
    images: [
      {
        url: "https://inriservices.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "INRI Services - Expert Painting & Drywall Repair Services",
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
      <body>{children}</body>
    </html>
  );
}
