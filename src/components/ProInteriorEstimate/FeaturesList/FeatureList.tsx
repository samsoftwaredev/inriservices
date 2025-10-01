"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import { RoomData, FeatureType, RoomFeature } from "../laborTypes";
import { featureTypes } from "../laborData";

interface Props {
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  onOpenLaborDialog: (featureType: FeatureType, featureId: string) => void;
}

interface DeleteConfirmationState {
  open: boolean;
  featureType: FeatureType | null;
  featureId: string | null;
  featureName: string | null;
}

const FeaturesList = ({ roomData, setRoomData, onOpenLaborDialog }: Props) => {
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      featureType: null,
      featureId: null,
      featureName: null,
    });

  const handleDeleteClick = (
    featureType: FeatureType,
    featureId: string,
    featureName: string
  ) => {
    setDeleteConfirmation({
      open: true,
      featureType,
      featureId,
      featureName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      featureType: null,
      featureId: null,
      featureName: null,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.featureType && deleteConfirmation.featureId) {
      removeFeature(
        deleteConfirmation.featureType,
        deleteConfirmation.featureId
      );
    }
    handleDeleteCancel();
  };

  const removeFeature = (featureType: FeatureType, featureId: string) => {
    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [featureType]: roomData.features[featureType].filter(
          (feature) => feature.id !== featureId
        ),
      },
    });
  };

  const calculateFeatureCost = (feature: RoomFeature): number => {
    if (!feature.workLabor) return 0;
    return feature.workLabor.reduce((total, task) => {
      const laborCost = task.hours * task.rate;
      const materialCost =
        task.laborMaterials?.reduce((matTotal, material) => {
          return matTotal + material.quantity * material.price;
        }, 0) || 0;
      return total + laborCost + materialCost;
    }, 0);
  };

  const getTotalFeatures = () => {
    return Object.values(roomData.features).reduce(
      (total, featureArray) => total + (featureArray?.length || 0),
      0
    );
  };

  const getFeatureTypeLabel = (featureType: FeatureType): string => {
    const type = featureTypes.find((ft) => ft.value === featureType);
    return type?.label || featureType;
  };

  return (
    <>
      {featureTypes.map((featureType) => {
        const features = roomData.features[featureType.value];

        // Add safety check to ensure features array exists
        if (!features || features.length === 0) {
          return null;
        }

        return (
          <Box key={featureType.value} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {featureType.label} ({features.length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {features.map((feature) => (
                <Paper
                  key={feature.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 1,
                    minWidth: 200,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {feature.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Dimensions: {feature.dimensions}
                      </Typography>
                      {feature.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {feature.description}
                        </Typography>
                      )}
                      {feature.workLabor && feature.workLabor.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="primary">
                            Labor Tasks ({feature.workLabor.length}):
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {feature.workLabor.map((task, index) => (
                              <Chip
                                key={index}
                                label={task.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" color="success.main">
                            Est. Cost: $
                            {calculateFeatureCost(feature).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          onOpenLaborDialog(featureType.value, feature.id)
                        }
                        title="Assign Labor Tasks"
                      >
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDeleteClick(
                            featureType.value,
                            feature.id,
                            feature.name || "this feature"
                          )
                        }
                        title="Delete Feature"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        );
      })}

      {getTotalFeatures() === 0 && (
        <Typography variant="body2" color="text.secondary">
          No features added yet. Use the form above to add room features.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WarningIcon color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the feature "
            {deleteConfirmation.featureName}"?
            {deleteConfirmation.featureType && (
              <>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  Type: {getFeatureTypeLabel(deleteConfirmation.featureType)}
                </Typography>
              </>
            )}
            <br />
            <br />
            <Typography component="span" variant="body2" color="error">
              This action cannot be undone. All associated labor tasks and cost
              calculations will also be removed.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete Feature
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeaturesList;
