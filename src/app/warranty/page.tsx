/**
 * WARRANTY & QUALITY GUARANTEE PAGE
 * Location: src/app/warranty/page.tsx
 *
 * Can also be integrated into FAQ page as expanded accordion section
 */

import React from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Timeline,
  ContactSupport,
  VerifiedUser,
} from "@mui/icons-material";
import { Footer, Meta, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { companyEmail, companyName, companyPhoneFormatted } from "@/constants";
import Link from "next/link";

const metaProps: MetaProps = {
  title: `Warranty & Quality Guarantee | ${companyName} - We Stand Behind Our Work`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    { name: "robots", content: "index, follow" },
    {
      name: "description",
      content: `${companyName} offers written warranties on all painting and drywall work. Learn about our coverage, terms, and quality guarantee.`,
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/warranty" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const Warranty = () => {
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
            <VerifiedUser
              sx={{ fontSize: 48, mr: 2, verticalAlign: "middle" }}
            />
            Warranty & Quality Guarantee
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            We stand behind every project with a written warranty. Your
            satisfaction is our commitment.
          </Typography>
        </Box>

        {/* Warranty Duration */}
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={3} sx={{ height: "100%", bgcolor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Standard Service
                </Typography>
                <Typography variant="h4" color="primary.main" gutterBottom>
                  30 Days
                </Typography>
                <Typography variant="body2">
                  Touch-up warranty covers workmanship issues that appear within
                  30 days of completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                bgcolor: "#c8e6c9",
                border: "3px solid",
                borderColor: "success.main",
              }}
            >
              <CardContent>
                <Chip
                  label="PREMIUM"
                  color="success"
                  size="small"
                  sx={{ mb: 1, fontWeight: "bold" }}
                />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Premium Service
                </Typography>
                <Typography variant="h4" color="success.main" gutterBottom>
                  6 Months
                </Typography>
                <Typography variant="body2">
                  Extended workmanship warranty for premium service customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={3} sx={{ height: "100%", bgcolor: "#fff3e0" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Materials Warranty
                </Typography>
                <Typography variant="h4" color="warning.main" gutterBottom>
                  Varies
                </Typography>
                <Typography variant="body2">
                  Paint manufacturer's warranty (typically 5-25 years depending
                  on brand and product line)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* What's Covered */}
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "#e8f5e9" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="success.main"
          >
            ✅ What's Covered By Our Warranty
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            If any of these issues occur within the warranty period due to our
            workmanship, we'll fix them at no charge:
          </Typography>

          <Grid container spacing={2}>
            {[
              {
                title: "Paint Adhesion Failures",
                desc: "Paint peeling, blistering, or bubbling due to improper prep or application",
              },
              {
                title: "Drywall Tape Separation",
                desc: "Joint compound cracking or tape coming loose",
              },
              {
                title: "Finish Inconsistencies",
                desc: "Visible brush marks, roller stipple, or uneven coverage",
              },
              {
                title: "Color Matching Issues",
                desc: "Touch-up paint doesn't match existing finish",
              },
              {
                title: "Texture Matching",
                desc: "Repaired areas don't blend with surrounding texture",
              },
              {
                title: "Caulking Failures",
                desc: "Caulk separating from surfaces or cracking",
              },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="flex-start">
                      <CheckCircle
                        sx={{ color: "success.main", mr: 1, mt: 0.5 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* What's NOT Covered */}
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "#ffebee" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="error.main"
          >
            ❌ What's NOT Covered
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            The following are not covered under our workmanship warranty:
          </Typography>

          <List>
            {[
              "Normal wear and tear from daily living",
              "Damage caused by impact (furniture, toys, accidents)",
              "Water damage or moisture intrusion after project completion",
              "Structural issues not related to our work (foundation settling, etc.)",
              "Fading due to UV exposure on exterior surfaces",
              "Mold or mildew growth due to moisture problems",
              "Customer-requested changes after project approval",
              "Issues arising more than 6 months after completion",
              "Damage from extreme weather events (hail, flooding)",
              "Improper maintenance or cleaning with harsh chemicals",
            ].map((item, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* How to File a Warranty Claim */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            <ContactSupport sx={{ mr: 1, verticalAlign: "middle" }} />
            How to File a Warranty Claim
          </Typography>

          <Grid container spacing={3} mt={2}>
            {[
              {
                step: "1",
                title: "Contact Us ASAP",
                desc: "Call, email, or text within warranty period",
                icon: "📞",
              },
              {
                step: "2",
                title: "Provide Photos",
                desc: "Send clear photos of the issue (close-up and wide angle)",
                icon: "📸",
              },
              {
                step: "3",
                title: "We'll Schedule Inspection",
                desc: "We'll visit within 5 business days to assess",
                icon: "🔍",
              },
              {
                step: "4",
                title: "Approval & Repair",
                desc: "If covered, we'll repair at no charge",
                icon: "🔧",
              },
              {
                step: "5",
                title: "Warranty Extension",
                desc: "Warranty extends for the repaired area",
                icon: "✅",
              },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={item.step}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Contact Information:</strong>
          </Alert>
          <Typography variant="body1">
            📞 <strong>Phone:</strong> {companyPhoneFormatted}
          </Typography>
          <Typography variant="body1">
            📧 <strong>Email:</strong> {companyEmail}
          </Typography>
          <Typography variant="body1">
            💬 <strong>Text:</strong> {companyPhoneFormatted}
          </Typography>
        </Paper>

        {/* Beyond the Warranty */}
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "#f5f5f5" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            <Timeline sx={{ mr: 1, verticalAlign: "middle" }} />
            Our Quality Commitment (Beyond the Warranty)
          </Typography>
          <Typography variant="body1" paragraph>
            Even before issues arise, we ensure quality with:
          </Typography>

          <Grid container spacing={2}>
            {[
              "✅ Pre-project walkthrough and scope approval",
              "✅ Daily progress photos and updates",
              "✅ Final walkthrough before payment requested",
              "✅ Touch-up kit with matching paint left with you",
              "✅ Written care and maintenance instructions",
              "✅ 24-hour response time to warranty claims",
            ].map((item, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                <Box display="flex" alignItems="center" p={2}>
                  <Typography variant="body1">{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* CTA */}
        <Box textAlign="center">
          <Paper
            elevation={3}
            sx={{ p: 4, bgcolor: "primary.main", color: "white" }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Questions About Our Warranty?
            </Typography>
            <Typography variant="body1" paragraph>
              We're here to answer any questions about our coverage and quality
              guarantee
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                mr: 2,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/pricing-and-estimates"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              View Pricing
            </Button>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Warranty;
