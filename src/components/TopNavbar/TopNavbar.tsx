"use client";

import { theme } from "@/app/theme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";

const TopNavbar = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      component="header" // Semantic HTML for SEO
      sx={{
        backgroundColor: theme.palette.warning.main,
        height: isMobile ? "48px" : "50px",
      }}
    >
      <Toolbar sx={{ minHeight: isMobile ? "48px" : "56px" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {isMobile ? <MenuIcon /> : null}
        </IconButton>
        <Typography
          color="white"
          variant="h1"
          href="/"
          component="a"
          sx={{
            marginRight: { xs: "35px", md: "inherit" },
            display: { xs: "flex", md: "inherit" },
            textAlign: { xs: "center", md: "inherit" },
            justifyContent: { xs: "center", md: "inherit" },
            width: { xs: "100%", md: "inherit" },
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: "bold",
          }}
        >
          <Image
            src="/inriServices.png"
            alt="INRI Services Logo"
            priority
            width={80}
            height={80}
            style={{
              marginTop: "10px",
              borderRadius: "62px",
              border: "2px solid white",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
            }} // Added styles for the logo
          />
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {!isMobile && (
          <>
            <Typography
              color="white"
              variant="body1"
              component="p"
              sx={{ mr: 2 }}
            >
              Company located in Dallas area
            </Typography>
            <Typography
              href="/contact"
              variant="h6"
              component="a"
              color="white"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Get Your Free Quote Today!
            </Typography>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
