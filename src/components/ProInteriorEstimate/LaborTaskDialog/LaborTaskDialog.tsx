"use client";

import React, { useCallback } from "react";
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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { RoomData, FeatureType } from "../laborTypes";
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
  const handleLaborTaskToggle = (taskName: string) => {
    setSelectedLaborTasks((prev) =>
      prev.includes(taskName)
        ? prev.filter((name) => name !== taskName)
        : [...prev, taskName]
    );
  };

  const saveLaborTasks = () => {
    if (!selectedFeature) return;

    const selectedTasks = availableLaborTasks.filter((task) =>
      selectedLaborTasks.includes(task.name)
    );

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
  };

  const getFeatureData = useCallback(
    (selectedFeature: { type: FeatureType; id: string }) => {
      const feature = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );
      return {
        name: feature?.name || "Unknown Feature",
        type: feature?.type.toUpperCase() || "Unknown Type",
      };
    },
    [roomData.features]
  );

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
          {availableLaborTasks.map((task) => (
            <ListItem
              key={task.name}
              dense
              component={"div"}
              onClick={() => handleLaborTaskToggle(task.name)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedLaborTasks.includes(task.name)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary={task.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {task.hours} hrs @ ${task.rate}/hr = $
                      {task.hours * task.rate}
                      {task.laborMaterials &&
                        task.laborMaterials.length > 0 && (
                          <span>
                            {" + materials: $"}
                            {task.laborMaterials
                              .reduce(
                                (total, material) =>
                                  total + material.quantity * material.price,
                                0
                              )
                              .toFixed(2)}
                          </span>
                        )}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
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
