"use client";

import React from "react";

import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useProInteriorEstimate } from "@/hooks/useProInteriorEstimate";
import EstimateSummary from "./EstimateSummary";

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

  // Data Structure Ideas
  // customer - address, city, state, zip, phone, email, full name
  // section - name, description, floor number, rooms[], features, dimensions, height, floor number
  // project - name, description, budget range, timeline, expectations, cost adjustments, base cost

  return (
    <>
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
      <EstimateSummary />

      <DeleteSectionDialog
        deleteConfirmation={deleteConfirmation}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default ProInteriorEstimate;
