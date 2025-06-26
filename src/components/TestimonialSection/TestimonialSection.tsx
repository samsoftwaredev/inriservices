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

const testimonials = [
  {
    name: "Leslie Z.",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjUSZEg9Jt3mL5zEhDVItGwJeZdZAXEQTaSiOUprqHqU38V_b8yp=w40-h40-p-rp-mo-br100",
    text: "I can't say enough good things about INRI Paint & Wall LLC! From the moment I called them, I felt like they really cared. They painted my kitchen cabinets in a beautiful, clean royal blue that just transformed the whole space. The job was neat, fast, and super professional. I also had some drywall repair done in my hallway and the family room wow!!, I couldn't even tell there was ever damage! I feel like my home has a brand new vibe now. So if you need a professional painter in Garland, don't even think twice! The quality of their drywall repair work is top-notch. It's so hard to find people that truly care and go the extra mile.",
    rating: 5,
  },
  {
    name: "Samuel R.",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocL_uxUxlV3ssxiVWZHJFXFC2Ln_nm3dtXOB_fCVFWhHC9xGKoiW=w40-h40-p-rp-mo-br100",
    text: "INRI Paint & Wall did an amazing job on my new home. They painted and repaired all my drywalls, and the results were better than I expected. The team was friendly, and always on time. I really appreciated how they explained everything and made the process feel easy. Their attention to detail is next level. They also offered me a deep cleaning service and carpet cleaning. My house looks brand new!! Definitely recommend it! ⭐️🔥",
    rating: 5,
  },
  {
    name: "angelica contreras",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJln76IKg852YHTl4GnRiS1Gfk-92z6n17VnnS4Bp8Nkqlc7A=w40-h40-p-rp-mo-br100",
    text: "Excellent and very detailed work! I was very impressed with the work they did on my garage. It had many imperfections on the ceiling and walls, but now it looks like a completely different space. They repaired the drywall, applied the perfect texture, and painted everything with great care. ✨🎨 You could tell they knew what they were doing and that they care about delivering quality. They were also very punctual, respectful, and left everything clean. I highly recommend them. Now I can throw parties in my garage!! 🎉 Thank you INRI Paint & Wall! 🌟",
    rating: 5,
  },
];

const TestimonialSection = () => {
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
