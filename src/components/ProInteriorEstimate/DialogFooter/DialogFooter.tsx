"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useLaborCost } from "@/context/LaborCostContext";

interface Props {
  selectedLaborTasks: string[];
  includeMaterialCosts: boolean;
  onClose: () => void;
  onSave: () => void;
}

const DialogFooter = ({
  selectedLaborTasks,
  includeMaterialCosts,
  onClose,
  onSave,
}: Props) => {
  const { totalCost } = useLaborCost();

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {selectedLaborTasks.length > 0 && (
          <Typography variant="body2" color="primary.main" fontWeight="medium">
            Total: ${totalCost.toLocaleString()}
            {!includeMaterialCosts && (
              <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                (Labor only)
              </Typography>
            )}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          size="large"
          disabled={selectedLaborTasks.length === 0}
        >
          Save Tasks ({selectedLaborTasks.length})
        </Button>
      </Box>
    </>
  );
};

export default DialogFooter;
