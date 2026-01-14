"use client";

import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import SideNav from "@/components/SideNav";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { useAppNavigation } from "@/hooks";
import { useClient } from "@/context/ClientContext";
import AppTopNav from "../AppTopNav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { mobileOpen, handleDrawerToggle, handleNavigation, handleLogoClick } =
    useAppNavigation();
  const { currentClient, previousClientIds, allClients, handleSelectClient } =
    useClient();

  return (
    <ThemeRegistry>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#eaf3f6",
        }}
      >
        <AppTopNav open={mobileOpen} handleDrawerOpen={handleDrawerToggle} />
        <SideNav
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          onNavigation={handleNavigation}
          onLogoClick={handleLogoClick}
          currentClient={currentClient}
          previousClientIds={previousClientIds}
          allClients={allClients}
          onSelectClient={handleSelectClient}
        />
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </ThemeRegistry>
  );
};

export default AppLayout;
