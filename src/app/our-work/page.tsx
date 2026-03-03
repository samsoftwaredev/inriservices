"use client";

import { Footer, Meta, TopNavbar } from "@/components";
import { companyName } from "@/constants";
import { MetaProps } from "@/interfaces";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider as MuiSlider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { theme } from "../theme";
import { useState, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

// Project Type Definition
interface Project {
  id: string;
  title: string;
  category:
    | "Interior Painting"
    | "Exterior Painting"
    | "Cabinet Painting"
    | "Drywall Repair"
    | "Popcorn Ceiling Removal"
    | "Commercial Projects";
  beforeImage: string;
  afterImage: string;
  size: string;
  duration: string;
  scope: string;
  paintUsed?: string;
  color?: string;
  prepWork?: string;
  challenges?: string;
  results: string;
  city: string;
  testimonial?: {
    author: string;
    quote: string;
  };
  seoDescription: string;
}
// Project Data (updated from provided business/service data)
const projects: Project[] = [
  {
    id: "proj1",
    title: "Interior Painting + Drywall Repair Finish",
    category: "Interior Painting",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting1.jpeg",
    size: "Residential interior areas (walls, trim, ceilings as needed)",
    duration: "Typically 1–3 days (varies by scope)",
    scope:
      "Interior painting with drywall repair, surface prep, priming, and clean finishing for a smooth, seamless result",
    challenges:
      "Blending repairs so they don’t look patched; keeping lines crisp and the workspace protected",
    results:
      "Clean, transformative finish with seamless repair blending and professional jobsite care",
    city: "Garland / Dallas / Plano / Richardson (DFW)",
    testimonial: {
      author: "Homeowner (Review)",
      quote:
        "Professional, punctual, and detail-oriented — the work was neat and the results were transformative.",
    },
    seoDescription:
      "Professional interior painting and drywall repair services in Garland, Dallas, Plano, Richardson, Rockwall, and surrounding DFW areas. Our process focuses on proper prep, smooth repairs, and clean, consistent finishes so walls look seamless — not patched. Family-owned craftsmanship with respectful, punctual service and high-quality results homeowners can trust.",
  },
  {
    id: "proj2",
    title: "Exterior Painting + Surface Preparation",
    category: "Exterior Painting",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting2.jpeg",
    size: "Full exterior (varies by home size)",
    duration: "Typically 3–7 days (varies by scope and weather)",
    scope:
      "Exterior painting and staining with thorough prep, protection, and detailed finish work",
    prepWork:
      "Surface prep including cleaning/pressure washing (as needed), caulking, scraping, sanding, and spot repairs before coatings",
    results:
      "Improved curb appeal with a durable exterior finish designed for Texas conditions",
    city: "Garland, TX (DFW)",
    seoDescription:
      "Exterior house painting in Garland, TX and surrounding DFW cities focused on long-lasting protection and curb appeal. We handle prep the right way — cleaning, surface prep, and repairs — then apply a durable finish that helps your home stand up to Texas sun and weather. Trusted, family-owned exterior painters serving homeowners across the Dallas area.",
  },
  {
    id: "proj3",
    title: "Cabinet Painting Transformation",
    category: "Cabinet Painting",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting3.jpeg",
    size: "Kitchen cabinet set (doors, drawers, boxes as needed)",
    duration: "Typically 3–5 days (varies by prep and drying time)",
    scope:
      "Cabinet painting with degreasing, sanding, priming, and smooth finish application for a refreshed, modern look",
    prepWork:
      "Thorough degreasing + sanding + proper primer and finish steps to improve adhesion and durability",
    results:
      "High-impact kitchen refresh with a clean, modern look at a fraction of replacement cost",
    city: "Plano / Richardson / Dallas (DFW)",
    testimonial: {
      author: "Homeowner (Review)",
      quote:
        "The cabinets came out beautiful — neat work and a big transformation without the cost of replacing everything.",
    },
    seoDescription:
      "Professional cabinet painting in the Dallas, Plano, and Richardson areas with a prep-first process that delivers a smooth, durable finish. Our cabinet refinishing includes proper degreasing, sanding, and primer steps to help coatings bond correctly and look clean and modern. A budget-friendly way to transform kitchens across DFW.",
  },
  {
    id: "proj4",
    title: "Drywall Repair + Texture + Paint Prep",
    category: "Drywall Repair",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting4.jpeg",
    size: "Damaged wall/ceiling sections (small to large repairs)",
    duration: "Typically 1–2 days (varies by drying time and texture)",
    scope:
      "Drywall repair with taping, floating, sanding, texture matching, and primer-ready preparation",
    challenges:
      "Texture matching and blending so repaired areas disappear into existing surfaces",
    results:
      "Flawless finishing with repairs that blend cleanly and look seamless",
    city: "Garland / Dallas / Rockwall / McKinney (DFW)",
    seoDescription:
      "Drywall repair and finishing services in Garland, Dallas, Rockwall, McKinney, and surrounding DFW areas. We focus on clean patching, smooth sanding, and texture matching so repairs blend seamlessly with existing walls and ceilings. Detail-oriented work, respectful service, and results that look natural — not patched.",
  },
  {
    id: "proj5",
    title: "Surface Prep + Texturing for a Flawless Finish",
    category: "Drywall Repair",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting1.jpeg",
    size: "Prep and texture work for walls/ceilings (varies by room)",
    duration: "Typically 1–3 days (varies by scope and drying time)",
    scope:
      "Surface preparation and texturing to correct imperfections and create consistent wall/ceiling finishes",
    challenges:
      "Making old surfaces look uniform; avoiding visible transitions between old and new texture",
    results:
      "Consistent texture and smooth finish readiness for a professional paint result",
    city: "Dallas / Plano / Richardson (DFW)",
    seoDescription:
      "Texturing and surface prep services in Dallas, Plano, and Richardson designed to create smooth, uniform finishes before painting. We correct surface issues, repair imperfections, and texture match so your final paint job looks clean and professionally finished. Ideal for homeowners who want a true ‘finished’ look — not a quick patch.",
  },
  {
    id: "proj6",
    title: "Popcorn Ceiling Removal Prep + Finish Ready",
    category: "Popcorn Ceiling Removal",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting2.jpeg",
    size: "Ceilings (single rooms or multiple areas)",
    duration: "Typically 2–5 days (varies by area + finishing)",
    scope:
      "Popcorn ceiling removal with protection, dust control, finishing prep, and smooth-ready results",
    prepWork:
      "Full room protection and careful containment to keep the home clean during removal and finishing",
    results:
      "Updated, modern ceiling look with a cleaner, more current home aesthetic",
    city: "Garland / Dallas / Plano (DFW)",
    seoDescription:
      "Popcorn ceiling removal in Garland, Dallas, and surrounding DFW areas with a clean, protected process. We focus on proper containment, careful prep, and finish-ready results that modernize your space and improve the overall look of your home. Professional, respectful crews and high-quality finishing.",
  },
  {
    id: "proj7",
    title: "Commercial Painting + Repairs for a Clean Professional Look",
    category: "Commercial Projects",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting3.jpeg",
    size: "Commercial interiors/exteriors (varies by property)",
    duration: "Timeline based on site and scope",
    scope:
      "Commercial painting with repairs, prep, and clean finishing tailored to business needs and scheduling",
    prepWork:
      "Surface prep, patching/repairs, and protection to maintain a clean work environment",
    results:
      "A polished, professional appearance that improves how customers and tenants perceive the space",
    city: "Dallas / Richardson / Plano (DFW)",
    seoDescription:
      "Commercial painting services in Dallas, Richardson, Plano, and surrounding DFW areas. We support business owners with clean, professional work — including prep, repairs, and consistent finishes — with scheduling that respects your operations. Ideal for offices, retail spaces, and commercial properties needing a reliable painting partner.",
  },
  {
    id: "proj8",
    title: "Color Support + Interior Painting Refresh",
    category: "Interior Painting",
    beforeImage: "/beforeAfterPictures/door.png",
    afterImage: "/sampleWork/painting4.jpeg",
    size: "Room refresh (single room or multiple rooms)",
    duration: "Typically 1–2 days (varies by scope)",
    scope:
      "Interior painting refresh with prep, clean edges, and help selecting a look that fits the home",
    results:
      "A refreshed space that feels cleaner, brighter, and more modern with a professional finish",
    city: "Garland / Dallas / Plano (DFW)",
    seoDescription:
      "Interior painting services across Garland, Dallas, Plano, Richardson, and nearby DFW cities — focused on clean prep, crisp lines, and a polished finish. We help homeowners refresh spaces with professional workmanship and detail-oriented care. Great for living rooms, bedrooms, hallways, and full interior updates.",
  },
];

const location =
  "Garland, Plano, Dallas, Rockwall, Richardson, and surrounding areas";
const pageName = "Our Work Portfolio - Real Projects, Real Results";

const metaProps: MetaProps = {
  title: `${pageName} | ${companyName} | Filterable Project Gallery in ${location}, TX`,
  metaTags: [
    { httpEquiv: "content-language", content: "en" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "UTF-8", content: "" },
    {
      name: "description",
      content: `Explore our comprehensive portfolio of interior painting, exterior painting, cabinet refinishing, and drywall repair projects in ${location}, TX. Filter by project type, view before-and-after photos, read customer testimonials, and see detailed project specifications including materials, timelines, and results.`,
    },
    {
      name: "keywords",
      content: `painting project gallery, before and after photos, interior painting portfolio, exterior painting projects, cabinet refinishing examples, drywall repair gallery, ${location} painting contractors, INRI Paint & Wall portfolio, project testimonials, filterable gallery, painting transformations, commercial painting, popcorn ceiling removal`,
    },
    { name: "author", content: "INRI Paint & Wall" },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://inripaintwall.com/our-work",
    },
    {
      property: "og:title",
      content: `${pageName} | INRI Paint & Wall | Comprehensive Portfolio in ${location}`,
    },
    {
      property: "og:description",
      content: `Discover real transformations from INRI Paint & Wall's professional painting and drywall services. Browse our filterable portfolio featuring detailed before-and-after photos, project specifications, and customer testimonials from ${location}, TX.`,
    },
    {
      property: "og:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `${pageName} | INRI Paint & Wall`,
    },
    {
      name: "twitter:description",
      content: `Browse our complete portfolio of painting and drywall projects in ${location}, TX. Filter by project type, see detailed specifications, and read real customer reviews.`,
    },
    {
      name: "twitter:image",
      content: "https://inripaintwall.com/og-image.jpg",
    },
  ],
  linkTags: [
    { rel: "canonical", href: "https://inripaintwall.com/our-work" },
    { rel: "icon", href: "/favicon.ico" },
  ],
};

