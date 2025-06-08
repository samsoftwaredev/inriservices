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

const BookingPage = () => {
  return (
    <ThemeRegistry>
      <Meta pageName="Booking -" />
      <TopNavbar />
      <Container maxWidth="sm">
        <TrustBadges
          title="Booking"
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

export default BookingPage;
