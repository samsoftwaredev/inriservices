"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import DialogHeader from "../DialogHeader";
import MaterialCostsToggle from "../MaterialCostsToggle";
import TaskSelectionPanel from "../TaskSelectionPanel";
import CostSummaryPanel from "../CostSummaryPanel";
import DialogFooter from "../DialogFooter";
import { RoomLaborCostProvider } from "@/context/RoomLaborCostContext";
import { useLaborTaskDialog } from "@/hooks/useLaborTaskDialog";
import { FeatureType } from "@/interfaces/laborTypes";
import { useRoom } from "@/context/RoomContext";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedFeature: { type: FeatureType; id: string } | null;
  selectedLaborTasks: string[];
  setSelectedLaborTasks: React.Dispatch<React.SetStateAction<string[]>>;
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
  setSelectedFeature,
}: Props) => {
  const { roomData, updateRoom } = useRoom();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    taskHours,
    isEditingFeature,
    editFeatureName,
    setEditFeatureName,
    editFeatureType,
    includeMaterialCosts,
    searchTerm,
    filteredLaborTasks,
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
    updateRoom,
    setSelectedFeature,
  });

  return (
    <RoomLaborCostProvider
      selectedLaborTasks={selectedLaborTasks}
      taskHours={taskHours}
      includeMaterialCosts={includeMaterialCosts}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={isMobile ? false : "lg"}
        fullWidth={!isMobile}
        fullScreen={isMobile || isTablet}
        sx={{
          // Custom styles for different screen sizes
          "& .MuiDialog-paper": {
            height: isMobile ? "100vh" : isTablet ? "95vh" : "auto",
            margin: isMobile ? 0 : isTablet ? 1 : 2,
            borderRadius: isMobile ? 0 : undefined,
          },
        }}
      >
        <DialogTitle
          sx={{
            position: isMobile ? "sticky" : "static",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: isMobile ? "1px solid" : "none",
            borderBottomColor: "divider",
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
          }}
        >
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

        <DialogContent
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 2 },
            overflow: "auto",
            // Add padding for mobile to prevent content from touching edges
            "&.MuiDialogContent-root": {
              paddingTop: { xs: 1, sm: 2 },
            },
          }}
        >
          <MaterialCostsToggle
            includeMaterialCosts={includeMaterialCosts}
            onToggle={handleMaterialCostsToggle}
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
            includeMaterialCosts={includeMaterialCosts}
          />
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            position: isMobile ? "sticky" : "static",
            bottom: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderTop: isMobile ? "1px solid" : "none",
            borderTopColor: "divider",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <DialogFooter
            selectedLaborTasks={selectedLaborTasks}
            includeMaterialCosts={includeMaterialCosts}
            onClose={handleClose}
            onSave={saveLaborTasks}
          />
        </DialogActions>
      </Dialog>
    </RoomLaborCostProvider>
  );
};

export default LaborTaskDialog;
