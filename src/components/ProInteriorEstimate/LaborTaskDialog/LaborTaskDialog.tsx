"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  IconButton,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";

import TaskItem from "../TaskItem";
import { RoomData, FeatureType, LaborTask } from "../laborTypes";
import { availableLaborTasks, featureTypes } from "../laborData";
import { TaskHours } from "../laborTypes";

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
  const [taskHours, setTaskHours] = useState<TaskHours>({});
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [editFeatureName, setEditFeatureName] = useState("");
  const [editFeatureType, setEditFeatureType] = useState<FeatureType>("walls");
  const [includeMaterialCosts, setIncludeMaterialCosts] = useState(true);

  // Initialize task hours when dialog opens or selected feature changes
  useEffect(() => {
    if (selectedFeature && open) {
      const feature = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );

      const initialHours: TaskHours = {};

      // Initialize with existing task hours or default hours
      availableLaborTasks.forEach((task) => {
        const existingTask = feature?.workLabor?.find(
          (wl) => wl.name === task.name
        );
        initialHours[task.name] = existingTask?.hours || task.hours;
      });

      setTaskHours(initialHours);

      // Initialize edit fields
      setEditFeatureName(feature?.name || "");
      setEditFeatureType(selectedFeature.type);

      // Initialize selected tasks based on existing work labor
      if (feature?.workLabor) {
        const existingTaskNames = feature.workLabor.map((task) => task.name);
        setSelectedLaborTasks(existingTaskNames);
      }

      // Initialize material costs toggle from feature data
      setIncludeMaterialCosts(feature?.includeMaterialCosts !== false);
    }
  }, [selectedFeature, open, roomData.features, setSelectedLaborTasks]);

  const handleLaborTaskToggle = (taskName: string) => {
    setSelectedLaborTasks((prev) =>
      prev.includes(taskName)
        ? prev.filter((name) => name !== taskName)
        : [...prev, taskName]
    );
  };

  const handleHoursChange = (taskName: string, hours: number) => {
    setTaskHours((prev) => ({
      ...prev,
      [taskName]: Math.max(0, hours), // Ensure non-negative hours
    }));
  };

  const handleMaterialCostsToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeMaterialCosts(event.target.checked);
  };

  const calculateTotalCost = () => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const hours = taskHours[taskName] || task.hours;
      const laborCost = hours * task.rate;
      const materialCost = includeMaterialCosts
        ? task.laborMaterials?.reduce(
            (matTotal, material) =>
              matTotal + material.quantity * material.price,
            0
          ) || 0
        : 0;

      return total + laborCost + materialCost;
    }, 0);
  };

  const calculateTotalMaterialCost = () => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const materialCost =
        task.laborMaterials?.reduce(
          (matTotal, material) => matTotal + material.quantity * material.price,
          0
        ) || 0;

      return total + materialCost;
    }, 0);
  };

  const calculateTotalLaborCost = () => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const hours = taskHours[taskName] || task.hours;
      const laborCost = hours * task.rate;

      return total + laborCost;
    }, 0);
  };

  const getTaskBreakdown = () => {
    return selectedLaborTasks
      .map((taskName) => {
        const task = availableLaborTasks.find((t) => t.name === taskName);
        if (!task) return null;

        const hours = taskHours[taskName] || task.hours;
        const laborCost = hours * task.rate;
        const materialCost = includeMaterialCosts
          ? task.laborMaterials?.reduce(
              (matTotal, material) =>
                matTotal + material.quantity * material.price,
              0
            ) || 0
          : 0;

        return {
          name: taskName,
          hours,
          laborCost,
          materialCost,
          totalCost: laborCost + materialCost,
        };
      })
      .filter(Boolean);
  };

  const handleEditFeature = () => {
    setIsEditingFeature(true);
  };

  const handleSaveFeatureEdit = () => {
    if (!selectedFeature) return;

    // Update the feature in roomData
    const updatedFeatures = roomData.features[selectedFeature.type].map(
      (feature) => {
        if (feature.id === selectedFeature.id) {
          return {
            ...feature,
            name: editFeatureName,
            includeMaterialCosts,
          };
        }
        return feature;
      }
    );

    // If feature type changed, move the feature to the new type
    if (editFeatureType !== selectedFeature.type) {
      const featureToMove = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );

      if (featureToMove) {
        const updatedFeatureToMove = {
          ...featureToMove,
          name: editFeatureName,
          includeMaterialCosts,
        };

        // Remove from old type
        const oldTypeFeatures = roomData.features[selectedFeature.type].filter(
          (f) => f.id !== selectedFeature.id
        );

        // Add to new type
        const newTypeFeatures = [
          ...(roomData.features[editFeatureType] || []),
          updatedFeatureToMove,
        ];

        setRoomData({
          ...roomData,
          features: {
            ...roomData.features,
            [selectedFeature.type]: oldTypeFeatures,
            [editFeatureType]: newTypeFeatures,
          },
        });

        // Update selectedFeature to reflect the new type
        setSelectedFeature({
          type: editFeatureType,
          id: selectedFeature.id,
        });
      }
    } else {
      // Same type, just update the name and material costs setting
      setRoomData({
        ...roomData,
        features: {
          ...roomData.features,
          [selectedFeature.type]: updatedFeatures,
        },
      });
    }

    setIsEditingFeature(false);
  };

  const handleCancelFeatureEdit = () => {
    if (!selectedFeature) return;

    const feature = roomData.features[selectedFeature.type].find(
      (f) => f.id === selectedFeature.id
    );

    setEditFeatureName(feature?.name || "");
    setEditFeatureType(selectedFeature.type);
    setIncludeMaterialCosts(feature?.includeMaterialCosts !== false);
    setIsEditingFeature(false);
  };

  const handleFeatureTypeChange = (event: SelectChangeEvent<FeatureType>) => {
    setEditFeatureType(event.target.value as FeatureType);
  };

  const saveLaborTasks = () => {
    if (!selectedFeature) return;

    const selectedTasks: LaborTask[] = availableLaborTasks
      .filter((task) => selectedLaborTasks.includes(task.name))
      .map((task) => ({
        ...task,
        hours: taskHours[task.name] || task.hours,
        amountOfLabor:
          taskHours[task.name] * task.rate || task.hours * task.rate,
      }));

    const currentFeatureType = selectedFeature.type;
    const updatedFeatures = roomData.features[currentFeatureType].map(
      (feature) => {
        if (feature.id === selectedFeature.id) {
          return {
            ...feature,
            workLabor: selectedTasks,
            includeMaterialCosts,
          };
        }
        return feature;
      }
    );

    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [currentFeatureType]: updatedFeatures,
      },
    });

    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedFeature(null);
    setSelectedLaborTasks([]);
    setTaskHours({});
    setIsEditingFeature(false);
    setIncludeMaterialCosts(true);
  };

  const getFeatureData = () => {
    if (!selectedFeature) return { name: "", type: "" };

    const feature = roomData.features[selectedFeature.type].find(
      (f) => f.id === selectedFeature.id
    );
    return {
      name: feature?.name || "Unknown Feature",
      type:
        selectedFeature.type.charAt(0).toUpperCase() +
        selectedFeature.type.slice(1),
    };
  };

  const featureData = getFeatureData();
  const getFeatureTypeLabel = (type: FeatureType) => {
    const featureType = featureTypes.find((ft) => ft.value === type);
    return featureType?.label || type;
  };

  const totalCost = calculateTotalCost();
  const totalLaborCost = calculateTotalLaborCost();
  const totalMaterialCost = calculateTotalMaterialCost();
  const taskBreakdown = getTaskBreakdown();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Assign Labor Tasks
        {selectedFeature && (
          <Box sx={{ mt: 1 }}>
            {isEditingFeature ? (
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    fullWidth
                    label="Feature Name"
                    value={editFeatureName}
                    onChange={(e) => setEditFeatureName(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Feature Type</InputLabel>
                    <Select
                      value={editFeatureType}
                      label="Feature Type"
                      onChange={handleFeatureTypeChange}
                    >
                      {featureTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleSaveFeatureEdit}
                      disabled={!editFeatureName.trim()}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleCancelFeatureEdit}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {featureData.name} (
                  {getFeatureTypeLabel(selectedFeature.type)})
                </Typography>
                <IconButton size="small" onClick={handleEditFeature}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </DialogTitle>
      <DialogContent>
        {/* Material Costs Toggle */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={includeMaterialCosts}
                onChange={handleMaterialCostsToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BuildIcon fontSize="small" />
                <Typography variant="body1">
                  Include Material Costs in Estimate
                </Typography>
              </Box>
            }
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, ml: 4 }}
          >
            {includeMaterialCosts
              ? "Material costs will be included in the total project cost"
              : "Only labor costs will be calculated (customer provides materials)"}
          </Typography>
          {!includeMaterialCosts && totalMaterialCost > 0 && (
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ mt: 1, ml: 4 }}
            >
              Materials excluded: -${totalMaterialCost.toLocaleString()}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Labor Task Selection */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom>
              Available Labor Tasks
            </Typography>
            <List>
              {availableLaborTasks.map((task) => (
                <TaskItem
                  key={task.name}
                  task={task}
                  currentHours={taskHours[task.name] || task.hours}
                  isSelected={selectedLaborTasks.includes(task.name)}
                  onToggle={handleLaborTaskToggle}
                  onHoursChange={handleHoursChange}
                  includeMaterialCosts={includeMaterialCosts}
                />
              ))}
            </List>
          </Grid>

          {/* Cost Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Cost Summary</Typography>
              </Box>

              {selectedLaborTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No labor tasks selected
                </Typography>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Tasks ({selectedLaborTasks.length}):
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      {selectedLaborTasks.map((taskName) => (
                        <Chip
                          key={taskName}
                          label={taskName}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Cost Breakdown Summary */}
                  <Box
                    sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Labor Cost:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          ${totalLaborCost.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Material Cost:
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{
                            textDecoration: !includeMaterialCosts
                              ? "line-through"
                              : "none",
                            color: !includeMaterialCosts
                              ? "text.disabled"
                              : "inherit",
                          }}
                        >
                          $
                          {includeMaterialCosts
                            ? totalMaterialCost.toLocaleString()
                            : "0"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cost Breakdown:
                    </Typography>
                    {taskBreakdown.map((task) => (
                      <Box
                        key={task?.name}
                        sx={{ mb: 1, fontSize: "0.875rem" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            {task?.name} ({task?.hours}h)
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ${task?.totalCost.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            ml: 2,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Labor: ${task?.laborCost.toFixed(2)}
                            {(task?.materialCost || 0) > 0 &&
                              includeMaterialCosts &&
                              ` + Materials: $${task?.materialCost?.toFixed(
                                2
                              )}`}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.50",
                      borderRadius: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary.main">
                      Total {includeMaterialCosts ? "Project" : "Labor"} Cost
                    </Typography>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      ${totalCost.toLocaleString()}
                    </Typography>
                    {!includeMaterialCosts && (
                      <Typography variant="caption" color="text.secondary">
                        Materials not included
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {selectedLaborTasks.length > 0 && (
            <Typography
              variant="body2"
              color="primary.main"
              fontWeight="medium"
            >
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
          <Button onClick={handleClose} size="large">
            Cancel
          </Button>
          <Button
            onClick={saveLaborTasks}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            size="large"
            disabled={selectedLaborTasks.length === 0}
          >
            Save Tasks ({selectedLaborTasks.length})
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LaborTaskDialog;