// Before/After Slider Component
function BeforeAfterSlider({
  beforeImage,
  afterImage,
  projectTitle,
}: {
  beforeImage: string;
  afterImage: string;
  projectTitle: string;
}) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 400,
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      {/* After Image (Background) */}
      <Box
        component="img"
        src={afterImage}
        alt={`After - ${projectTitle}`}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Before Image (Clipped) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
        }}
      >
        <Box
          component="img"
          src={beforeImage}
          alt={`Before - ${projectTitle}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Slider Line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: `${sliderValue}%`,
          width: 4,
          height: "100%",
          background: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          "&:before": {
            content: '"◀▶"',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 2,
            fontSize: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          },
        }}
      />

      {/* Labels */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: "0.85rem",
        }}
      >
        BEFORE
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: "0.85rem",
        }}
      >
        AFTER
      </Box>

      {/* Slider Control */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: 400,
        }}
      >
        <MuiSlider
          value={sliderValue}
          onChange={(_, value) => setSliderValue(value as number)}
          min={0}
          max={100}
          sx={{
            color: "#fff",
            "& .MuiSlider-thumb": {
              width: 24,
              height: 24,
            },
          }}
        />
      </Box>
    </Box>
  );
}

// Project Detail Modal
function ProjectDetailModal({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {project.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Before/After Slider */}
        <BeforeAfterSlider
          beforeImage={project.beforeImage}
          afterImage={project.afterImage}
          projectTitle={project.title}
        />

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                background: theme.palette.info.main,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Location
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {project.city}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                background: theme.palette.info.main,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Size
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {project.size}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                background: theme.palette.info.main,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Duration
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {project.duration}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                background: theme.palette.info.main,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Category
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {project.category}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Project Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            color={theme.palette.primary.main}
          >
            Project Details
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <b>Scope:</b> {project.scope}
                  </Typography>
                }
              />
            </ListItem>
            {project.paintUsed && (
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <b>Materials:</b> {project.paintUsed}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {project.color && (
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <b>Color:</b> {project.color}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {project.prepWork && (
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <b>Prep Work:</b> {project.prepWork}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {project.challenges && (
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <b>Challenges:</b> {project.challenges}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <b>Results:</b> {project.results}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>

        {/* SEO Description */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            background: theme.palette.info.main,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mb: 0 }}
          >
            {project.seoDescription}
          </Typography>
        </Box>

        {/* Testimonial */}
        {project.testimonial && (
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`,
              borderRadius: 2,
              color: "#fff",
              position: "relative",
              mb: 2,
            }}
          >
            <FormatQuoteIcon
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                opacity: 0.3,
                fontSize: "3rem",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontStyle: "italic",
                mb: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              "{project.testimonial.quote}"
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ position: "relative", zIndex: 1 }}
            >
              — {project.testimonial.author}
            </Typography>
          </Box>
        )}

        {/* CTA Button */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            href="/get-painting-estimate-in-minutes"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: 3,
              background: theme.palette.primary.main,
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                background: theme.palette.warning.main,
              },
            }}
          >
            Request Similar Project
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function OurWorkPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    "All Projects",
    "Interior Painting",
    "Exterior Painting",
    "Cabinet Painting",
    "Drywall Repair",
    "Popcorn Ceiling Removal",
    "Commercial Projects",
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Projects") {
      return projects;
    }
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // JSON-LD Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "INRI Paint & Wall",
    image: "https://inripaintwall.com/og-image.jpg",
    "@id": "https://inripaintwall.com",
    url: "https://inripaintwall.com/our-work",
    telephone: "(469) 431-5757",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Garland",
      addressRegion: "TX",
      postalCode: "75040",
      addressCountry: "US",
    },
    areaServed: [
      "Garland, TX",
      "Plano, TX",
      "Dallas, TX",
      "Richardson, TX",
      "Rockwall, TX",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Painting and Drywall Services",
      itemListElement: projects.map((project) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: project.title,
          description: project.seoDescription,
          image: project.afterImage,
          areaServed: project.city,
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "47",
    },
  };

  return (
    <>
      <Meta {...metaProps} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
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
              component="h1"
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
              🖼️ Our Work Portfolio - Real Projects, Real Results
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
              ✨ Filter by Project Type • View Before & After • Read
              Testimonials
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
              Browse our comprehensive portfolio of painting and drywall
              projects across{" "}
              <b>Dallas, Garland, Plano, Richardson, and Rockwall</b>.
              <br />
              <span role="img" aria-label="filter">
                🔍
              </span>{" "}
              Filter by project type,{" "}
              <span role="img" aria-label="slider">
                ↔️
              </span>{" "}
              interact with before-and-after sliders,{" "}
              <span role="img" aria-label="details">
                📋
              </span>{" "}
              view detailed project specifications, and{" "}
              <span role="img" aria-label="star">
                ⭐
              </span>{" "}
              read customer testimonials from real homeowners who trusted{" "}
              <b>INRI Paint & Wall</b>.
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
              href="#project-gallery"
            >
              Explore Project Gallery
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

        {/* Filter Buttons */}
        <Box
          id="project-gallery"
          component="section"
          sx={{ mb: 6, textAlign: "center" }}
        >
          <Typography
            variant="h2"
            fontSize={{ xs: "1.8rem", md: "2.3rem" }}
            fontWeight={800}
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            🔍 Filter Projects by Type
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              mb: 2,
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    selectedCategory === category
                      ? theme.palette.primary.main
                      : theme.palette.info.main,
                  color:
                    selectedCategory === category ? "#fff" : "text.primary",
                  border:
                    selectedCategory === category
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                  "&:hover": {
                    background:
                      selectedCategory === category
                        ? theme.palette.primary.main
                        : theme.palette.warning.main,
                    color: "#fff",
                    transform: "translateY(-2px) scale(1.05)",
                  },
                }}
              />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Showing <b>{filteredProjects.length}</b>{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </Typography>
        </Box>

        {/* Project Gallery */}
        <Box component="section" sx={{ mb: 10 }}>
          <Grid container spacing={4}>
            {filteredProjects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: 3,
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 8,
                      transform: "translateY(-8px) scale(1.02)",
                    },
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "75%",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={project.afterImage}
                      alt={`${project.title} - ${project.city}`}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                    <Chip
                      label={project.category}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: theme.palette.primary.main,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>

                  {/* Project Info */}
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      📍 {project.city} • ⏱️ {project.duration} • 📏{" "}
                      {project.size}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {project.results.substring(0, 80)}...
                    </Typography>

                    {project.testimonial && (
                      <Box
                        sx={{
                          p: 2,
                          background: theme.palette.info.main,
                          borderRadius: 2,
                          borderLeft: `4px solid ${theme.palette.warning.main}`,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          "{project.testimonial.quote.substring(0, 60)}..."
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          fontWeight={700}
                          sx={{ mt: 0.5 }}
                        >
                          — {project.testimonial.author}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: "none",
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          background: theme.palette.primary.main,
                          color: "#fff",
                        },
                      }}
                    >
                      View Full Project Details
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us Section */}
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
              position: "relative",
            }}
          >
            ⭐ Why Homeowners Choose INRI Paint & Wall
          </Typography>
          <Typography
            variant="subtitle1"
            color="rgba(255,255,255,0.85)"
            sx={{
              mb: 4,
              maxWidth: 600,
              zIndex: 1,
              position: "relative",
            }}
          >
            Every project showcases our commitment to quality, transparency, and
            customer satisfaction.
          </Typography>
          <Grid container spacing={3} sx={{ zIndex: 1, position: "relative" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                  transition: "all 0.2s",
                  borderRadius: 3,
                  p: 2,
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box sx={{ fontSize: "2rem", lineHeight: 1, mr: 1 }}>🌟</Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#fff" }}
                  >
                    Proven Track Record
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Dozens of <b>5-star reviews</b> from satisfied clients
                    across the DFW area
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
                  transition: "all 0.2s",
                  borderRadius: 3,
                  p: 2,
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box sx={{ fontSize: "2rem", lineHeight: 1, mr: 1 }}>🛠️</Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#fff" }}
                  >
                    Complete Expertise
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Skilled in{" "}
                    <b>painting, drywall, cabinets, and ceiling textures</b>
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
                  transition: "all 0.2s",
                  borderRadius: 3,
                  p: 2,
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box sx={{ fontSize: "2rem", lineHeight: 1, mr: 1 }}>⏱️</Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#fff" }}
                  >
                    Transparent & Reliable
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    <b>Clear estimates</b>, honest communication,{" "}
                    <b>on-time completion</b>
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
                  transition: "all 0.2s",
                  borderRadius: 3,
                  p: 2,
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box sx={{ fontSize: "2rem", lineHeight: 1, mr: 1 }}>🛡️</Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#fff" }}
                  >
                    Licensed & Insured
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.85)">
                    Fully <b>licensed</b>, <b>insured</b>, with{" "}
                    <b>warranty-backed work</b>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom CTA Section */}
        <Box
          component="section"
          sx={{
            py: 10,
            px: { xs: 3, md: 8 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`,
            borderRadius: 6,
            boxShadow: 8,
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.2) 60%, transparent 100%)",
              borderRadius: "50%",
              filter: "blur(20px)",
            }}
          />
          <Typography
            variant="h2"
            fontSize={{ xs: "2rem", md: "2.8rem" }}
            fontWeight={900}
            gutterBottom
            sx={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            🎨 Ready to Transform Your Home?
          </Typography>
          <Typography
            variant="h6"
            fontSize={{ xs: "1.1rem", md: "1.3rem" }}
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: "auto",
              color: "rgba(255,255,255,0.95)",
              position: "relative",
              zIndex: 1,
              lineHeight: 1.6,
            }}
          >
            Whether you need <b>interior painting</b>,{" "}
            <b>exterior repainting</b>, <b>cabinet refinishing</b>, or{" "}
            <b>drywall repair</b> in the DFW area, we deliver real results just
            like the projects you've seen above.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/get-painting-estimate-in-minutes"
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 800,
              borderRadius: 4,
              background: "#fff",
              color: theme.palette.primary.main,
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              position: "relative",
              zIndex: 1,
              transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
              "&:hover": {
                background: "#fff",
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
              },
            }}
          >
            Get Your Free Estimate Today →
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              color: "rgba(255,255,255,0.85)",
              position: "relative",
              zIndex: 1,
            }}
          >
            📞 Or call us now: <b>(469) 431-5757</b>
          </Typography>
        </Box>
      </Container>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <Footer />
    </>
  );
}
