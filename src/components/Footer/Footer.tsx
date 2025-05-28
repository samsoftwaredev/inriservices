import { theme } from '@/app/theme';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const pages = [
    { text: 'Painting Services', href: '/' },
    { text: 'Cleaning Services', href: '/cleaning-services' },
    { text: 'About', href: '/about' },
    { text: 'Contact Us', href: '/contact' },
    { text: 'FAQs', href: '/frequently-asked-questions' },
  ];

  return (
    <Box
      sx={{
        my: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Image
        src="/inriLogo.png"
        alt="INRI Paint & Wall LLC Logo"
        width={80}
        height={80}
        style={{
          borderRadius: '62px',
          border: '2px solid white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
        }}
      />
      <Box sx={{ ml: { md: 2 }, mt: { xs: 2, md: 0 } }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
          {pages.map((page) => (
            <MuiLink
              key={page.href}
              component={Link}
              href={page.href}
              color="primary"
              underline="hover"
              sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}
            >
              {page.text}
            </MuiLink>
          ))}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}
        >
          © {new Date().getFullYear()} INRIservices.com. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, mt: 1 }}
        >
          Contact us:{' '}
          <a
            href="mailto:samuel@inripaintwall.com"
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            samuel@inripaintwall.com
          </a>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, mt: 1 }}
        >
          Phone:{' '}
          <a
            href="tel:+12144001397"
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            +1 (214) 400-1397
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
