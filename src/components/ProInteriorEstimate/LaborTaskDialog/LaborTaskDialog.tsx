"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { RoomData, FeatureType, LaborTask } from "../laborTypes";
import { availableLaborTasks } from "../laborData";

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

interface TaskHours {
  [taskName: string]: number;
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
    }
  }, [selectedFeature, open, roomData.features]);

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

    const updatedFeatures = roomData.features[selectedFeature.type].map(
      (feature) => {
        if (feature.id === selectedFeature.id) {
          return {
            ...feature,
            workLabor: selectedTasks,
          };
        }
        return feature;
      }
    );

    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [selectedFeature.type]: updatedFeatures,
      },
    });

    onClose();
    setSelectedFeature(null);
    setSelectedLaborTasks([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedFeature(null);
    setSelectedLaborTasks([]);
    setTaskHours({});
  };

  const getFeatureData = useCallback(
    (selectedFeature: { type: FeatureType; id: string }) => {
      const feature = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );
      return {
        name: feature?.name || "Unknown Feature",
        type:
          selectedFeature.type.charAt(0).toUpperCase() +
          selectedFeature.type.slice(1),
      };
    },
    [roomData.features]
  );

  const calculateTaskCost = (task: LaborTask, hours: number) => {
    const laborCost = hours * task.rate;
    const materialCost =
      task.laborMaterials?.reduce(
        (total, material) => total + material.quantity * material.price,
        0
      ) || 0;
    return laborCost + materialCost;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Assign Labor Tasks
        {selectedFeature && (
          <Typography variant="subtitle2" color="text.secondary">
            {getFeatureData(selectedFeature).name} (
            {getFeatureData(selectedFeature).type})
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <List>
          {availableLaborTasks.map((task) => {
            const currentHours = taskHours[task.name] || task.hours;
            const isSelected = selectedLaborTasks.includes(task.name);
            const totalCost = calculateTaskCost(task, currentHours);

            return (
              <ListItem
                key={task.name}
                dense
                component={"div"}
                sx={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  border: isSelected ? "1px solid" : "1px solid transparent",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: isSelected ? "primary.50" : "transparent",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleLaborTaskToggle(task.name)}
                >
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    }
                    sx={{ flex: 1 }}
                  />
                </Box>

                {isSelected && (
                  <Box sx={{ mt: 2, pl: 6 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                          label="Hours"
                          type="number"
                          value={currentHours}
                          onChange={(e) =>
                            handleHoursChange(
                              task.name,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          inputProps={{
                            min: 0,
                            step: 0.5,
                          }}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Rate: ${task.rate}/hr
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="medium"
                        >
                          Labor: ${(currentHours * task.rate).toFixed(2)}
                          {task.laborMaterials &&
                            task.laborMaterials.length > 0 && (
                              <span>
                                {" + Materials: $"}
                                {task.laborMaterials
                                  .reduce(
                                    (total, material) =>
                                      total +
                                      material.quantity * material.price,
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="bold"
                        >
                          Total: ${totalCost.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={saveLaborTasks}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save Tasks ({selectedLaborTasks.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LaborTaskDialog;
