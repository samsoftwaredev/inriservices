/**
 * LICENSING & INSURANCE PAGE
 * Location: src/app/licensing-and-insurance/page.tsx
 *
 * MANUAL INPUT REQUIRED:
 * - Replace [LICENSE_NUMBER] with actual Texas contractor license
 * - Replace [INSURANCE_AMOUNT] with actual coverage amounts
 * - Replace [INSURANCE_PROVIDER] with actual insurance company
 * - Add actual certification numbers and dates
 * - Upload certificate PDFs to /public/certificates/
 */

import React from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
} from "@mui/material";
import {
  VerifiedUser,
  Security,
  CheckCircle,
  Download,
  Shield,
} from "@mui/icons-material";
import { Footer, Meta, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { companyName } from "@/constants";
import Link from "next/link";

const location = "Garland, Dallas, Plano";
const pageName = "Licensing & Insurance";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} - Fully Licensed & Insured Texas Contractor`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    { name: "robots", content: "index, follow" },
    {
      name: "description",
      content: `${companyName} is a fully licensed and insured painting contractor in Texas. View our credentials, insurance coverage, EPA certifications, and professional qualifications.`,
    },
    {
      name: "keywords",
      content: `licensed painter ${location}, insured contractor Texas, painting license, EPA lead safe certified, bonded painter, professional painting certifications`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://inripaintwall.com/licensing-and-insurance",
    },
    {
      property: "og:title",
      content: `Licensed & Insured Painter | ${companyName}`,
    },
    {
      property: "og:description",
      content:
        "Fully licensed, insured, and certified painting contractor with EPA lead-safe certification.",
    },
    { property: "og:image", content: "https://inripaintwall.com/og-image.jpg" },
  ],
  linkTags: [
    {
      rel: "canonical",
      href: "https://inripaintwall.com/licensing-and-insurance",
    },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const LicensingAndInsurance = () => {
  return (
    <>
      <Meta {...metaProps} />
      <TopNavbar />

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            <Shield sx={{ fontSize: 48, mr: 2, verticalAlign: "middle" }} />
            Licensing, Insurance & Certifications
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            At {companyName}, we take your peace of mind seriously. We're fully
            licensed, insured, and committed to professional excellence.
          </Typography>
        </Box>

        {/* Verification Alert */}
        <Alert
          severity="success"
          icon={<VerifiedUser />}
          sx={{ mb: 4, fontSize: "1.1rem" }}
        >
          <strong>Verified & Compliant:</strong> All licenses and insurance
          policies are active and up-to-date. Documentation available upon
          request.
        </Alert>

        <Grid container spacing={4}>
          {/* Texas State Contractor License */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: "#e3f2fd",
                borderRadius: 3,
              }}
            >
              {/* Why This Matters */}
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                ✅ Why This Matters to You
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Your property is fully protected"
                    secondary="Insurance covers any unlikely accidents or damage"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Zero liability for worker injuries"
                    secondary="Workers' comp means you're never responsible"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Proper permits & building codes"
                    secondary="Licensed contractors ensure compliance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Professional workmanship standards"
                    secondary="Backed by certifications and training"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Peace of mind with every project"
                    secondary="No worries, no surprises, just quality work"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Insurance Coverage */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: "#f3e5f5",
                borderRadius: 3,
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Security
                  sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
                />
                <Typography variant="h5" fontWeight="bold" color="secondary">
                  Active Insurance Coverage
                </Typography>
              </Box>

              <Card sx={{ mb: 2, bgcolor: "white" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    General Liability Insurance
                  </Typography>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    $1,100,000 Coverage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Protects your property from accidental damage during our
                    work
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    Provider: State National Insurance Company, Inc.
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: "white" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Workers' Compensation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All employees covered - protects you from liability if a
                    worker is injured on your property
                  </Typography>
                  <Chip
                    label="FULL COVERAGE"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>

              <Button
                variant="contained"
                startIcon={<Download />}
                fullWidth
                sx={{ mt: 2 }}
                target="insurance"
                href="https://portal.nextinsurance.com/public/certificates/live-certificate/b3bc54272d844f07920c0c6dbf3807f2?channel=coi&source=qr"
                download
              >
                Download Insurance Certificate
              </Button>
            </Paper>
          </Grid>

          {/* Professional Certifications */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: "#fff3e0",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                Professional Certifications & Training
              </Typography>

              <Grid container spacing={3} mt={1}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      p: 3,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🏛️ EPA Lead-Safe Certified
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Renovation, Repair & Painting (RRP) Program
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Required for all homes built before 1978. Ensures safe
                      handling of lead-based paint.
                    </Typography>
                    <Box mt={2}>
                      <Chip
                        label="EPA Certified"
                        color="success"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      p: 3,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🦺 OSHA Safety Certified
                    </Typography>
                    <Typography variant="body2" paragraph>
                      OSHA 10-Hour Construction Safety
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      All team members trained in workplace safety standards and
                      protocols.
                    </Typography>
                    <Box mt={2}>
                      <Chip label="OSHA Trained" color="primary" size="small" />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      p: 3,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🎨 Industry Memberships
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Professional Painting Organizations
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {/* ⚠️ ADD ACTUAL MEMBERSHIPS: PDCA, Master Painters Institute, etc. */}
                      Committed to staying current with industry best practices
                      and standards.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* CTA */}
        <Box textAlign="center" mt={6}>
          <Paper
            elevation={3}
            sx={{ p: 4, bgcolor: "primary.main", color: "white" }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready to Work with a Trusted Professional?
            </Typography>
            <Typography variant="body1" paragraph>
              Request a copy of our insurance certificate with your free
              estimate
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Get Your Free Estimate
            </Button>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default LicensingAndInsurance;
