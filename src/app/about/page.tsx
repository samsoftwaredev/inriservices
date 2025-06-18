import React from "react";
import { Typography, Container, Grid, Paper, Divider } from "@mui/material";
import { Footer, Meta, TopNavbar } from "@/components";
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
          About Us
        </Typography>

        <Typography align="center" color="text.secondary" paragraph>
          Expert Painting & Drywall Repair Services in Texas – Delivering
          Quality, Integrity, and Beautiful Results.
        </Typography>

        <Grid container spacing={4} mt={4}>
          {/* Our Mission */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "#e0f7fa",
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom color="secondary">
                🎯 Our Mission
              </Typography>
              <Typography variant="body1" color="text.primary">
                Our mission is simple: to bring color, craftsmanship, and care
                into every home we work on. Whether it’s a fresh coat of paint
                or a flawless drywall repair, we’re here to transform your space
                with precision and pride.
              </Typography>
            </Paper>
          </Grid>

          {/* Our Commitment */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "#fff3e0",
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom color="secondary">
                🤝 Our Commitment to You
              </Typography>
              <Typography variant="body1" color="text.primary">
                We treat your home like it’s our own. From transparent quotes to
                clean, professional service, we’re committed to giving you a
                stress-free experience. No surprises, no mess—just great
                results.
              </Typography>
            </Paper>
          </Grid>

          {/* Based in Texas */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "#e8f5e9",
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom color="secondary">
                🏡 Texas Roots, Local Service
              </Typography>
              <Typography variant="body1" color="text.primary">
                We’re proudly based in Texas, serving homeowners and businesses
                with trusted painting and drywall repair services. Our team
                understands local style, climate, and values—because we live
                here too!
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* SEO Rich Content */}
        <Typography align="center" color="primary" fontWeight="bold">
          Trusted Texas Painting & Drywall Repair Experts – Professional,
          Affordable, and Local.
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mt={1}
        >
          Looking for top-rated drywall repair near you? Need a local Texas
          painter who shows up on time and delivers flawless results? You’ve
          come to the right place. Family-owned. Fully insured. Locally trusted.
        </Typography>
      </Container>

      <Footer />
    </>
  );
};

export default AboutUs;
