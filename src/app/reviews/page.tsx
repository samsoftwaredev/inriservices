import React from "react";
import { Typography, Container, Grid, Paper, Divider } from "@mui/material";
import { Footer, Meta, TestimonialSection, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { companyName } from "@/constants";

const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName = "About Us – Expert Painting & Drywall Repair in Texas";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} | Trusted Painter & Drywall Repair in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "description",
      content: `${companyName} is your trusted local expert for interior and exterior painting, drywall repair, and home improvement in ${location}, TX. Family-owned, fully insured, and committed to quality craftsmanship and customer satisfaction.`,
    },
    {
      name: "keywords",
      content: `about ${companyName}, painting services ${location}, drywall repair ${location}, Texas painters, local painting company, professional drywall contractors, home improvement ${location}, interior painting, exterior painting, residential painting, commercial painting`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inripaintwall.com/about" },
    {
      property: "og:title",
      content: `About ${companyName} | Painting & Drywall Repair in ${location}, TX`,
    },
    {
      property: "og:description",
      content: `${companyName} provides top-rated painting and drywall repair services in ${location}, Texas. Discover our mission, values, and commitment to excellence.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `About ${companyName} | Painting & Drywall Repair in ${location}, TX`,
    },
    {
      name: "twitter:description",
      content: `${companyName} is a leading provider of painting and drywall repair in ${location}, TX. Learn more about our team and services.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/about" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const AboutUs = () => {
  return (
    <>
      <Meta {...metaProps} />
      <TopNavbar />

      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Typography
          variant="h2"
          align="center"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          Reviews & Testimonials
        </Typography>
        <TestimonialSection />
      </Container>

      <Footer />
    </>
  );
};

export default AboutUs;
