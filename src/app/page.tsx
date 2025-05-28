import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { theme } from './theme';
import { ThemeRegistry } from './ThemeRegistry';
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
} from '@/components';

const cards = [
  {
    icon: '🛡️',
    iconColor: 'primary.main',
    title: 'Trust and Credibility',
    description:
      'We build trust with transparency and deliver credible results you can rely on.',
  },
  {
    icon: '💰',
    iconColor: 'secondary.main',
    title: 'Clear Pricing, No Hidden Fees',
    description:
      'Our pricing is straightforward, with no surprises or hidden costs.',
  },
  {
    icon: '🧹',
    iconColor: 'success.main',
    title: 'Professional Workers',
    description:
      'Our team is composed of skilled professionals who prioritize cleanliness and quality.',
  },
];

const pricingData = [
  {
    imageSrc: '/painterOrange.png',
    title: 'Small PATCH area',
    subTitle: '(1-5 inches)',
    description: ['Quick fixes for minor damage'],
    price: '$50 - $100',
    image: '/cartoon-painter-1.svg',
  },
  {
    imageSrc: '/plumber.png',
    title: 'Medium PATCH area',
    subTitle: '(6-12 inches)',
    description: ['For moderate repairs that need precision'],
    price: '$150 - $250',
    image: '/cartoon-painter-2.svg',
  },
  {
    imageSrc: '/painter.png',
    title: 'Large PATCH area',
    subTitle: '(13+ inches)',
    description: ['Extensive repairs requiring more materials and time'],
    price: '$300+',
    image: '/cartoon-painter-3.svg',
  },
];

const testimonials = [
  {
    name: 'Sarah L.',
    image: '/avatars/avatar1.png',
    text: "I had a huge hole in my drywall after a plumbing issue—these guys patched it up seamlessly and even repainted the whole wall. You can't tell anything ever happened!",
    rating: 5,
  },
  {
    name: 'James M.',
    image: '/avatars/avatar2.png',
    text: 'We hired them to repaint our living room and fix a few nail pops. Not only were they super tidy, but they finished ahead of schedule. Our walls look brand new!',
    rating: 5,
  },
  {
    name: 'Monica T.',
    image: '/avatars/avatar3.png',
    text: 'Excellent job! I appreciated how they matched the existing paint perfectly after repairing a water-damaged area. The team was respectful and professional.',
    rating: 4.5,
  },
  {
    name: 'Carlos G.',
    image: '/avatars/avatar4.png',
    text: 'They helped repaint and touch up after we moved out of our rental. The landlord was so impressed we got our full deposit back. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Amy K.',
    image: '/avatars/avatar5.png',
    text: 'Fast, clean, and honest pricing. They repaired a crack running across our ceiling and you’d never know it was there. Super happy with the results.',
    rating: 4.5,
  },
];

const services = [
  {
    title: 'Trim Repair and Installation',
    description:
      "Enhance your home's aesthetics with professional trim repair and installation services.",
    emoji: '🪚',
  },
  {
    title: 'Cabinet Painting',
    description:
      'Revitalize your kitchen or bathroom with a fresh coat of paint on your cabinets.',
    emoji: '🎨',
  },
  {
    title: 'ReTexture Walls',
    description:
      'Transform your walls with modern textures for a stylish and updated look.',
    emoji: '🖌️',
  },
  {
    title: 'Interior Painting',
    description:
      'Refresh your living spaces with high-quality interior painting services.',
    emoji: '🏠',
  },
  {
    title: 'Exterior Painting',
    description:
      "Boost your home's curb appeal with durable and vibrant exterior painting.",
    emoji: '🌳',
  },
  {
    title: 'Wallpaper Removal',
    description:
      'Remove outdated wallpaper to prepare your walls for a new look.',
    emoji: '🧹',
  },
  {
    title: 'Popcorn Ceiling Removal',
    description:
      'Modernize your ceilings by removing old popcorn textures for a smooth finish.',
    emoji: '🪜',
  },
  {
    title: 'Deck Staining and Sealing',
    description:
      'Protect and beautify your deck with expert staining and sealing services.',
    emoji: '🌞',
  },
  {
    title: 'Drywall Installation',
    description:
      'Ensure a flawless finish with professional drywall installation and repair.',
    emoji: '🔧',
  },
  {
    title: 'Pressure Washing',
    description:
      "Clean and restore your home's exterior surfaces with powerful pressure washing.",
    emoji: '💦',
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
        <TestimonialSection testimonials={testimonials} />
        <SampleWork services={services} />
        <PatchSpecial />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <PromoBadge />
        </Box>
        <HoursOperation />
        <MapServices />
        {/* Discount & Call to Action Section */}
        <Box
          sx={{
            my: { xs: 4, md: 6 },
            textAlign: 'center',
            p: { xs: 2, md: 3 },
            backgroundColor: theme.palette.info.main,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Special Introductory Offer!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '1rem', md: '1.2rem' },
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
              fontSize: { xs: '0.8rem', md: '1rem' },
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
              backgroundColor: 'warning.main',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: 'warning.dark',
              },
            }}
          >
            Schedule Your Service Today!
          </Button>
        </Box>
        <SocialProof />
        <Footer />
      </Container>
    </ThemeRegistry>
  );
}
