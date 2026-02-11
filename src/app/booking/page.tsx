"use client";

import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import {
  ContactForm,
  Footer,
  Meta,
  TopNavbar,
  TrustBadges,
} from "@/components";
import { ThemeRegistry } from "../ThemeRegistry";
import { red } from "@mui/material/colors";
import { companyName } from "@/constants";
import { MetaProps } from "@/interfaces";

const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName =
  "Book Your Service – Fast & Reliable Painting & Drywall Repair in Texas";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} | Trusted Painting & Drywall Repair in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    { name: "robots", content: "index, follow" },
    {
      name: "description",
      content: `Book your interior/exterior painting or drywall repair service with ${companyName} in ${location}, TX. Fast response, free quotes, and guaranteed satisfaction from local, insured experts.`,
    },
    {
      name: "keywords",
      content: `book painting service ${location}, drywall repair booking ${location}, paint contractor ${location}, free quote painting, local painter booking, professional drywall repair, trusted painting company TX`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inripaintwall.com/booking" },
    {
      property: "og:title",
      content: `Book Your Service | ${companyName} – Painting & Drywall Repair in ${location}, TX`,
    },
    {
      property: "og:description",
      content: `Easily book interior/exterior painting or drywall repair services with ${companyName} in ${location}, TX. Get a free quote and fast, reliable service from trusted local professionals.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `Book Your Service | ${companyName} – Painting & Drywall Repair in ${location}, TX`,
    },
    {
      name: "twitter:description",
      content: `Book your painting or drywall repair with ${companyName} in ${location}, TX. Fast quotes, reliable service, and local expertise.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/booking" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const BookingPage = () => {
  return (
    <ThemeRegistry>
      <Meta {...metaProps} />
      <TopNavbar />
      <Container maxWidth="sm">
        <TrustBadges
          title="Booking"
          description="INRI Paint & Wall – Your Local Interior/Exterior Expert in Painting & Drywall Repair Services"
        />
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            <Box fontSize="small" component="span" sx={{ color: red[500] }}>
              Get a Free Quote!
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              <Typography
                color="primary.main"
                component={"a"}
                href="/frequently-asked-questions"
              >
                Have questions
              </Typography>{" "}
              or need a quote? We&apos;d love to hear from you.
            </Typography>
            <ContactForm />
          </Paper>
        </Box>
      </Container>
      <Footer />
    </ThemeRegistry>
  );
};

export default BookingPage;
