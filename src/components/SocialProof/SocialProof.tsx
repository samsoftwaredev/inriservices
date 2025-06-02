import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Box,
} from '@mui/material';
import {
  Language,
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';

const backlinkData = [
  // Local Directories
  {
    category: 'Local Directories',
    links: [
      // {
      //   name: 'Google Business',
      //   url: 'https://www.google.com/business/',
      //   emoji: '📍',
      // },
      {
        name: 'Yelp',
        url: 'https://www.yelp.com/biz/inri-paint-and-wall-llc-garland-2',
        emoji: '⭐',
      },
      // { name: 'HomeAdvisor', url: 'https://www.homeadvisor.com/', emoji: '🔨' },
      // { name: 'Thumbtack', url: 'https://www.thumbtack.com/', emoji: '📌' },
      // { name: 'Houzz', url: 'https://www.houzz.com/', emoji: '🏡' },
      {
        name: 'Nextdoor',
        url: 'https://nextdoor.com/pages/inri-paint-wall-llc-garland-tx/',
        emoji: '👋',
      },
    ],
  },
  // Niche Directories
  // {
  //   category: 'Contractor Directories',
  //   links: [
  //     {
  //       name: 'Paint Contractor Locator',
  //       url: 'https://www.paintcontractorlocator.com/',
  //       emoji: '🎨',
  //     },
  //     {
  //       name: 'Painter Choice',
  //       url: 'https://www.painterchoice.com/',
  //       emoji: '🖌️',
  //     },
  //     {
  //       name: 'ConstructConnect',
  //       url: 'https://www.constructconnect.com/',
  //       emoji: '🏗️',
  //     },
  //     { name: 'BuildZoom', url: 'https://www.buildzoom.com/', emoji: '📈' },
  //     { name: 'Pro Referral', url: 'https://proreferral.com/', emoji: '🛠️' },
  //   ],
  // },
  // Associations
  // {
  //   category: 'Industry Associations',
  //   links: [
  //     { name: 'PDCA', url: 'https://www.pdca.org/', emoji: '🏢' },
  //     { name: 'NARI', url: 'https://www.nari.org/', emoji: '🧰' },
  //     {
  //       name: 'Dallas Builders Association',
  //       url: 'https://dallasbuilders.org/',
  //       emoji: '🧱',
  //     },
  //   ],
  // },
  // Social Media
  {
    category: 'Social Media Profiles',
    links: [
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/profile.php?id=61576814137140',
        icon: <Facebook color="primary" />,
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/inripaintwall/',
        icon: <Instagram color="secondary" />,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/inri-paint-wall?trk=public_post_feed-actor-name',
        icon: <LinkedIn color="primary" />,
      },
      {
        name: 'YouTube',
        url: 'https://www.youtube.com/@INRIPaintWall',
        icon: <YouTube color="error" />,
      },
    ],
  },
];

const SocialProof = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 6, display: 'none' }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        🌐 INRI Paint & Wall LLC is Everywhere!
      </Typography>

      {backlinkData.map((section) => (
        <Box key={section.category} sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom color="primary">
            {section.category}
          </Typography>
          <Grid container spacing={3}>
            {section.links.map((link) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={link.name}>
                <Card elevation={2} sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardActionArea
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardContent
                      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                      <Avatar sx={{ backgroundColor: '#eee', color: 'white' }}>
                        {'icon' in link ? (
                          link.icon
                        ) : 'emoji' in link ? (
                          link.emoji
                        ) : (
                          <Language />
                        )}
                      </Avatar>
                      <Typography variant="body1">{link.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default SocialProof;
