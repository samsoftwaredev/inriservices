"use client";

import { theme } from "@/app/theme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Typography,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const TopNavbar = () => {
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="static"
        component="header"
        sx={{
          mb: 4,
          backgroundColor: theme.palette.warning.main,
          height: "48px", // Default for mobile
          [theme.breakpoints.up("md")]: {
            height: "50px", // Adjust for desktop
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: "48px", // Default for mobile
            [theme.breakpoints.up("md")]: {
              minHeight: "56px", // Adjust for desktop
            },
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="white"
            variant="h2"
            href="/"
            component="a"
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
              fontSize: "1.25rem", // Default for mobile
              fontWeight: "bold",
              marginRight: "50px",
              [theme.breakpoints.up("md")]: {
                marginRight: "inherit",
                display: "inherit",
                textAlign: "inherit",
                justifyContent: "inherit",
                width: "inherit",
                fontSize: "1.5rem", // Adjust for desktop
              },
            }}
          >
            <Image
              src="/inriLogo.png"
              alt="INRI Paint & Wall LLC Logo"
              priority
              width={120}
              height={120}
              style={{
                marginTop: "50px",
                borderRadius: "62px",
                border: "2px solid white",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
              }}
            />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isDesktop && (
            <>
              <Typography
                color="white"
                variant="body1"
                component="p"
                sx={{ mr: 2 }}
              >
                Company located in Garland area
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

      {/* Drawer for mobile navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src="/inriLogo.png"
                alt="INRI Paint & Wall LLC Logo"
                width={160}
                height={160}
              />
            </Box>
            {[
              { text: "Home", href: "/" },
              { text: "About", href: "/about" },
              { text: "Contact", href: "/contact" },
              { text: "FAQs", href: "/frequently-asked-questions" },
            ].map((item) => (
              <ListItem component="a" href={item.href} key={item.text}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default TopNavbar;
