import { Footer, Meta, SampleWork, TopNavbar } from "@/components";
import { companyName } from "@/constants";
import { MetaProps } from "@/interfaces";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { theme } from "../theme";

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
  // ...same as before
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
  return (
    <>
      <Meta {...metaProps} />
      <TopNavbar />
      <Container maxWidth="lg" sx={{ my: 10 }}>
        {/* Hero Section */}
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
            mb: 10,
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
              component="h3"
              fontSize={{ xs: "2.4rem", md: "3.4rem" }}
              fontWeight={900}
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: -1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                lineHeight: 1.1,
              }}
            >
              🖼️ Our Previous Painting & Drywall Projects
            </Typography>
            <Typography
              variant="h2"
              fontSize={{ xs: "1.2rem", md: "1.6rem" }}
              color={theme.palette.primary.main}
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                mb: 2,
              }}
            >
              ✨ Real Results — Residential & Commercial Transformations
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{
                fontSize: { xs: "1.05rem", md: "1.18rem" },
                mb: 2,
                maxWidth: 600,
                lineHeight: 1.7,
              }}
            >
              Explore our gallery of completed painting and drywall repair
              projects across <b>Dallas, Garland, Plano</b>, and surrounding
              areas.
              <br />
              <span role="img" aria-label="camera">
                📸
              </span>{" "}
              See before-and-after photos,{" "}
              <span role="img" aria-label="star">
                ⭐
              </span>{" "}
              read customer testimonials, and{" "}
              <span role="img" aria-label="sparkles">
                ✨
              </span>{" "}
              discover how <b>INRI Paint & Wall</b> delivers flawless finishes,
              reliable service, and lasting results for every client.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
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
              href="#featured-projects"
              endIcon={
                <span role="img" aria-label="gallery">
                  🖼️
                </span>
              }
            >
              View Project Gallery
            </Button>
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

        <Box id="featured-projects">
          <SampleWork services={services} />
        </Box>

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
          {/* Abstract geometric pattern */}
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
          {/* Subtle geometric accent */}
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
