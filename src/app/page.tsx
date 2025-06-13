import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { theme } from "./theme";
import { ThemeRegistry } from "./ThemeRegistry";
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
  SampleWork,
  SocialProof,
  PromoBadge,
  Pricing,
  PatchSpecial,
} from "@/components";

const cards = [
  {
    icon: "🛡️",
    iconColor: "primary.main",
    title: "Trust and Credibility",
    description:
      "We build trust with transparency and deliver credible results you can rely on.",
  },
  {
    icon: "💰",
    iconColor: "secondary.main",
    title: "Clear Pricing, No Hidden Fees",
    description:
      "Our pricing is straightforward, with no surprises or hidden costs.",
  },
  {
    icon: "🧹",
    iconColor: "success.main",
    title: "Professional Workers",
    description:
      "Our team is composed of skilled professionals who prioritize cleanliness and quality.",
  },
];

const pricingData = [
  {
    imageSrc: "/painterOrange.png",
    title: "Small PATCH area",
    subTitle: "(1-5 inches)",
    description: ["Quick fixes for minor damage"],
    price: "$50 - $100",
    image: "/cartoon-painter-1.svg",
  },
  {
    imageSrc: "/plumber.png",
    title: "Medium PATCH area",
    subTitle: "(6-12 inches)",
    description: ["For moderate repairs that need precision"],
    price: "$150 - $250",
    image: "/cartoon-painter-2.svg",
  },
  {
    imageSrc: "/painter.png",
    title: "Large PATCH area",
    subTitle: "(13+ inches)",
    description: ["Extensive repairs requiring more materials and time"],
    price: "$300+",
    image: "/cartoon-painter-3.svg",
  },
];

const testimonials = [
  {
    name: "Leslie Z.",
    image: "/reviewers/leslie.png",
    text: "I can't say enough good things about INRI Paint & Wall LLC! From the moment I called them, I felt like they really cared. They painted my kitchen cabinets in a beautiful, clean royal blue that just transformed the whole space. The job was neat, fast, and super professional. I also had some drywall repair done in my hallway and the family room wow!!, I couldn't even tell there was ever damage! I feel like my home has a brand new vibe now. So if you need a professional painter in Garland, don't even think twice! The quality of their drywall repair work is top-notch. It's so hard to find people that truly care and go the extra mile.",
    rating: 5,
  },
  {
    name: "Samuel R.",
    image: "/reviewers/samuel.png",
    text: "INRI Paint & Wall did an amazing job on my new home. They painted and repaired all my drywalls, and the results were better than I expected. The team was friendly, and always on time. I really appreciated how they explained everything and made the process feel easy. Their attention to detail is next level. They also offered me a deep cleaning service and carpet cleaning. My house looks brand new!! Definitely recommend it! ⭐️🔥",
    rating: 5,
  },
];

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

export default function Home() {
  return (
    <ThemeRegistry>
      <Analytics />
      <Meta />
      <TopNavbar />
      <Container maxWidth="md">
        <TrustBadges />
        <Hero />
        <ObjectionsBusters cards={cards} />
        <Pricing pricingData={pricingData} />
        <PatchSpecial />
        <TestimonialSection testimonials={testimonials} />
        <SampleWork services={services} />
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
        <SocialProof />
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <PromoBadge />
        </Box>
        <Footer />
      </Container>
    </ThemeRegistry>
  );
}
