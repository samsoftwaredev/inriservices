"use client";

import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import SideNav from "@/components/SideNav";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { useAppNavigation } from "@/hooks";
import { useCustomer } from "@/context/CustomerContext";

const drawerWidth = 280;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { mobileOpen, handleDrawerToggle, handleNavigation, handleLogoClick } =
    useAppNavigation();
  const {
    currentCustomer,
    previousCustomers,
    handleSelectPreviousCustomer: onSelectPreviousCustomer,
  } = useCustomer();

  return (
    <ThemeRegistry>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#eaf3f6",
        }}
      >
        <SideNav
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          onNavigation={handleNavigation}
          onLogoClick={handleLogoClick}
          currentCustomer={currentCustomer}
          previousCustomers={previousCustomers}
          onSelectPreviousCustomer={onSelectPreviousCustomer}
        />

        <Container maxWidth="md">{children}</Container>
      </Box>
    </ThemeRegistry>
  );
};

export default AppLayout;
