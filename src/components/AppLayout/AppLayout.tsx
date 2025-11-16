"use client";

import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import TopAppBar from "@/components/TopAppBar";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { useAppNavigation } from "@/hooks";
import { useProInteriorEstimate } from "@/context";

const drawerWidth = 280;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { mobileOpen, handleDrawerToggle, handleNavigation, handleLogoClick } =
    useAppNavigation();
  const { currentCustomer } = useProInteriorEstimate();

  return (
    <ThemeRegistry>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#eaf3f6",
        }}
      >
        <TopAppBar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          onNavigation={handleNavigation}
          onLogoClick={handleLogoClick}
          currentCustomer={currentCustomer}
        />

        <Container maxWidth="md">{children}</Container>
      </Box>
    </ThemeRegistry>
  );
};

export default AppLayout;
