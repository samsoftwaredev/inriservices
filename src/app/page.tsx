import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { theme } from "./theme";
import { ThemeRegistry } from "./ThemeRegistry";
import { Paper } from "@mui/material";
import {
  Hero,
  Meta,
  ObjectionsBusters,
  TestimonialSection,
  TrustBadges,
  Footer,
  TopNavbar,
  MapServices,
  HoursOperation,
} from "@/components";
import PromoBadge from "@/components/PromoBadge";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <ThemeRegistry>
      <Analytics />
      <Meta />
      <TopNavbar />
      <Container maxWidth="md">
        <TrustBadges />
        <Hero />
        <ObjectionsBusters />
        <Pricing />
        <TestimonialSection />
        <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}>
          <Box
            component={Paper}
            elevation={8}
            sx={{
              m: { xs: 2, md: 3 },
              px: 3,
              py: { xs: 1, md: 1 },
              borderStyle: "dashed",
              borderWidth: 3,
              borderColor: theme.palette.primary.main,
              borderRadius: 10,
              backgroundColor: theme.palette.warning.main,
              display: "inline-block",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              <strong>3 Small Patches + Touch-Up Paint – Only $200!</strong>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <PromoBadge />
        </Box>
        <HoursOperation />
        <MapServices />
        {/* Discount & Call to Action Section */}
        <Box
          sx={{
            my: { xs: 4, md: 6 },
            textAlign: "center",
            p: { xs: 2, md: 3 },
            backgroundColor: theme.palette.info.main,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Special Introductory Offer!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Get <strong>discounts for first-time service</strong> – Limited time
            only!
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "0.8rem", md: "1rem" },
            }}
          >
            Offer ends July 1st, 2025.
          </Typography>
          <Button
            href="/contact"
            variant="contained"
            size="large"
            color="warning"
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "warning.main",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "warning.dark",
              },
            }}
          >
            Schedule Your Service Today!
          </Button>
        </Box>
        <Footer />
      </Container>
    </ThemeRegistry>
  );
}
