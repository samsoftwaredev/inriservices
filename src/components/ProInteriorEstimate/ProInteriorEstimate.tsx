"use client";

import React from "react";

import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useProInteriorEstimate } from "@/context/useProInteriorEstimate";
import EstimateSummary from "./EstimateSummary";

const ProInteriorEstimate = () => {
  const {
    // State
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
    <>
      <MainContent
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
