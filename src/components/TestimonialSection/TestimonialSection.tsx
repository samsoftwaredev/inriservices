import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Rating,
} from "@mui/material";
interface Props {
  testimonials: {
    name: string;
    image: string;
    text: string;
    rating: number;
  }[];
}

const TestimonialSection = ({ testimonials }: Props) => {
  return (
    <Box
      component="section"
      sx={{ py: 8, px: 2 }}
      aria-labelledby="testimonial-section-title"
    >
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
        What Our Customers Are Saying
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
        We take pride in delivering exceptional service to our customers. Here’s
        what they have to say about their experiences with us.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <script
          defer
          async
          src="https://cdn.trustindex.io/loader.js?d2086234817353468d669f7bf89"
        ></script>
      </Grid>
    </Box>
  );
};

export default TestimonialSection;
