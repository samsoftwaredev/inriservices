"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DialogHeader from "../DialogHeader";
import MaterialCostsToggle from "../MaterialCostsToggle";
import TaskSelectionPanel from "../TaskSelectionPanel";
import CostSummaryPanel from "../CostSummaryPanel";
import DialogFooter from "../DialogFooter";
import { useLaborTaskDialog } from "@/hooks/useLaborTaskDialog";
import { RoomData, FeatureType } from "../../../interfaces/laborTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedFeature: { type: FeatureType; id: string } | null;
  selectedLaborTasks: string[];
  setSelectedLaborTasks: React.Dispatch<React.SetStateAction<string[]>>;
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  setSelectedFeature: React.Dispatch<
    React.SetStateAction<{ type: FeatureType; id: string } | null>
  >;
}

const LaborTaskDialog = ({
  open,
  onClose,
  selectedFeature,
  selectedLaborTasks,
  setSelectedLaborTasks,
  roomData,
  setRoomData,
  setSelectedFeature,
}: Props) => {
  const {
    taskHours,
    setTaskHours,
    isEditingFeature,
    setIsEditingFeature,
    editFeatureName,
    setEditFeatureName,
    editFeatureType,
    setEditFeatureType,
    includeMaterialCosts,
    setIncludeMaterialCosts,
    searchTerm,
    setSearchTerm,
    filteredLaborTasks,
    totalCost,
    totalLaborCost,
    totalMaterialCost,
    taskBreakdown,
    handleLaborTaskToggle,
    handleHoursChange,
    handleMaterialCostsToggle,
    handleSearchChange,
    handleClearSearch,
    handleEditFeature,
    handleSaveFeatureEdit,
    handleCancelFeatureEdit,
    handleFeatureTypeChange,
    saveLaborTasks,
    handleClose,
    getFeatureData,
    getFeatureTypeLabel,
  } = useLaborTaskDialog({
    open,
    onClose,
    selectedFeature,
    selectedLaborTasks,
    setSelectedLaborTasks,
    roomData,
    setRoomData,
    setSelectedFeature,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <DialogHeader
          selectedFeature={selectedFeature}
          isEditingFeature={isEditingFeature}
          editFeatureName={editFeatureName}
          setEditFeatureName={setEditFeatureName}
          editFeatureType={editFeatureType}
          onFeatureTypeChange={handleFeatureTypeChange}
          onEditFeature={handleEditFeature}
          onSaveFeatureEdit={handleSaveFeatureEdit}
          onCancelFeatureEdit={handleCancelFeatureEdit}
          getFeatureData={getFeatureData}
          getFeatureTypeLabel={getFeatureTypeLabel}
        />
      </DialogTitle>

      <DialogContent>
        <MaterialCostsToggle
          includeMaterialCosts={includeMaterialCosts}
          onToggle={handleMaterialCostsToggle}
          totalMaterialCost={totalMaterialCost}
        />

        <TaskSelectionPanel
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          filteredLaborTasks={filteredLaborTasks}
          taskHours={taskHours}
          selectedLaborTasks={selectedLaborTasks}
          setSelectedLaborTasks={setSelectedLaborTasks}
          onLaborTaskToggle={handleLaborTaskToggle}
          onHoursChange={handleHoursChange}
          includeMaterialCosts={includeMaterialCosts}
        />

        <CostSummaryPanel
          selectedLaborTasks={selectedLaborTasks}
          totalLaborCost={totalLaborCost}
          totalMaterialCost={totalMaterialCost}
          totalCost={totalCost}
          taskBreakdown={taskBreakdown}
          includeMaterialCosts={includeMaterialCosts}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <DialogFooter
          selectedLaborTasks={selectedLaborTasks}
          totalCost={totalCost}
          includeMaterialCosts={includeMaterialCosts}
          onClose={handleClose}
          onSave={saveLaborTasks}
        />
      </DialogActions>
    </Dialog>
  );
};

export default LaborTaskDialog;
