"use client";

import React from "react";

import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useProInteriorEstimate } from "@/context/useProInteriorEstimate";
import EstimateSummary from "./EstimateSummary";
import { useCustomer } from "@/context/useCustomer";

const ProInteriorEstimate = () => {
  const {
    previousCustomers,
    setPreviousCustomers,
    currentCustomer,
    setCurrentCustomer,
    newCustomerDialogOpen,
    setNewCustomerDialogOpen,
    handleSelectPreviousCustomer,
    handleSaveNewCustomer,
    handleCustomerUpdate,
  } = useCustomer();
  const {
    locationData,
    setLocationData,
    anchorEl,
    setAnchorEl,
    deleteConfirmation,
    setDeleteConfirmation,
    baseCost,
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
