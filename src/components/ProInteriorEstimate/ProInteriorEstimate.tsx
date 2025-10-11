"use client";

import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import TopAppBar from "./TopAppBar";
import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useProInteriorEstimate } from "@/hooks/useProInteriorEstimate";
import { blue } from "@mui/material/colors";
import { theme } from "@/app/theme";
import { ThemeRegistry } from "@/app/ThemeRegistry";

const drawerWidth = 280;

const ProInteriorEstimate = () => {
  const {
    // State
    mobileOpen,
    setMobileOpen,
    previousCustomers,
    setPreviousCustomers,
    currentCustomer,
    setCurrentCustomer,
    locationData,
    setLocationData,
    anchorEl,
    setAnchorEl,
    newCustomerDialogOpen,
    setNewCustomerDialogOpen,
    deleteConfirmation,
    setDeleteConfirmation,
    baseCost,

    // Handlers
    handleDrawerToggle,
    handleNavigation,
    handleLogoClick,
    handleSelectPreviousCustomer,
    handleSaveNewCustomer,
    handleCustomerUpdate,
    addNewSection,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
    handleCostChange,
  } = useProInteriorEstimate();

  return (
    <ThemeRegistry>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#eaf3f6",
        }}
      >
        <CssBaseline />

        <TopAppBar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          onNavigation={handleNavigation}
          onLogoClick={handleLogoClick}
          currentCustomer={currentCustomer}
        />

        <Container maxWidth={"md"}>
          <MainContent
            drawerWidth={drawerWidth}
            locationData={locationData}
            setLocationData={setLocationData}
            currentCustomer={currentCustomer}
            previousCustomers={previousCustomers}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            newCustomerDialogOpen={newCustomerDialogOpen}
            setNewCustomerDialogOpen={setNewCustomerDialogOpen}
            onSelectPreviousCustomer={handleSelectPreviousCustomer}
            onSaveNewCustomer={handleSaveNewCustomer}
            onCustomerUpdate={handleCustomerUpdate}
            onAddNewSection={addNewSection}
            onDeleteSectionClick={handleDeleteSectionClick}
            onRoomUpdate={onRoomUpdate}
            baseCost={baseCost}
            onCostChange={handleCostChange}
          />
        </Container>

        <DeleteSectionDialog
          deleteConfirmation={deleteConfirmation}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </Box>
    </ThemeRegistry>
  );
};

export default ProInteriorEstimate;
