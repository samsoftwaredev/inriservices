"use client";

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
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah L.",
    image: "/avatars/avatar1.png",
    text: "I had a huge hole in my drywall after a plumbing issue—these guys patched it up seamlessly and even repainted the whole wall. You can't tell anything ever happened!",
    rating: 5,
  },
  {
    name: "James M.",
    image: "/avatars/avatar2.png",
    text: "We hired them to repaint our living room and fix a few nail pops. Not only were they super tidy, but they finished ahead of schedule. Our walls look brand new!",
    rating: 5,
  },
  {
    name: "Monica T.",
    image: "/avatars/avatar3.png",
    text: "Excellent job! I appreciated how they matched the existing paint perfectly after repairing a water-damaged area. The team was respectful and professional.",
    rating: 4.5,
  },
  {
    name: "Carlos G.",
    image: "/avatars/avatar4.png",
    text: "They helped repaint and touch up after we moved out of our rental. The landlord was so impressed we got our full deposit back. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amy K.",
    image: "/avatars/avatar5.png",
    text: "Fast, clean, and honest pricing. They repaired a crack running across our ceiling and you’d never know it was there. Super happy with the results.",
    rating: 4.5,
  },
];

const colors = ["#ffe0e6", "#e0f7fa", "#e8f5e9", "#fff3e0", "#ede7f6"];

const TestimonialSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <Box
      component="section"
      sx={{ py: 8, px: 2, backgroundColor: "#fefefe" }}
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
      <Grid
        container
        spacing={4}
        justifyContent="center"
        ref={ref}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {testimonials.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                backgroundColor: colors[idx % colors.length],
                borderRadius: 3,
              }}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
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
