"use client";
import { Footer, Meta, SampleWork, TopNavbar } from "@/components";
import {
  companyEmail,
  companyName,
  companyPhone,
  companyPhoneFormatted,
} from "@/constants";
import { MetaProps } from "@/interfaces";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { theme } from "../theme";
import { useState } from "react";

const services = [
  {
    title: "Interior Painting",
    description:
      "Refresh your living spaces with high-quality interior painting services.",
    emoji: "🏠",
  },
  {
    title: "Exterior Painting",
    description:
      "Boost your home's curb appeal with durable and vibrant exterior painting.",
    emoji: "🌳",
  },
  {
    title: "Trim Repair and Installation",
    description:
      "Enhance your home's aesthetics with professional trim repair and installation services.",
    emoji: "🪚",
  },
  {
    title: "Cabinet Painting",
    description:
      "Revitalize your kitchen or bathroom with a fresh coat of paint on your cabinets.",
    emoji: "🎨",
  },
  {
    title: "ReTexture Walls",
    description:
      "Transform your walls with modern textures for a stylish and updated look.",
    emoji: "🖌️",
  },
  {
    title: "Wallpaper Removal",
    description:
      "Remove outdated wallpaper to prepare your walls for a new look.",
    emoji: "🧹",
  },
  {
    title: "Popcorn Ceiling Removal",
    description:
      "Modernize your ceilings by removing old popcorn textures for a smooth finish.",
    emoji: "🪜",
  },
  {
    title: "Deck Staining and Sealing",
    description:
      "Protect and beautify your deck with expert staining and sealing services.",
    emoji: "🌞",
  },
  {
    title: "Drywall Repair and Installation",
    description:
      "Ensure a flawless finish with professional drywall installation and repair.",
    emoji: "🔧",
  },
  {
    title: "Pressure Washing",
    description:
      "Clean and restore your home's exterior surfaces with powerful pressure washing.",
    emoji: "💦",
  },
];

