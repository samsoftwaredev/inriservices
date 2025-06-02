import { theme } from "@/app/theme";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import {
  Facebook,
  Google,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

const Footer = () => {
  const pages = [
    { text: "Painting Services", href: "/" },
    { text: "Cleaning Services", href: "/cleaning-services" },
    { text: "About", href: "/about" },
    { text: "Contact Us", href: "/contact" },
    { text: "FAQs", href: "/frequently-asked-questions" },
  ];

  const backlinkData = [
    {
      name: "Google Business",
      url: "https://www.google.com/maps/place/INRI+Paint+%26+Wall/@32.9596525,-96.672329,10z/data=!3m1!4b1!4m6!3m5!1s0x42b7eb5354124873:0xfddef2cad263c247!8m2!3d32.9596524!4d-96.672329!16s%2Fg%2F11ydfvf264?hl=en&entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D",
      emoji: <Google color="error" />,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61576814137140",
      icon: <Facebook color="primary" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/inripaintwall/",
      icon: <Instagram color="secondary" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/inri-paint-wall?trk=public_post_feed-actor-name",
      icon: <LinkedIn color="primary" />,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@INRIPaintWall",
      icon: <YouTube color="error" />,
    },
    {
      name: "Yelp",
      url: "https://www.yelp.com/biz/inri-paint-and-wall-llc-garland-2",
      emoji: "",
    },
    {
      name: "Nextdoor",
      url: "https://nextdoor.com/pages/inri-paint-wall-llc-garland-tx/",
      emoji: "",
    },
  ];

  return (
    <Box
      sx={{
        my: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        textAlign: { xs: "center", md: "left" },
      }}
    >
      <Image
        src="/inriLogo.png"
        alt="INRI Paint & Wall LLC Logo"
        width={80}
        height={80}
        style={{
          borderRadius: "62px",
          border: "2px solid white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
        }}
      />
      <Box sx={{ ml: { md: 2 }, mt: { xs: 2, md: 0 }, width: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 1,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {pages.map((page) => (
            <MuiLink
              key={page.href}
              component={Link}
              href={page.href}
              color="primary"
              underline="hover"
              sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
            >
              {page.text}
            </MuiLink>
          ))}
        </Box>
        <Box>
          {backlinkData.map((item) => (
            <MuiLink
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexDirection: "row",
                color: "text.secondary",
                fontSize: { xs: "0.85rem", md: "1rem" },
                textDecoration: "none",
                gap: 1,
                mb: 1,
                pr: 3,
                "&:hover": {
                  color: theme.palette.primary.main,
                  textDecoration: "underline",
                },
              }}
            >
              {item.icon ? (
                item.icon
              ) : (
                <span style={{ fontSize: "1.2em" }}>{item.emoji}</span>
              )}
              {item.name}
            </MuiLink>
          ))}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
        >
          © {new Date().getFullYear()} INRIpaintwall.com. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, mt: 1 }}
        >
          Phone:{" "}
          <a
            href="tel:+12144001397"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
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
