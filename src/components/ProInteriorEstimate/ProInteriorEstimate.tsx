"use client";

import React from "react";

import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useBuilding } from "@/context/useBuilding";
import EstimateSummary from "./EstimateSummary";
import { useCustomer } from "@/context/useCustomer";

const Building = () => {
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
    buildingData,
    setBuildingData,
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
  } = useBuilding();

  return (
    <>
      <MainContent
        buildingData={buildingData}
        setBuildingData={setBuildingData}
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

export default Building;
