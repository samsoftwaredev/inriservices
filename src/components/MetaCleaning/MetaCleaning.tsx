import React from "react";
import Head from "next/head";
import { companyName } from "@/constants";

interface Props {
  pageName?: string;
  location?: string;
}

const MetaCleaning = ({
  pageName = "Residential Cleaning Services in Garland, TX",
  location = "Garland",
}: Props) => {
  return (
    <Head>
      <title>
        {pageName} | {companyName} – Home Cleaning Experts in {location}, TX
      </title>

      {/* Language and Viewport */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Primary Meta Tags */}
      <meta
        name="description"
        content={`INRI Paint & Wall now offers expert residential cleaning in ${location}, TX! From deep cleaning and carpet care to move-in/move-out services, we keep your home spotless and fresh.`}
      />
      <meta
        name="keywords"
        content={`home cleaning ${location}, residential cleaning services, deep cleaning Garland, carpet cleaning TX, move-out cleaning, INRI Paint & Wall cleaning`}
      />
      <meta name="author" content="INRI Paint & Wall" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://inripaintwall.com/cleaning" />
      <meta
        property="og:title"
        content={`INRI Paint & Wall | Trusted Residential Cleaning in ${location}, TX`}
      />
      <meta
        property="og:description"
        content={`Discover reliable, family-owned cleaning services in ${location}, TX. From kitchens to carpets, INRI Paint & Wall ensures your home shines.`}
      />
      <meta
        property="og:image"
        content="https://inripaintwall.com/og-cleaning-image.jpg"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={`INRI Paint & Wall | Trusted Residential Cleaning in ${location}, TX`}
      />
      <meta
        name="twitter:description"
        content={`Now offering home cleaning services in ${location}! INRI Paint & Wall provides trusted deep cleaning, carpet care, and more.`}
      />
      <meta
        name="twitter:image"
        content="https://inripaintwall.com/og-cleaning-image.jpg"
      />

      {/* Canonical URL */}
      <link rel="canonical" href="https://inripaintwall.com/cleaning" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaCleaning;
