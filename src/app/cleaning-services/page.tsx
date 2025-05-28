import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { theme } from '../theme';
import { ThemeRegistry } from '../ThemeRegistry';
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
    imageSrc: '/cleaning/countertop.png',
    title: 'Light Cleaning',
    subTitle: '(Studio or Small Area)',
    description: ['Basic dusting, vacuuming, and surface wipe-downs'],
    price: '$75 - $100',
  },
  {
    imageSrc: '/cleaning/rug.png',
    title: 'Standard Cleaning',
    subTitle: '(1–2 Bedroom Home)',
    description: [
      'Includes kitchen, bathrooms, vacuuming, mopping, and surface disinfecting',
    ],
    price: '$120 - $180',
  },
  {
    imageSrc: '/cleaning/sofa.png',
    title: 'Deep Cleaning',
    subTitle: '(2+ Bedroom Home)',
    description: [
      'Baseboards, inside appliances, detailed sanitizing of all surfaces and rooms',
    ],
    price: '$200+',
  },
];

const testimonials = [
  {
    name: 'Rebecca S.',
    image: '/avatars/avatar6.png',
    text: 'The deep cleaning service was incredible! They scrubbed everything from the baseboards to the ceiling fans. My house feels brand new. Will definitely book again!',
    rating: 5,
  },
  {
    name: 'David N.',
    image: '/avatars/avatar7.png',
    text: 'I hired them for a move-out clean and they did such a thorough job—even the property manager complimented it. Worth every penny.',
    rating: 5,
  },
  {
    name: 'Lucia M.',
    image: '/avatars/avatar8.png',
    text: 'I’ve used a lot of cleaners over the years, but these folks are on another level. Professional, punctual, and they left my kitchen sparkling.',
    rating: 4.5,
  },
  {
    name: 'Anthony J.',
    image: '/avatars/avatar9.png',
    text: 'They came in for a last-minute deep clean before a family event and absolutely crushed it. Floors, carpets, windows—everything spotless.',
    rating: 5,
  },
  {
    name: 'María C.',
    image: '/avatars/avatar10.png',
    text: 'Super impressed by their attention to detail. They even cleaned under the furniture and organized the pantry without me asking. Highly recommend!',
    rating: 5,
  },
];

const services = [
  {
    title: 'Deep Cleaning',
    description:
      'A full-home refresh that tackles dirt, dust, and grime—even in the hardest-to-reach places. Perfect for move-ins, move-outs, or seasonal resets.',
    emoji: '✨',
  },
  {
    title: 'Standard House Cleaning',
    description:
      'Weekly, bi-weekly, or monthly service to keep your home looking, feeling, and smelling fresh all year round.',
    emoji: '🧽',
  },
  {
    title: 'Carpet & Rug Cleaning',
    description:
      'We remove stains, allergens, and pet odors using safe, professional-grade techniques that protect your carpet fibers.',
    emoji: '🛋️',
  },
  {
    title: 'Bathroom & Kitchen Sanitization',
    description:
      'High-touch surfaces, tiles, sinks, tubs, and appliances disinfected with industry-approved cleaners.',
    emoji: '🚿',
  },
  {
    title: 'Window, Baseboard & Detail Cleaning',
    description:
      'We go beyond the basics—cleaning trim, vents, baseboards, window sills, and behind furniture.',
    emoji: '🪟',
  },
];

export default function Home() {
  return (
    <ThemeRegistry>
      <Analytics />
      <Meta />
      <TopNavbar />
      <Container maxWidth="md">
        <TrustBadges
          title="Cleaning Services You Can Trust"
          description="Professional Residential Cleaning Services in Garland, TX"
        />
        <Hero heroImage="/cleaning/hero.png" services="Professional Cleaning" />
        <ObjectionsBusters
          title="Now Offering Expert Home Cleaning Services – Because Clean Walls Deserve Clean Spaces"
          description="At INRI Paint & Wall, we’ve mastered the art of revitalizing homes with precision painting and expert drywall repairs. Now, we're bringing the same dedication and detail to residential cleaning services. Whether it’s your apartment, condo, or house, we make your home feel brand new—top to bottom."
          cards={cards}
        />
        <Pricing pricingData={pricingData} />
        <TestimonialSection testimonials={testimonials} />
        <SampleWork services={services} hideCarousel />
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
