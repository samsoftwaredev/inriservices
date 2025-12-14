"use client";

import React from "react";

import MainContent from "./MainContent";
import DeleteSectionDialog from "./DeleteSectionDialog";
import { useBuilding } from "@/context/useBuilding";
import EstimateSummary from "./EstimateSummary";
import { useCustomer } from "@/context/CustomerContext";

const Building = () => {
  const {
    buildingData,
    setBuildingData,
    anchorEl,
    setAnchorEl,
    deleteConfirmation,
    setDeleteConfirmation,
    addNewSection,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
  } = useBuilding();

  return (
    <>
      <MainContent
        buildingData={buildingData}
        setBuildingData={setBuildingData}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onAddNewSection={addNewSection}
        onDeleteSectionClick={handleDeleteSectionClick}
        onRoomUpdate={onRoomUpdate}
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
