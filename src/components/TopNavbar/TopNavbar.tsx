"use client";

import { theme } from "@/app/theme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Typography,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { companyPhone, companyPhoneFormatted } from "@/constants";

const navLinks = [
  { text: "Painting Services", href: "/" },
  { text: "About", href: "/about" },
  { text: "Contact Us", href: "/contact" },
  { text: "FAQs", href: "/frequently-asked-questions" },
];

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
          height: "55px",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "48px",
            [theme.breakpoints.up("md")]: {
              minHeight: "56px",
            },
          }}
        >
          {/* Show MenuIcon only on mobile/tablet */}
          {!isDesktop && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

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
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginRight: "50px",
              [theme.breakpoints.up("md")]: {
                marginRight: "inherit",
                display: "inherit",
                textAlign: "inherit",
                justifyContent: "inherit",
                width: "inherit",
                fontSize: "1.5rem",
              },
            }}
          >
            <Image
              src="/inriLogo.png"
              alt="INRI Paint & Wall LLC Logo"
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

          {/* Show nav links on desktop */}
          {isDesktop && (
            <Box sx={{ display: "flex", ml: 2 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.text}
                  href={item.href}
                  component="a"
                  color="inherit"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    textTransform: "none",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && (
            <Button
              href={`tel:${companyPhone}`}
              component="a"
              startIcon={<PhoneIcon />}
              variant="contained"
              color="error"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {companyPhoneFormatted}
            </Button>
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
            {navLinks.map((item) => (
              <ListItem component="a" href={item.href} key={item.text}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                href={`tel:${companyPhone}`}
                component="a"
                startIcon={<PhoneIcon />}
                variant="contained"
                color="error"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {companyPhoneFormatted}
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default TopNavbar;
