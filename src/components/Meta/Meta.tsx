import React from "react";
import Head from "next/head";
import { companyName } from "@/constants";

const Meta = ({ pageName = "" }: { pageName?: string }) => {
  return (
    <Head>
      <title>
        {pageName} {companyName} | Expert Painting & Drywall Repair in Dallas,
        TX
      </title>

      {/* Language and Viewport */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Primary Meta Tags */}
      <meta
        name="description"
        content="INRI Paint & Wall is a family-owned company based in Dallas, TX offering professional painting and drywall repair for homeowners. We deliver reliable, affordable craftsmanship with a local touch."
      />
      <meta
        name="keywords"
        content="Dallas painting services, drywall repair Dallas, home painting, INRI Paint & Wall, house painters Texas, affordable painting, local drywall contractors"
      />
      <meta name="author" content="INRI Paint & Wall" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://inriservices.com/" />
      <meta
        property="og:title"
        content="INRI Paint & Wall | Expert Painting & Drywall Repair in Dallas"
      />
      <meta
        property="og:description"
        content="Professional, local painting and drywall repair in Dallas, TX. Family-owned, fully insured, and trusted by Texas homeowners."
      />
      <meta
        property="og:image"
        content="https://inriservices.com/og-image.jpg"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="INRI Paint & Wall LLC | Expert Painting & Drywall Repair in Dallas"
      />
      <meta
        name="twitter:description"
        content="Need reliable painting and drywall repair in Dallas, TX? INRI Paint & Wall LLC brings precision, quality, and care to every project."
      />
      <meta
        name="twitter:image"
        content="https://inriservices.com/og-image.jpg"
      />

      {/* Canonical URL */}
      <link rel="canonical" href="https://inriservices.com/" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
