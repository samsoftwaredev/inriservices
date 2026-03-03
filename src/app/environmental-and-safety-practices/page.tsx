"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import {
  Compost as EcoIcon,
  Shield as ShieldIcon,
  Air as AirIcon,
  Construction as ConstructionIcon,
  Recycling as RecyclingIcon,
  Home as HomeIcon,
  VerifiedUser as VerifiedIcon,
  CheckCircle as CheckIcon,
  ContactPage as ContactIcon,
} from "@mui/icons-material";
import Link from "next/link";
import Meta from "@/components/Meta";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";

export default function EnvironmentalSafetyPage() {
  const sections = [
    {
      icon: <EcoIcon sx={{ fontSize: 40, color: "#2e7d32" }} />,
      title: "🌱 Low-VOC & Eco-Friendly Paint Options",
      content: [
        "We offer low-VOC (Volatile Organic Compounds) and zero-VOC paint upon request",
        "These paints reduce indoor air pollution and odors",
        "Perfect for homes with children, pets, or sensitive individuals",
        "Available from all major brands: Sherwin-Williams Harmony, Benjamin Moore Natura",
        "Low-odor formulas mean you can return home faster",
      ],
      callout:
        "Ask about eco-friendly options during your estimate - often same price!",
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
      title: "🛡️ Lead-Safe Practices (EPA RRP Certified)",
      content: [
        "Required for all homes built before 1978",
        "EPA-certified lead-safe practices protect your family",
        "Proper containment and cleanup procedures",
        "Testing available if lead paint suspected",
        "Full documentation and certification provided",
      ],
    },
    {
      icon: <AirIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "💨 Dust Control & Containment",
      content: [
        "Heavy-duty plastic containment systems for sanding operations",
        "HEPA vacuum filtration for dust collection",
        "Sealed work zones prevent dust spread to other rooms",
        "HVAC vents covered to prevent dust circulation",
        "Air scrubbers available for extensive renovation projects",
      ],
    },
    {
      icon: <ConstructionIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
      title: "👷 Job Site Safety Protocols",
      content: [
        "All workers trained in OSHA safety standards",
        "Proper ladder safety and fall protection",
        "Electrical safety protocols around outlets and fixtures",
        "Chemical storage and handling per regulations",
        "Daily safety briefings for multi-person crews",
      ],
    },
    {
      icon: <RecyclingIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
      title: "♻️ Waste Disposal & Recycling",
      content: [
        "Proper disposal of paint waste per Texas regulations",
        "Paint recycling when available",
        "Responsible disposal of contaminated materials",
        "Drop cloths and materials cleaned and reused",
        "Minimal job site waste generation",
      ],
    },
    {
      icon: <HomeIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />,
      title: "🏡 Occupant Safety During Work",
      content: [
        "Work zones clearly marked and secured",
        "Proper ventilation maintained during painting",
        "Safe access routes for occupants",
        "Pet and child safety protocols discussed pre-project",
        "After-hours work available to minimize disruption",
      ],
    },
  ];

  const certifications = [
    "EPA Lead-Safe Certified (RRP)",
    "OSHA 10-Hour Construction Safety",
    "Ongoing safety training for all team members",
  ];

  return (
    <>
      <Meta
        title="Environmental & Safety Practices | INRI Paint & Wall"
        metaTags={[
          {
            name: "description",
            content:
              "Learn about INRI Paint & Wall's commitment to environmental protection and safety. EPA RRP certified, low-VOC paint options, OSHA compliance, and comprehensive safety protocols for your home.",
          },
          {
            property: "og:title",
            content: "Environmental & Safety Practices | INRI Paint & Wall",
          },
          {
            property: "og:description",
            content:
              "Learn about INRI Paint & Wall's commitment to environmental protection and safety. EPA RRP certified, low-VOC paint options, OSHA compliance, and comprehensive safety protocols for your home.",
          },
          {
            property: "og:url",
            content:
              "https://inripaintwall.com/environmental-and-safety-practices",
          },
        ]}
      >
        Learn about INRI Paint & Wall's commitment to environmental protection
        and safety. EPA RRP certified, low-VOC paint options, OSHA compliance,
        and comprehensive safety protocols for your home.
      </Meta>
      <TopNavbar />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 2,
            }}
          >
            Environmental & Safety Practices
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 400,
              color: "#555",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            We're committed to protecting your family, our workers, and the
            environment.
          </Typography>
        </Box>

        {/* Introduction Alert */}
        <Alert severity="info" icon={<VerifiedIcon />} sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Your Safety is Our Priority:</strong> We follow all EPA,
            OSHA, and Texas state regulations to ensure a safe, healthy, and
            environmentally responsible painting experience.
          </Typography>
        </Alert>

        {/* Main Content Sections */}
        {sections.map((section, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <Grid container spacing={3}>
              <Grid
                size={{ xs: 12, md: 2 }}
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  {section.icon}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 10 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                    fontWeight: 600,
                    color: "#1a1a1a",
                    mb: 2,
                  }}
                >
                  {section.title}
                </Typography>
                <List>
                  {section.content.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckIcon sx={{ color: "#2e7d32" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          sx: { fontSize: "1rem", color: "#333" },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                {section.callout && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      💡 {section.callout}
                    </Typography>
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Certifications Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <VerifiedIcon sx={{ fontSize: 50, mb: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.8rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Certifications & Training
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
              Our team maintains current certifications and ongoing training to
              ensure the highest standards of safety and professionalism.
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {certifications.map((cert, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Chip
                  icon={<VerifiedIcon sx={{ color: "#fff !important" }} />}
                  label={cert}
                  sx={{
                    width: "100%",
                    py: 2.5,
                    fontSize: "0.95rem",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "& .MuiChip-label": {
                      whiteSpace: "normal",
                      textAlign: "center",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", opacity: 0.9 }}
            >
              ⚠️ All certifications are maintained current and documentation is
              available upon request.
            </Typography>
          </Box>
        </Paper>

        {/* Additional Information Box */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: "1.3rem", fontWeight: 600, mb: 2 }}
          >
            Understanding Key Safety Terms
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>VOCs (Volatile Organic Compounds):</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                Chemicals that evaporate from paint and can affect indoor air
                quality. Low-VOC paints contain fewer of these compounds, making
                them safer for your family and better for the environment.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>EPA RRP Certification:</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                Renovation, Repair, and Painting rule requires special training
                for working safely around lead-based paint in homes built before
                1978. This protects both workers and occupants from lead
                exposure.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>HEPA Filtration:</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                High-Efficiency Particulate Air filters that capture 99.97% of
                dust particles, ensuring cleaner air during and after sanding
                operations.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>OSHA Standards:</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                Occupational Safety and Health Administration regulations that
                protect workers from hazards like falls, electrical risks, and
                chemical exposure.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 5 }} />

        {/* Call to Action Section */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: 3,
          }}
        >
          <ContactIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ask About Our Eco-Friendly Options & Safety Protocols
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              mb: 3,
              maxWidth: "700px",
              mx: "auto",
              opacity: 0.95,
            }}
          >
            We're happy to discuss our environmental practices, safety
            certifications, and low-VOC paint options during your free estimate.
            Your family's health and safety are our top priority.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#fff",
                color: "#667eea",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Contact Us Today
            </Button>
            <Button
              component={Link}
              href="/get-painting-estimate-in-minutes"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Get Free Estimate
            </Button>
          </Box>
        </Paper>

        {/* Additional Resources */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
            <strong>Related Pages:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/licensing-and-insurance"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              Licensing & Insurance
            </Link>
            <span style={{ color: "#ccc" }}>•</span>
            <Link
              href="/warranty-and-guarantee"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              Warranty & Guarantee
            </Link>
            <span style={{ color: "#ccc" }}>•</span>
            <Link
              href="/pricing-and-estimates"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              Pricing & Estimates
            </Link>
            <span style={{ color: "#ccc" }}>•</span>
            <Link
              href="/frequently-asked-questions"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              FAQs
            </Link>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
