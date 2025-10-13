"use client";

import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import TopAppBar from "@/components/TopAppBar";
import { useProInteriorEstimate } from "@/hooks/useProInteriorEstimate";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { ProInteriorEstimate } from "@/components";

const drawerWidth = 280;

const InteriorEstimate = () => {
  const {
    // State
    mobileOpen,
    currentCustomer,

    // Handlers
    handleDrawerToggle,
    handleNavigation,
    handleLogoClick,
  } = useProInteriorEstimate();

  // Data Structure Ideas
  // customer - address, city, state, zip, phone, email, full name
  // section - name, description, floor number, rooms[], features, dimensions, height, floor number
  // project - name, description, budget range, timeline, expectations, cost adjustments, base cost

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

        <Container maxWidth="md">
          <ProInteriorEstimate />
        </Container>
      </Box>
    </ThemeRegistry>
  );
};

export default InteriorEstimate;
