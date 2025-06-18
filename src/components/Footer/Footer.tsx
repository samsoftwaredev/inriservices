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
    { text: "Garland Painter", href: "/painting-room-in-garland-painter" },
    { text: "About", href: "/about" },
    { text: "Contact Us", href: "/contact" },
    { text: "FAQs", href: "/frequently-asked-questions" },
    { text: "Interior Estimate", href: "/interior-checklist" },
    { text: "Exterior Estimate", href: "/exterior-checklist" },
    { text: "Our Services", href: "/service" },
    { text: "Our Previews Work", href: "/previous-work" },
  ];

  const backlinkData = [
    {
      name: "Google Maps",
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
      emoji: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
        >
          <rect width="512" height="512" style={{ fill: "#d32323" }} />
          <path
            d="M248.32,74.24c-1.28-4.69-5.12-8.11-10.24-9.81-16.21-4.27-79.36,13.65-90.88,26-3.84,3.84-5.12,9-3.84,13.23,1.71,3.84,79.79,128.43,79.79,128.43,11.52,18.77,20.9,16.21,23.89,14.93,3-.85,12.37-3.84,11.52-26C256.85,195,249.17,79.79,248.32,74.24ZM214.61,308.05c6.4-1.7,10.67-7.68,11.1-14.93.42-7.68-3.42-14.51-9.82-17.07L198,268.8c-61-25.6-63.57-26.45-66.56-26.45-4.69-.43-9,2.13-11.94,6.82-6,9.82-8.54,41.39-6.4,62.3.85,6.82,2.13,12.8,3.84,16.21,2.56,4.69,6.4,7.68,11.09,7.68,3,0,4.69-.43,61.44-18.77Zm32,23.47c-6.82-3-14.5-1.28-18.77,4.27l-12.37,14.93c-42.67,51.2-44.38,53.33-45.66,56.32a12.66,12.66,0,0,0-.85,5.55,11.5,11.5,0,0,0,3.41,7.68c9.82,11.94,57.18,29.86,72.54,27.3A13.06,13.06,0,0,0,255.57,439c.86-3,1.28-5.12,1.28-65.28V346.45C257.71,340.05,253.44,334.08,246.61,331.52Zm148.48,12c-2.56-1.71-4.26-2.56-61-21.34,0,0-24.75-8.53-25.17-8.53-6-2.56-12.8-.43-17.5,5.55s-5.54,13.65-1.7,19.62l9.81,16.64c33.71,55.47,36.27,59.31,38.4,61.44,3.84,3,8.53,3.42,13.65,1.28,14.51-6,45.66-46.08,47.79-61.86C400.21,351.15,398.93,346.45,395.09,343.47Zm-91.3-63.15c9-1.71,82.34-19.2,88.32-23.47,3.84-2.56,6-7.25,5.54-12.8v-.42c-1.7-16.22-29.44-58-43.09-64.86-4.69-2.13-9.81-2.13-13.65.43-2.56,1.71-4.27,4.27-38.83,52.05L286.29,253c-4.26,5.12-4.26,12.38,0,18.78C290.56,278.61,294.83,282,303.79,280.32Z"
            style={{ fill: "#fff" }}
          />
        </svg>
      ),
    },
    {
      name: "Nextdoor",
      url: "https://nextdoor.com/pages/inri-paint-wall-llc-garland-tx/",
      emoji: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="136"
          height="24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M78.066 7.053c2.132 0 3.767 1.078 4.447 2.065V1.243a.388.388 0 01.235-.356.378.378 0 01.146-.03h3.47a.378.378 0 01.352.238.388.388 0 01.028.148v21.19a.386.386 0 01-.38.384h-3.355a.495.495 0 01-.496-.5v-1.228c-.678.988-2.315 2.068-4.447 2.068-4.107 0-7.257-3.68-7.257-8.057 0-4.379 3.15-8.047 7.257-8.047zM75.07 15.1c0 2.405 1.575 4.193 3.892 4.193 2.319 0 3.891-1.788 3.891-4.193 0-2.406-1.574-4.194-3.891-4.194S75.07 12.694 75.07 15.1zm-10.232 1.48v-5.104c0-.102.04-.2.112-.272a.38.38 0 01.269-.113h2.972a.38.38 0 00.38-.383V7.775a.386.386 0 00-.38-.384h-2.972a.38.38 0 01-.38-.384v-3.52a.387.387 0 00-.382-.383h-3.47a.378.378 0 00-.352.238.388.388 0 00-.028.147c0 3.674-.095 3.888-2.625 3.9a.494.494 0 00-.349.146.503.503 0 00-.146.351v2.707a.5.5 0 00.306.46.49.49 0 00.189.037h2.244a.38.38 0 01.38.385v5.936c0 3.771 2.626 5.582 5.9 5.582a9.386 9.386 0 002.398-.257.38.38 0 00.288-.372v-2.927a.386.386 0 00-.304-.374.376.376 0 00-.172.004 5.345 5.345 0 01-1.253.132c-1.822 0-2.625-.739-2.625-2.62zm-41.12-1.48c0-4.564 3.43-8.047 8.125-8.047 4.048 0 7.597 2.59 7.604 7.594 0 .296 0 .634-.032 1.088a.389.389 0 01-.381.362h-11.2c.247 2.066 2.067 3.206 4.108 3.206 1.733 0 3.037-.734 3.773-1.651a.375.375 0 01.51-.063l2.539 1.885a.383.383 0 01.145.403.385.385 0 01-.064.136c-1.453 1.892-3.862 3.144-6.94 3.144-4.603 0-8.186-3.186-8.186-8.057zm8.004-4.559c-1.58 0-3.339.797-3.74 2.683h7.23c-.37-1.826-1.91-2.683-3.49-2.683zm19.793-3.149h4.08a.378.378 0 01.338.203.387.387 0 01-.02.395l-4.704 7.043a.385.385 0 000 .439l4.803 6.728a.386.386 0 01-.31.609h-4.08a.378.378 0 01-.309-.162l-3.111-4.402-3.11 4.402a.382.382 0 01-.309.162h-4.112a.378.378 0 01-.34-.21.387.387 0 01.03-.399l4.81-6.728a.39.39 0 000-.44L40.465 7.99a.386.386 0 01.12-.543.378.378 0 01.196-.055h4.046a.377.377 0 01.317.171l3.027 4.547L51.2 7.563a.381.381 0 01.316-.171zm81.554-.185c-1.729 0-3.304 1.14-3.83 2.652V7.776a.382.382 0 00-.381-.384h-3.468a.38.38 0 00-.382.384v14.647a.384.384 0 00.382.384h3.468a.382.382 0 00.381-.384v-6.986c0-2.528 1.33-4.1 3.337-4.1.486 0 .969.065 1.437.193a.375.375 0 00.438-.2.396.396 0 00.04-.168V7.689a.384.384 0 00-.308-.377 5.103 5.103 0 00-1.114-.105zM88.846 15.1c0-4.502 3.643-8.047 8.122-8.047 4.478 0 8.123 3.536 8.123 8.047 0 4.51-3.643 8.057-8.123 8.057-4.48 0-8.123-3.556-8.123-8.057zm4.261 0c0 2.374 1.638 4.1 3.861 4.1 2.224 0 3.829-1.726 3.829-4.1 0-2.375-1.605-4.101-3.829-4.101s-3.86 1.726-3.86 4.1zm21.679-8.047c-4.478 0-8.123 3.545-8.123 8.047 0 4.501 3.645 8.057 8.123 8.057s8.123-3.547 8.123-8.057-3.645-8.047-8.123-8.047zm0 12.147c-2.224 0-3.861-1.726-3.861-4.1 0-2.375 1.637-4.101 3.861-4.101s3.83 1.726 3.83 4.1c0 2.375-1.606 4.101-3.83 4.101zM7.193 10.198c1.36-2.016 3.786-3.332 6.63-3.332 4.4 0 7.796 3.15 7.796 7.157v8.4a.385.385 0 01-.38.384h-3.5a.38.38 0 01-.38-.384v-7.815c0-1.737-1.326-3.707-3.536-3.707-2.316 0-3.536 1.97-3.536 3.707v7.813a.387.387 0 01-.383.384H6.406a.377.377 0 01-.352-.235.385.385 0 01-.029-.147V14.86a.505.505 0 00-.376-.482c-3.077-.843-4.21-3.197-4.289-6.567a.387.387 0 01.235-.361.378.378 0 01.148-.03h2.76v.02h.835a.384.384 0 01.381.37c.04 1.378.314 2.118.964 2.512a.378.378 0 00.51-.125z"
            fill="#8ED500"
          ></path>
        </svg>
      ),
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
        textAlign: "center",
      }}
    >
      <Box sx={{ ml: { md: 2 }, mt: { xs: 2, md: 0 }, width: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 1,
            justifyContent: "center",
          }}
        >
          {pages.map((page) => (
            <MuiLink
              key={page.href}
              component={Link}
              href={page.href}
              color="primary"
              underline="hover"
              sx={{
                fontSize: { xs: "0.85rem", md: "1rem" },
                borderRight: "1px solid",
                pr: 2,
                lastChild: { borderRight: "none" },
              }}
            >
              {page.text}
            </MuiLink>
          ))}
        </Box>
        <Box sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
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
              <Typography display="none">{item.name}</Typography>
            </MuiLink>
          ))}
        </Box>
        <Image
          src="/inriLogo.png"
          alt="INRI Paint & Wall Logo"
          width={80}
          height={80}
          style={{
            borderRadius: "62px",
            border: "2px solid white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
          }}
        />
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
