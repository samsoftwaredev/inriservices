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
        {testimonials.map((t, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 5, lg: 5 }} key={idx}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Avatar src={t.image} alt={t.name} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    {t.name}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  {t.text}
                </Typography>
                <Rating value={t.rating} precision={0.5} readOnly />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestimonialSection;