const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName = "Our Work - Painting & Drywall Projects";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} | Project Gallery & Success Stories in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    {
      name: "description",
      content: `Explore our portfolio of completed painting and drywall projects in ${location}, TX. See before-and-after photos, customer testimonials, and the quality craftsmanship delivered by INRI Paint & Wall.`,
    },
    {
      name: "keywords",
      content: `painting project gallery, previous work, before and after painting, drywall repair projects, ${location} painting contractors, INRI Paint & Wall portfolio, house painting examples, customer testimonials, local painting company, completed projects`,
    },
    { name: "author", content: "INRI Paint & Wall" },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://inripaintwall.com/our-work",
    },
    {
      property: "og:title",
      content: `Our Previous Work | INRI Paint & Wall | Painting & Drywall Project Gallery in ${location}`,
    },
    {
      property: "og:description",
      content: `Discover real results from INRI Paint & Wall's painting and drywall services in ${location}, TX. View our project gallery and see why homeowners trust us.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `Our Work | INRI Paint & Wall | Project Gallery in ${location}`,
    },
    {
      name: "twitter:description",
      content: `See completed painting and drywall projects by INRI Paint & Wall in ${location}, TX. Quality, reliability, and customer satisfaction in every job.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/our-previous-work" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

export default function OurPreviousWorkPage() {
  const [selectedTrade, setSelectedTrade] = useState(0);

  const handleTradeChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setSelectedTrade(newValue);
  };

  return (
    <>
      <Meta {...metaProps} />
      <TopNavbar />
      <Container maxWidth="lg" sx={{ my: 10 }}>
        {/* Partner Hero Section */}
        <Box
          component="section"
          sx={{
            py: { xs: 7, md: 12 },
            px: { xs: 2, md: 6 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 6, md: 10 },
            background: theme.palette.info.main,
            borderRadius: 6,
            boxShadow: 8,
            mb: 6,
            position: "relative",
            overflow: "hidden",
            minHeight: { md: 420 },
          }}
        >
          {/* Abstract Illustration */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              left: -60,
              width: 180,
              height: 180,
              background: `radial-gradient(circle, ${theme.palette.primary.main} 60%, transparent 100%)`,
              opacity: 0.18,
              zIndex: 0,
              borderRadius: "50%",
              filter: "blur(12px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              right: -40,
              width: 140,
              height: 140,
              background: `radial-gradient(circle, ${theme.palette.warning.main} 60%, transparent 100%)`,
              opacity: 0.15,
              zIndex: 0,
              borderRadius: "50%",
              filter: "blur(10px)",
            }}
          />

          <Box sx={{ zIndex: 1, flex: 1, minWidth: 0 }}>
            <Typography
              variant="h1"
              component="h1"
              fontSize={{ xs: "2.8rem", md: "3.8rem" }}
              fontWeight={900}
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: -1,
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              We Make You Look Good.
            </Typography>
            <Typography
              variant="h2"
              fontSize={{ xs: "1.3rem", md: "1.7rem" }}
              color={theme.palette.primary.main}
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                mb: 3,
              }}
            >
              Partner with INRI Paint & Wall — Reliable Painting & Drywall for
              Your Clients
            </Typography>

            {/* Partner Promises */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography fontSize="1.5rem">⚡</Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  Estimate in 24 hours
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography fontSize="1.5rem">📋</Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  On-time + detailed written estimates
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography fontSize="1.5rem">🛡️</Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  COI available immediately
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography fontSize="1.5rem">💰</Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  $100 per closed referral
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 24px 0 rgba(73,181,254,0.18)",
                  background: theme.palette.primary.main,
                  color: "#fff",
                  textTransform: "none",
                  letterSpacing: 0.5,
                  transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                  "&:hover": {
                    background: theme.palette.warning.main,
                    color: "#fff",
                    transform: "translateY(-2px) scale(1.04)",
                    boxShadow: "0 8px 32px 0 rgba(247,189,89,0.18)",
                  },
                }}
                href="#partner-form"
              >
                Become a Referral Partner
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  borderRadius: 3,
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  textTransform: "none",
                  letterSpacing: 0.5,
                  transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                  "&:hover": {
                    background: theme.palette.primary.main,
                    color: "#fff",
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: "translateY(-2px)",
                  },
                }}
                href="/documents/COI.pdf"
                target="_blank"
              >
                Download COI (PDF)
              </Button>
            </Box>
          </Box>

          <Box
            component="img"
            src="/beforeAfterPictures/door.png"
            alt="Before and after painting project by INRI Paint & Wall"
            sx={{
              width: { xs: "100%", md: 420 },
              maxWidth: 500,
              borderRadius: 5,
              boxShadow: 8,
              objectFit: "cover",
              zIndex: 1,
              border: `4px solid ${theme.palette.primary.main}`,
              filter: "brightness(0.98) saturate(1.08)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.03) rotate(-2deg)",
                boxShadow: "0 12px 36px 0 rgba(73,181,254,0.18)",
              },
            }}
          />
        </Box>

        {/* Partner Proof Bar */}
        <Box
          component="section"
          sx={{
            py: 3,
            px: { xs: 2, md: 4 },
            background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
            borderRadius: 4,
            boxShadow: 2,
            mb: 8,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  ⭐
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  4.9/5.0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <a
                    href="https://g.page/r/YOUR_GOOGLE_ID"
                    target="_blank"
                    rel="noopener"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Google Reviews
                  </a>
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  ✅
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  Insured
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  COI Available
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  ⏱️
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  24-Hour
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Estimate
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  🧾
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  Detailed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Estimates
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  🧹
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  Clean
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Worksite
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize="1.8rem" mb={0.5}>
                  🤝
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  Trade-Ready
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Professional
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* How Referrals Work */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            textAlign="center"
            sx={{
              color: theme.palette.primary.main,
              mb: 5,
            }}
          >
            🤝 How Referrals Work
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: theme.palette.info.main,
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  border: `3px solid ${theme.palette.primary.main}`,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "2.5rem",
                  }}
                >
                  1️⃣
                </Box>
                <Typography
                  variant="h3"
                  fontSize="1.4rem"
                  fontWeight={700}
                  gutterBottom
                  color={theme.palette.primary.main}
                >
                  Send the Lead
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Text or email us: <b>name, phone, address</b> (or just intro
                  us to your client). That&apos;s it.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: theme.palette.info.main,
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  border: `3px solid ${theme.palette.warning.main}`,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: theme.palette.warning.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "2.5rem",
                  }}
                >
                  2️⃣
                </Box>
                <Typography
                  variant="h3"
                  fontSize="1.4rem"
                  fontWeight={700}
                  gutterBottom
                  color={theme.palette.warning.main}
                >
                  We Handle It
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We estimate within <b>24 hours</b>, keep you updated, and
                  deliver quality work on time.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: theme.palette.info.main,
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  border: `3px solid #4caf50`,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "2.5rem",
                  }}
                >
                  3️⃣
                </Box>
                <Typography
                  variant="h3"
                  fontSize="1.4rem"
                  fontWeight={700}
                  gutterBottom
                  color="#4caf50"
                >
                  You Get Paid
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Client signs & pays? You receive <b>$100 within 7 days</b>.
                  Simple as that.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.95rem" }}
            >
              💡 <b>Non-exclusive.</b> No spam. We never pitch your clients
              unrelated services.
            </Typography>
          </Box>
        </Box>

        {/* Trade-Specific Blocks */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            mb: 8,
            background: theme.palette.info.main,
            borderRadius: 5,
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            textAlign="center"
            sx={{
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            🛠️ Built for Your Trade
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={selectedTrade}
              onChange={handleTradeChange}
              centered
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                },
              }}
            >
              <Tab label="🏠 Realtors" />
              <Tab label="🔧 Plumbers" />
              <Tab label="⚡ Electricians" />
            </Tabs>
          </Box>

          {/* Realtor Tab */}
          {selectedTrade === 0 && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                variant="h3"
                fontSize="1.6rem"
                fontWeight={700}
                gutterBottom
                color={theme.palette.primary.main}
              >
                For Real Estate Professionals
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 3 }}
              >
                Get listings sale-ready fast with our reliable painting and
                drywall services.
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">✨</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Listing Refresh
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quick paint touch-ups to maximize sale price
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">📋</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Punch Lists
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pre-closing repairs done right, on time
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">⏰</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Quick Turnaround
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We work around showings and deadlines
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🧹</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Clean Close
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Spotless worksite, protected floors, ready to show
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Plumber Tab */}
          {selectedTrade === 1 && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                variant="h3"
                fontSize="1.6rem"
                fontWeight={700}
                gutterBottom
                color={theme.palette.primary.main}
              >
                For Plumbing Contractors
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 3 }}
              >
                Seamless drywall patches and paint after your plumbing work is
                complete.
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🔧</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Drywall Patches
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Flawless repairs after leak fixes or repipes
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🎨</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Texture Matching
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blends perfectly with existing walls/ceilings
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🖌️</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Repaint After Repairs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Touch-ups or full room paint as needed
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🤝</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Coordination
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We schedule around your timeline
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Electrician Tab */}
          {selectedTrade === 2 && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                variant="h3"
                fontSize="1.6rem"
                fontWeight={700}
                gutterBottom
                color={theme.palette.primary.main}
              >
                For Electrical Contractors
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 3 }}
              >
                Professional drywall and paint finishing after electrical
                upgrades and installations.
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">⚡</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        After Rewires
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patch & paint after conduit/wire runs
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">💡</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Can Light Installs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Clean finish around new recessed lighting
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">🔌</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Panel Upgrades
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Drywall repair & paint around new panels
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography fontSize="1.5rem">✅</Typography>
                    <Box>
                      <Typography fontWeight={700} color="text.primary">
                        Ready for Inspection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Clean, professional finish every time
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Featured Projects Gallery */}
        <Box id="featured-projects" sx={{ mb: 8 }}>
          <SampleWork services={services} />
        </Box>

        {/* Reviews Section */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            textAlign="center"
            sx={{
              color: theme.palette.primary.main,
              mb: 5,
            }}
          >
            ⭐ What Partners & Clients Say
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 3,
                  height: "100%",
                  border: `2px solid ${theme.palette.info.main}`,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    fontSize="1.3rem"
                    color={theme.palette.warning.main}
                  >
                    ★★★★★
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ fontStyle: "italic", mb: 2 }}
                >
                  &quot;INRI came through with a 24-hour estimate and finished
                  the drywall repair ahead of schedule. My client was thrilled.
                  I&apos;ll use them again.&quot;
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  — Sarah M., Realtor
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 3,
                  height: "100%",
                  border: `2px solid ${theme.palette.info.main}`,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    fontSize="1.3rem"
                    color={theme.palette.warning.main}
                  >
                    ★★★★★
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ fontStyle: "italic", mb: 2 }}
                >
                  &quot;Super clean, professional crew. They patched the ceiling
                  after we installed new lighting and it looks brand new. Easy
                  to work with.&quot;
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  — Mike R., Electrician
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 3,
                  height: "100%",
                  border: `2px solid ${theme.palette.info.main}`,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    fontSize="1.3rem"
                    color={theme.palette.warning.main}
                  >
                    ★★★★★
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ fontStyle: "italic", mb: 2 }}
                >
                  &quot;Fast, reliable, and they communicate every step of the
                  way. The homeowner was impressed, and so was I. Highly
                  recommend for any trade partner.&quot;
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                >
                  — Jason T., Plumber
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderRadius: 3,
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": {
                  background: theme.palette.primary.main,
                  color: "#fff",
                },
              }}
              href="https://g.page/r/YOUR_GOOGLE_ID"
              target="_blank"
            >
              Read All Reviews on Google
            </Button>
          </Box>
        </Box>

        {/* Partner Packet Download */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || "#0066cc"} 100%)`,
            borderRadius: 5,
            boxShadow: 4,
            mb: 8,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            sx={{ mb: 2 }}
          >
            📄 Download Partner Packet
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
          >
            Get our complete partner packet with services overview, before/after
            photos, COI info, and contact details—all in one PDF.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontWeight: 800,
              fontSize: "1.2rem",
              borderRadius: 3,
              background: theme.palette.warning.main,
              color: "#fff",
              textTransform: "none",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.2)",
              "&:hover": {
                background: "#fff",
                color: theme.palette.primary.main,
              },
            }}
            href="/documents/Partner-Packet.pdf"
            target="_blank"
          >
            Download Partner Packet (PDF)
          </Button>
        </Box>

        {/* Communication & On-time Guarantee */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 4 },
            mb: 8,
            background: theme.palette.info.main,
            borderRadius: 5,
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            textAlign="center"
            sx={{
              color: theme.palette.primary.main,
              mb: 5,
            }}
          >
            ✅ Our Service Standards
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 2,
                  height: "100%",
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography fontSize="2.5rem" mb={1}>
                  ⚡
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={theme.palette.primary.main}
                  gutterBottom
                >
                  24-Hour Estimates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every inquiry gets a detailed estimate within one business day
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 2,
                  height: "100%",
                  border: `2px solid ${theme.palette.warning.main}`,
                }}
              >
                <Typography fontSize="2.5rem" mb={1}>
                  💬
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={theme.palette.warning.main}
                  gutterBottom
                >
                  Daily Updates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Progress photos and status updates throughout active projects
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 2,
                  height: "100%",
                  border: `2px solid #4caf50`,
                }}
              >
                <Typography fontSize="2.5rem" mb={1}>
                  🕐
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#4caf50"
                  gutterBottom
                >
                  Arrival Windows
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clear time windows so you and your clients know when
                  we&apos;ll arrive
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 2,
                  height: "100%",
                  border: `2px solid #9c27b0`,
                }}
              >
                <Typography fontSize="2.5rem" mb={1}>
                  📋
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#9c27b0"
                  gutterBottom
                >
                  Written Scope
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed written estimates and change orders—no surprises
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Partner Form Section */}
        <Box
          id="partner-form"
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 6 },
            background: theme.palette.info.main,
            borderRadius: 5,
            boxShadow: 4,
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            textAlign="center"
            sx={{
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            🤝 Become a Referral Partner
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
          >
            Fill out the form below and we&apos;ll set you up as a referral
            partner. Start earning $100 per closed referral today!
          </Typography>
          <Box
            sx={{
              maxWidth: 600,
              mx: "auto",
              background: "#fff",
              p: 4,
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              📧 Email us at:{" "}
              <a
                href={`mailto:${companyEmail}`}
                style={{ color: theme.palette.primary.main, fontWeight: 700 }}
              >
                {companyEmail}
              </a>
              <br />
              📱 Or text/call:{" "}
              <a
                href={`tel:${companyPhone}`}
                style={{ color: theme.palette.primary.main, fontWeight: 700 }}
              >
                {companyPhoneFormatted}
              </a>
            </Typography>
          </Box>
        </Box>

        {/* Featured Projects - Already exists in original */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 10 },
            px: { xs: 1, md: 4 },
            mb: 10,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              background: `linear-gradient(135deg, ${theme.palette.info.main} 60%, transparent 100%)`,
              opacity: 0.25,
              zIndex: 0,
              borderRadius: "30% 70% 70% 30%/30% 30% 70% 70%",
              filter: "blur(8px)",
            }}
          />
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: theme.palette.primary.main,
              mb: 5,
              zIndex: 1,
            }}
          >
            🏆 Featured Painting & Drywall Projects
          </Typography>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  background: theme.palette.info.main,
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderLeft: `6px solid ${theme.palette.primary.main}`,
                  position: "relative",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.02)",
                  },
                  "&:before": {
                    content: '"🛋️"',
                    position: "absolute",
                    top: 16,
                    left: -38,
                    fontSize: "2.5rem",
                  },
                }}
              >
                <Typography
                  variant="h3"
                  fontSize="1.35rem"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    color: theme.palette.warning.main,
                  }}
                >
                  Interior Painting & Drywall Repair – Plano, TX
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <b>Complete living room transformation:</b> repaired damaged
                  drywall, primed, and applied premium paint for a modern, clean
                  look.
                  <br />
                  <span role="img" aria-label="praise">
                    👏
                  </span>{" "}
                  Customer praised our attention to detail and fast turnaround.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  background: theme.palette.info.main,
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderLeft: `6px solid ${theme.palette.warning.main}`,
                  position: "relative",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.02)",
                  },
                  "&:before": {
                    content: '"🏡"',
                    position: "absolute",
                    top: 16,
                    left: -38,
                    fontSize: "2.5rem",
                  },
                }}
              >
                <Typography
                  variant="h3"
                  fontSize="1.35rem"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  Exterior House Painting – Garland, TX
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <b>Revitalized faded siding and trim</b> with
                  weather-resistant coatings. Improved curb appeal and protected
                  the home from Texas weather.
                  <br />
                  <span role="img" aria-label="medal">
                    🏅
                  </span>{" "}
                  Homeowner highlighted our professionalism and quality.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Why Homeowners Trust INRI Paint & Wall */}
        <Box
          component="section"
          sx={{
            py: 8,
            px: { xs: 2, md: 6 },
            background: theme.palette.primary.main,
            borderRadius: 5,
            boxShadow: 4,
            mb: 8,
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              background: `linear-gradient(135deg, ${theme.palette.info.main} 60%, transparent 100%)`,
              opacity: 0.18,
              zIndex: 0,
              borderRadius: "50%",
              filter: "blur(8px)",
            }}
          />
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#fff",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.18)",
              mb: 3,
              zIndex: 1,
            }}
          >
            ⭐ Why Homeowners Choose Our Painting & Drywall Services
          </Typography>
          <Typography
            variant="subtitle1"
            color="rgba(255,255,255,0.85)"
            sx={{
              mb: 4,
              maxWidth: 600,
              zIndex: 1,
            }}
          >
            Discover what sets us apart and why Dallas-area homeowners trust
            INRI Paint & Wall for their most important projects.
          </Typography>
          <Grid container spacing={3} sx={{ zIndex: 1, position: "relative" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 6,
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    lineHeight: 1,
                    mr: 1,
                  }}
                  aria-label="5-star reviews"
                >
                  🌟
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#fff",
                    }}
                  >
                    Proven Track Record
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Dozens of <b>5-star reviews</b> from satisfied clients
                    highlight our commitment to quality and customer
                    satisfaction.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 6,
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    lineHeight: 1,
                    mr: 1,
                  }}
                  aria-label="paint and drywall"
                >
                  🛠️
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#fff",
                    }}
                  >
                    Seamless Results
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Skilled in both <b>painting</b> and <b>drywall repair</b>{" "}
                    for flawless, long-lasting finishes in every room.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 6,
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    lineHeight: 1,
                    mr: 1,
                  }}
                  aria-label="clock and checklist"
                >
                  ⏱️
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#fff",
                    }}
                  >
                    Transparent & Reliable
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    <b>Clear estimates</b>, honest communication, and{" "}
                    <b>on-time project completion</b>—every time.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 6,
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    lineHeight: 1,
                    mr: 1,
                  }}
                  aria-label="shield"
                >
                  🛡️
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#fff",
                    }}
                  >
                    Licensed & Insured
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Fully <b>licensed</b>, <b>insured</b>, and all work is{" "}
                    <b>warranty-backed</b> for your peace of mind.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 5, textAlign: "center", zIndex: 1, position: "relative" }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 4px 24px 0 rgba(247,189,89,0.18)",
                background: theme.palette.warning.main,
                color: "#fff",
                letterSpacing: 0.5,
                textTransform: "none",
                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                "&:hover": {
                  background: "#fff",
                  color: theme.palette.warning.main,
                  border: `2px solid ${theme.palette.warning.main}`,
                  transform: "translateY(-2px) scale(1.04)",
                },
              }}
              href="/contact"
            >
              Get Your Free Estimate
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
