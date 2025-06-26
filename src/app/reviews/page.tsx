import React from "react";
import { Typography, Container, Box } from "@mui/material";
import { Footer, Meta, TestimonialSection, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { companyName } from "@/constants";
import { theme } from "../theme";
const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName = "Reviews & Testimonials – Genuine Customer Feedback in Texas";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} | Trusted Reviews & Testimonials in ${location}, TX`,
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
      content: `Discover genuine reviews and testimonials for ${companyName} in ${location}, TX. Our customer feedback highlights our commitment to quality craftsmanship and exceptional service in painting, drywall repair, and home improvement.`,
    },
    {
      name: "keywords",
      content: `reviews ${companyName}, testimonials ${companyName}, customer reviews ${location}, ${companyName} reviews, trusted painting reviews, drywall repair testimonials, home improvement reviews, local business reviews`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inripaintwall.com/reviews" },
    {
      property: "og:title",
      content: `Reviews & Testimonials | ${companyName} in ${location}, TX`,
    },
    {
      property: "og:description",
      content: `Read genuine reviews and testimonials from our satisfied customers. Discover why ${companyName} is trusted for painting, drywall repair, and home improvement in ${location}, Texas.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-review.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `Reviews & Testimonials | ${companyName} in ${location}, TX`,
    },
    {
      name: "twitter:description",
      content: `See what our customers are saying about ${companyName}. Trusted reviews for quality painting, drywall repair, and home improvement in ${location}, TX.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-review.jpg",
    },
    // Additional meta tag for GBP (Google Business Profile) optimization
    {
      name: "business_profile:reviews",
      content: "true",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/reviews" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const AboutUs = () => {
  const beforeAfterPicturesStyle = {
    width: { xs: "100%", md: 420 },
    maxWidth: 500,
    borderRadius: 5,
    boxShadow: 8,
    objectFit: "cover",
    zIndex: 1,
    border: `4px solid ${theme.palette.primary.main}`,
    filter: "brightness(0.98) saturate(1.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "scale(1.03) rotate(2deg)",
      boxShadow: "0 12px 36px 0 rgba(73,181,254,0.18)",
    },
  };

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

        <Typography
          id="testimonial-section-title"
          variant="h5"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            my: { xs: 2, md: 4 },
            px: { xs: 2, md: 0 },
          }}
        >
          Our Recent Projects
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            mb: 4,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Check out some of our recent projects and see the quality of our work.
          We take pride in delivering exceptional service to our customers, and
          these before-and-after pictures showcase our commitment to excellence.
        </Typography>

        <Box gap={1} display="flex" flexWrap="wrap" justifyContent="center">
          <Box
            component="img"
            src="/beforeAfterPictures/inri_paint_wall_drywall_repair.png"
            alt="Drywall and painting project by INRI Paint & Wall"
            sx={beforeAfterPicturesStyle}
          />

          <Box
            component="img"
            src="/beforeAfterPictures/inri_paint_wall_family_room.png"
            alt="Cabinets painting project by INRI Paint & Wall"
            sx={beforeAfterPicturesStyle}
          />

          <Box
            component="img"
            src="/beforeAfterPictures/inri_paint_wall_interior_door.png"
            alt="Interior room door painting and walls project by INRI Paint & Wall"
            sx={beforeAfterPicturesStyle}
          />

          <Box
            component="img"
            src="/beforeAfterPictures/inri_paint_wall_stairWall.png"
            alt="Drywall repair project by INRI Paint & Wall"
            sx={beforeAfterPicturesStyle}
          />
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default AboutUs;
