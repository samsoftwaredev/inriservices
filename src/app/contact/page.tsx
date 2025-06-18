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
import { MetaProps } from "@/interfaces";
import { companyName } from "@/constants";

const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName =
  "Contact Us – Get a Free Quote for Painting & Drywall Repair in Texas";

const metaProps: MetaProps = {
  title: `${pageName} ${companyName} | Free Quote for Painting & Drywall Repair in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    { name: "robots", content: "index, follow" },
    {
      name: "description",
      content: `Contact ${companyName} in ${location}, TX for expert painting, drywall repair, and home cleaning services. Request your free quote today. Fast response, local professionals, and satisfaction guaranteed.`,
    },
    {
      name: "keywords",
      content: `contact ${companyName}, painting contractor ${location}, drywall repair ${location}, free quote painting ${location}, home cleaning services ${location}, local painter ${location}, best painting company TX, insured drywall repair, request estimate painting`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inripaintwall.com/contact" },
    {
      property: "og:title",
      content: `Contact ${companyName} | Painting & Drywall Repair Experts in ${location}, TX`,
    },
    {
      property: "og:description",
      content: `Reach out to ${companyName} for painting, drywall repair, or cleaning services in ${location}, TX. Get a free quote and fast, reliable service from trusted local professionals.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `Contact ${companyName} | Painting & Drywall Repair in ${location}, TX`,
    },
    {
      name: "twitter:description",
      content: `Contact ${companyName} for a free quote on painting, drywall repair, or cleaning in ${location}, TX. Fast response and trusted local service.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/contact" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const ContactPage = () => {
  return (
    <ThemeRegistry>
      <Meta {...metaProps} />
      <TopNavbar />
      <Container maxWidth="sm">
        <TrustBadges
          title="Contact Us"
          description="INRI Paint & Wall – Your Trusted Experts in Painting, Drywall Repair & Home Cleaning Services"
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

export default ContactPage;
