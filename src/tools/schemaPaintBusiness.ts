import {
  companyAddressCountry,
  companyAddressLocality,
  companyAddressRegion,
  companyName,
  companyPhone,
  companyPostalCode,
  companyStreetAddress,
  companyWebsiteURL,
} from "@/constants";

const schemaPaintBusiness = {
  "@context": "https://schema.org",
  "@type": "PaintingContractor",
  name: companyName,
  image:
    "https://www.inripaintwall.com/_next/image?url=%2FinriLogo.png&w=96&q=75",
  "@id": companyWebsiteURL,
  url: companyWebsiteURL,
  telephone: companyPhone,
  address: {
    "@type": "PostalAddress",
    streetAddress: companyStreetAddress,
    addressLocality: companyAddressLocality,
    addressRegion: companyAddressRegion,
    postalCode: companyPostalCode,
    addressCountry: companyAddressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 32.9596525,
    longitude: -96.672329,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61576814137140",
    "https://www.instagram.com/inripaintwall/",
    "https://www.linkedin.com/company/inri-paint-wall/",
    "https://www.youtube.com/@INRIPaintWall",
    "https://www.yelp.com/biz/inri-paint-and-wall-garland-3",
  ],
  priceRange: "$$",
  description:
    "INRI Paint & Wall LLC offers professional interior and exterior painting, drywall repair, texture matching, and cabinet refinishing services in Garland, TX.",
  areaServed: {
    "@type": "Place",
    name: "Dallas-Fort Worth Metroplex",
  },
};

export default schemaPaintBusiness;
