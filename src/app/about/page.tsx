"use client";
import React from "react";
import Head from "next/head";
import { Typography, Container, Grid, Paper, Divider } from "@mui/material";
import { Footer, TopNavbar } from "@/components";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us - INRI Painting & Drywall Repair Services</title>
        <meta
          name="description"
          content="Learn more about INRI Services, a trusted family-owned business in Texas offering expert painting and drywall repair services with a commitment to craftsmanship, integrity, and local care."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <TopNavbar />

      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            About Us
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h4"
            align="center"
            color="text.secondary"
            paragraph
          >
            Expert Painting & Drywall Repair Services in Texas – Delivering
            Quality, Integrity, and Beautiful Results.
          </Typography>
        </motion.div>

        <Grid container spacing={4} mt={4}>
          {/* Our Mission */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                  or a flawless drywall repair, we’re here to transform your
                  space with precision and pride.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Our Commitment */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
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
                  We treat your home like it’s our own. From transparent quotes
                  to clean, professional service, we’re committed to giving you
                  a stress-free experience. No surprises, no mess—just great
                  results.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Based in Texas */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
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
                  We’re proudly based in Texas, serving homeowners and
                  businesses with trusted painting and drywall repair services.
                  Our team understands local style, climate, and values—because
                  we live here too!
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* SEO Rich Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography
            variant="h4"
            align="center"
            color="primary"
            fontWeight="bold"
          >
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
            come to the right place. Family-owned. Fully insured. Locally
            trusted.
          </Typography>
        </motion.div>
      </Container>

      <Footer />
    </>
  );
};

export default AboutUs;
