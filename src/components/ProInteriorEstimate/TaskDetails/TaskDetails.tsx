"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LaborTask, LaborMaterial } from "@/interfaces/laborTypes";

interface Props {
  task: LaborTask;
  currentHours?: number;
  totalCost?: number;
  onHoursChange: (taskName: string, hours: number) => void;
  includeMaterialCosts?: boolean;
  onMaterialSelectionChange?: (
    taskName: string,
    selectedMaterials: LaborMaterial[]
  ) => void;
}

const TaskDetails = ({
  task,
  currentHours = 0,
  totalCost = 0,
  onHoursChange,
  includeMaterialCosts = true,
  onMaterialSelectionChange,
}: Props) => {
  const [hours, setHours] = useState<string>(currentHours.toString());
  const [selectedMaterials, setSelectedMaterials] = useState<LaborMaterial[]>(
    []
  );

  // Initialize selected materials when component mounts or task changes
  useEffect(() => {
    if (task.laborMaterials) {
      setSelectedMaterials(task.laborMaterials);
    }
  }, [task.laborMaterials]);

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onHoursChange(task.name, parseFloat(event.target.value) || 0);
    setHours(event.target.value);
  };

  const handleMaterialToggle = (material: LaborMaterial) => {
    const isCurrentlySelected = selectedMaterials.some(
      (selected) => selected.name === material.name
    );

    let newSelectedMaterials: LaborMaterial[];

    if (isCurrentlySelected) {
      // Remove material from selection
      newSelectedMaterials = selectedMaterials.filter(
        (selected) => selected.name !== material.name
      );
    } else {
      // Add material to selection
      newSelectedMaterials = [...selectedMaterials, material];
    }

    setSelectedMaterials(newSelectedMaterials);

    // Notify parent component of the change
    if (onMaterialSelectionChange) {
      onMaterialSelectionChange(task.name, newSelectedMaterials);
    }
  };

  const getMaterialCost = () => {
    return (
      selectedMaterials?.reduce(
        (total, material) =>
          total + (material?.quantity || 0) * (material?.price || 0),
        0
      ) || 0
    );
  };

  const getTotalMaterialCost = () => {
    return (
      task.laborMaterials?.reduce(
        (total, material) =>
          total + (material?.quantity || 0) * (material?.price || 0),
        0
      ) || 0
    );
  };

  const isAllMaterialsSelected = () => {
    const materialsLength = task.laborMaterials?.length || 0;
    const selectedLength = selectedMaterials?.length || 0;
    return materialsLength > 0 && materialsLength === selectedLength;
  };

  const isSomeMaterialsSelected = () => {
    const selectedLength = selectedMaterials?.length || 0;
    return selectedLength > 0 && !isAllMaterialsSelected();
  };

  const handleSelectAllMaterials = () => {
    if (isAllMaterialsSelected()) {
      // Deselect all
      setSelectedMaterials([]);
      if (onMaterialSelectionChange) {
        onMaterialSelectionChange(task.name, []);
      }
    } else {
      // Select all
      const allMaterials = task.laborMaterials || [];
      setSelectedMaterials(allMaterials);
      if (onMaterialSelectionChange) {
        onMaterialSelectionChange(task.name, allMaterials);
      }
    }
  };

  const materialCost = getMaterialCost();
  const totalMaterialCost = getTotalMaterialCost();
  const laborCost = currentHours * task.rate;

  if (!task) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, pl: 6 }}>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Hours and Rate */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Hours"
            type="text"
            value={hours}
            onChange={handleHoursChange}
            inputProps={{
              min: 0,
              step: 0.1,
            }}
            size="small"
            fullWidth
            helperText="Minimum 0.1 hours"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Rate: ${task.rate}/hr
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentHours} × ${task.rate} = ${laborCost.toFixed(2)}
          </Typography>
        </Grid>

        {/* Cost Summary */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            Labor: ${laborCost.toFixed(2)}
            {materialCost > 0 && includeMaterialCosts && (
              <span>
                {" + Materials: $"}
                {materialCost.toFixed(2)}
              </span>
            )}
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight="bold">
            Total: ${totalCost.toFixed(2)}
          </Typography>
        </Grid>

        {/* Materials List */}
        {task.laborMaterials && task.laborMaterials.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />

            {/* Materials Header with Select All */}
            <Box
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" color="text.primary">
                Required Materials:
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllMaterialsSelected()}
                    indeterminate={isSomeMaterialsSelected()}
                    onChange={handleSelectAllMaterials}
                    size="small"
                  />
                }
                label={
                  <Typography variant="caption">
                    Select All ({selectedMaterials?.length || 0}/
                    {task.laborMaterials?.length || 0})
                  </Typography>
                }
              />
            </Box>

            {/* Status Chips */}
            <Box sx={{ mb: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {!includeMaterialCosts && (
                <Chip
                  label="Materials Not Included in Cost"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
              {selectedMaterials.length <
                (task.laborMaterials?.length || 0) && (
                <Chip
                  label={`${
                    task.laborMaterials.length - selectedMaterials.length
                  } Materials Excluded`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            <List dense sx={{ bgcolor: "grey.50", borderRadius: 1, p: 1 }}>
              {task.laborMaterials?.map((material, index) => {
                if (!material) return null;

                const isSelected = selectedMaterials.some(
                  (selected) => selected?.name === material.name
                );
                const itemCost = material.quantity * material.price;

                return (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleMaterialToggle(material)}
                          size="small"
                        />
                      }
                      label={
                        <ListItemText
                          sx={{ ml: 1 }}
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                sx={{
                                  opacity: isSelected ? 1 : 0.6,
                                  textDecoration: !isSelected
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {material.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color={
                                  isSelected && includeMaterialCosts
                                    ? "text.primary"
                                    : "text.disabled"
                                }
                                sx={{
                                  textDecoration:
                                    !isSelected || !includeMaterialCosts
                                      ? "line-through"
                                      : "none",
                                }}
                              >
                                ${itemCost.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ opacity: isSelected ? 1 : 0.6 }}
                            >
                              Qty: {material.quantity} × $
                              {material.price.toFixed(2)} each
                              {material.unit && ` (${material.unit})`}
                            </Typography>
                          }
                        />
                      }
                      sx={{ width: "100%", m: 0 }}
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Materials Total */}
            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total Available Materials: ${totalMaterialCost.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                color={includeMaterialCosts ? "primary.main" : "text.disabled"}
                sx={{
                  textDecoration: !includeMaterialCosts
                    ? "line-through"
                    : "none",
                }}
              >
                Selected Materials: ${materialCost.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* No Materials Message */}
        {(!task.laborMaterials || task.laborMaterials.length === 0) && (
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No materials required for this task
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TaskDetails;
