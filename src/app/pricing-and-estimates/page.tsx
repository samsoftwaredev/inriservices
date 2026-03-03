import React from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  AttachMoney,
  CheckCircle,
  Star,
  CalendarToday,
  LocalOffer,
} from "@mui/icons-material";
import { Footer, Meta, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { companyName, companyPhoneFormatted } from "@/constants";
import Link from "next/link";

const location = "Garland, Dallas, Plano";
const pageName = "Pricing & Estimates";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} - Transparent Painting & Drywall Pricing`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    { name: "robots", content: "index, follow" },
    {
      name: "description",
      content: `Clear, upfront pricing for painting and drywall services from ${companyName}. View our service tiers, typical costs, and pricing ranges. Free in-home estimates available`,
    },
    {
      name: "keywords",
      content: `painting prices ${location}, drywall repair cost, house painting quotes, interior painting cost, exterior painting price, cabinet painting cost, transparent pricing painter`,
    },
    { name: "author", content: companyName },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://inripaintwall.com/pricing-and-estimates",
    },
  ],
  linkTags: [
    {
      rel: "canonical",
      href: "https://inripaintwall.com/pricing-and-estimates",
    },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

const PricingAndEstimates = () => {
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
            <AttachMoney
              sx={{ fontSize: 48, mr: 2, verticalAlign: "middle" }}
            />
            Transparent Pricing & Estimates
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
          >
            No hidden fees. No surprises. Just honest pricing from the start.
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          💡 <strong>All prices are estimates.</strong> Final pricing depends on
          project scope, surface condition, and material choices. We provide
          free in-home estimates for accurate quotes.
        </Alert>

        {/* Interior Painting Pricing */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            🏠 Interior Painting Pricing
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Transform your living spaces with professional interior painting.
            Pricing includes surface prep, 2 coats of premium paint, and
            cleanup.
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.light" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Project Scope
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Standard Service
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Premium Service
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    What's Included
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Single Room</strong>
                    <br />
                    <Typography variant="caption">(12x12 avg)</Typography>
                  </TableCell>
                  <TableCell>$300 - $500</TableCell>
                  <TableCell>
                    <Chip label="$500 - $800" color="success" size="small" />
                  </TableCell>
                  <TableCell>Prep, 2 coats, cleanup</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Whole House Interior</strong>
                    <br />
                    <Typography variant="caption">(1,500 sq ft)</Typography>
                  </TableCell>
                  <TableCell>$2,500 - $4,000</TableCell>
                  <TableCell>
                    <Chip
                      label="$4,000 - $6,500"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Full prep, trim, 2 coats premium</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>2-Story Home</strong>
                    <br />
                    <Typography variant="caption">(2,500 sq ft)</Typography>
                  </TableCell>
                  <TableCell>$4,000 - $6,500</TableCell>
                  <TableCell>
                    <Chip
                      label="$6,500 - $10,000"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Complete surface prep, high ceilings</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Exterior Painting Pricing */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            🌳 Exterior Painting Pricing
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Boost your curb appeal and protect your home from Texas weather with
            professional exterior painting.
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "success.light" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Project Scope
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Standard Service
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Premium Service
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    What's Included
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Single Story Home</strong>
                  </TableCell>
                  <TableCell>$3,000 - $5,000</TableCell>
                  <TableCell>
                    <Chip
                      label="$5,000 - $8,000"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    Power wash, prime, 2 coats weather-resistant
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Two Story Home</strong>
                  </TableCell>
                  <TableCell>$5,000 - $8,000</TableCell>
                  <TableCell>
                    <Chip
                      label="$8,000 - $12,000"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Full prep, premium exterior coatings</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Trim & Shutters Only</strong>
                  </TableCell>
                  <TableCell>$800 - $1,500</TableCell>
                  <TableCell>
                    <Chip
                      label="$1,500 - $2,500"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Refresh trim without full repaint</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Drywall Repair Pricing */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            🔧 Drywall Repair Pricing
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ height: "100%", bgcolor: "#e3f2fd" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Small Patch
                  </Typography>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    $50 - $100
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" paragraph>
                    <strong>Size:</strong> 1-5 inches
                  </Typography>
                  <Typography variant="body2">
                    <strong>Includes:</strong> Patch, tape, mud, sand, prime,
                    paint match
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ height: "100%", bgcolor: "#fff3e0" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Medium Repair
                  </Typography>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    $150 - $250
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" paragraph>
                    <strong>Size:</strong> 6-12 inches
                  </Typography>
                  <Typography variant="body2">
                    <strong>Includes:</strong> Cut-out, backing, multi-coat
                    finishing, texture matching
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ height: "100%", bgcolor: "#f3e5f5" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Large Repair
                  </Typography>
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    $300+
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" paragraph>
                    <strong>Size:</strong> 13+ inches
                  </Typography>
                  <Typography variant="body2">
                    <strong>Includes:</strong> Full structural support,
                    extensive finishing, texture, prime, paint
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 3 }}>
            🎁 <strong>Special Offer:</strong> 3 Small Patches + Touch-Up Paint
            – Only $200!
          </Alert>
        </Paper>

        {/* Cabinet Painting Pricing */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            🎨 Cabinet Painting Pricing
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "secondary.light" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Project Scope
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Standard</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Premium</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Kitchen (10-15 cabinets)</TableCell>
                  <TableCell>$1,200 - $2,000</TableCell>
                  <TableCell>
                    <Chip
                      label="$2,000 - $3,500"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bathroom Vanity</TableCell>
                  <TableCell>$300 - $600</TableCell>
                  <TableCell>
                    <Chip label="$600 - $1,000" color="success" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
            Includes: Prep, degreasing, sanding, primer, 2-3 coats, hardware
            reinstall
          </Typography>
        </Paper>

        {/* Service Tiers Comparison */}
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "#f5f5f5" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Standard vs Premium Service
          </Typography>
          <Typography
            variant="body1"
            align="center"
            paragraph
            color="text.secondary"
          >
            Choose the service level that fits your budget and needs
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Standard Service
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Quality contractor-grade paint" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Basic surface preparation" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Professional application" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="30-day touch-up warranty" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Worksite cleanup" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={4}
                sx={{
                  border: "3px solid",
                  borderColor: "success.main",
                  position: "relative",
                }}
              >
                <Chip
                  label="RECOMMENDED"
                  color="success"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontWeight: "bold",
                  }}
                />
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Premium Service
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: "gold" }} />
                      </ListItemIcon>
                      <ListItemText primary="Top-tier brands (Sherwin-Williams, Benjamin Moore)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: "gold" }} />
                      </ListItemIcon>
                      <ListItemText primary="Extensive prep (sanding, caulking, repairs)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: "gold" }} />
                      </ListItemIcon>
                      <ListItemText primary="Low-VOC eco-friendly paint options" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: "gold" }} />
                      </ListItemIcon>
                      <ListItemText primary="6-month workmanship warranty" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: "gold" }} />
                      </ListItemIcon>
                      <ListItemText primary="White-glove cleanup + furniture protection" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Add-On Services */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            <LocalOffer sx={{ mr: 1, verticalAlign: "middle" }} />
            Popular Add-On Services
          </Typography>

          <Grid container spacing={2}>
            {[
              {
                service: "Color Consultation",
                price: "$75 (credited if we do the work)",
              },
              {
                service: "Popcorn Ceiling Removal",
                price: "$1.50 - $3.00 per sq ft",
              },
              {
                service: "Trim Painting",
                price: "$1.50 - $3.00 per linear ft",
              },
              {
                service: "Wallpaper Removal",
                price: "$1.00 - $2.50 per sq ft",
              },
              { service: "Pressure Washing", price: "$0.10 - $0.40 per sq ft" },
              { service: "Deck Staining", price: "$2.00 - $4.00 per sq ft" },
            ].map((addon, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {addon.service}
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {addon.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Estimate Process */}
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "#e8f5e9" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
            How Our Free Estimate Works
          </Typography>

          <Grid container spacing={3} mt={2}>
            {[
              {
                step: "1",
                title: "Schedule a Convenient Time",
                desc: "Book online or call - we come to you",
              },
              {
                step: "2",
                title: "Walk-Through & Measurement",
                desc: "We discuss your vision and assess the space",
              },
              {
                step: "3",
                title: "Detailed Written Quote",
                desc: "Itemized breakdown, no hidden fees",
              },
              {
                step: "4",
                title: "Review Options",
                desc: "Compare Standard vs Premium, add-ons",
              },
              {
                step: "5",
                title: "Book When Ready",
                desc: "No pressure - quote valid 30 days",
              },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={item.step}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: "bold",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {item.step}
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
        </Paper>

        {/* CTA */}
        <Box textAlign="center">
          <Paper
            elevation={3}
            sx={{ p: 4, bgcolor: "primary.main", color: "white" }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" paragraph>
              Schedule your free in-home estimate today - no obligations
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/contact"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                fontSize: "1.2rem",
                px: 4,
                py: 2,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Get Your Free Estimate
            </Button>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
              📞 Call now: {companyPhoneFormatted}
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default PricingAndEstimates;
