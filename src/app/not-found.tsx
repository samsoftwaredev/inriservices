import React from "react";
import { Button, Container, Paper, Typography, Box } from "@mui/material";
import { Footer, Meta, TopNavbar } from "@/components";
import Link from "next/link";
import { MetaProps } from "@/interfaces";
import { companyName } from "@/constants";

const location = "Garland";
const pageName = "404 Page Not Found";

const metaProps: MetaProps = {
  title: `${pageName} - ${companyName} | Painter & Drywall Repair in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    {
      name: "robots",
      content: "noindex, follow",
    },
    {
      name: "description",
      content: `Sorry, the page you are looking for cannot be found. Visit INRI Paint & Wall for expert painting and drywall repair services in ${location}, TX. Let us help you with your next home improvement project.`,
    },
    {
      name: "keywords",
      content: `404 page, page not found, ${location} painting services, drywall repair ${location}, INRI Paint & Wall, house painters Texas, local drywall contractors`,
    },
    { name: "author", content: "INRI Paint & Wall" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inripaintwall.com/404" },
    {
      property: "og:title",
      content: `404 Not Found | INRI Paint & Wall - Painting & Drywall Repair in ${location}`,
    },
    {
      property: "og:description",
      content: `This page does not exist. For professional painting and drywall repair in ${location}, TX, trust INRI Paint & Wall.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `404 Not Found | INRI Paint & Wall - Painting & Drywall Repair in ${location}`,
    },
    {
      name: "twitter:description",
      content: `Page not found. INRI Paint & Wall offers expert painting and drywall repair in ${location}, TX.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/404" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const PageNotFound = () => {
  return (
    <>
      <Meta {...metaProps} />
      <TopNavbar />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: { xs: 4, md: 8 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            color="primary"
            fontWeight="bold"
            sx={{
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textAlign: "center",
            }}
          >
            Oops! 🎨
          </Typography>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              mb: { xs: 1, sm: 2 },
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            Looks like this page got painted over — and we can’t find it
            anymore!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: { xs: 2, sm: 3 },
              textAlign: "center",
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            Maybe the painter got a bit too creative... but don’t worry — we can
            get you back on track.
          </Typography>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  textTransform: "none",
                }}
              >
                🏠 Back to Painting Your Home
              </Button>
            </Link>
          </Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              mt: { xs: 2, sm: 3 },
              textAlign: "center",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            If you think this is a mistake, please let us know — we’ll patch it
            up in no time!
          </Typography>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default PageNotFound;
