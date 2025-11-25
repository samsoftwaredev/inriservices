"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { RoomData, FeatureType, RoomFeature } from "@/interfaces/laborTypes";
import { featureTypes } from "../laborData";
import FeatureCard from "./FeatureCard";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getFeatureTypeLabel = (featureType: FeatureType): string => {
  const type = featureTypes.find((ft) => ft.value === featureType);
  return type?.label || featureType;
};

const getFeatureTypeIcon = (featureType: FeatureType): React.ReactNode => {
  const iconMap: Record<FeatureType, React.ReactNode> = {
    doors: "🚪",
    windows: "🪟",
    outlets: "🔌",
    switches: "💡",
    fixtures: "🔧",
    trim: "📐",
    other: "📦",
    walls: "🧱",
    closets: "🚪",
    crownMolding: "🎀",
    chairRail: "🪑",
    baseboard: "🦶",
    wainscoting: "🪵",
  };

  return iconMap[featureType] || <CategoryIcon />;
};

const calculateTotalCostForType = (features: RoomFeature[]): number => {
  return features.reduce((total, feature) => {
    if (!feature.workLabor) return total;
    return (
      total +
      feature.workLabor.reduce((featureTotal, task) => {
        const laborCost = task.hours * task.rate;
        const materialCost =
          task.laborMaterials?.reduce((matTotal, material) => {
            return matTotal + material.quantity * material.price;
          }, 0) || 0;
        return featureTotal + laborCost + materialCost;
      }, 0)
    );
  }, 0);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FeaturesList = ({ roomData, setRoomData, onOpenLaborDialog }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      featureType: null,
      featureId: null,
      featureName: null,
    });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

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

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const getTotalFeatures = () => {
    return Object.values(roomData.features).reduce(
      (total, featureArray) => total + (featureArray?.length || 0),
      0
    );
  };

  const featuresWithData = featureTypes.filter((featureType) => {
    const features = roomData.features[featureType.value];
    return features && features.length > 0;
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "primary.main",
            fontWeight: 600,
          }}
        >
          <CategoryIcon />
          Room Features
          {getTotalFeatures() > 0 && (
            <Chip
              label={`${getTotalFeatures()} total`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Typography>

        {getTotalFeatures() === 0 && (
          <Typography variant="body2" color="text.secondary">
            No features added yet. Use the form above to add room features.
          </Typography>
        )}
      </Box>

      {/* Features by Type */}
      {featuresWithData.map((featureType) => {
        const features = roomData.features[featureType.value];
        const totalCost = calculateTotalCostForType(features);

        return (
          <Accordion
            key={featureType.value}
            defaultExpanded
            sx={{
              mb: 2,
              "&:before": {
                display: "none",
              },
              boxShadow: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${featureType.value}-content`}
              id={`${featureType.value}-header`}
              sx={{
                bgcolor: "grey.50",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    {getFeatureTypeIcon(featureType.value)}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {featureType.label}
                  </Typography>
                  <Chip
                    label={features.length}
                    size="small"
                    color="secondary"
                    sx={{ minWidth: "auto" }}
                  />
                </Box>

                {totalCost > 0 && (
                  <Chip
                    label={`$${totalCost.toFixed(2)}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                {features.map((feature) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.id}>
                    <FeatureCard
                      feature={feature}
                      featureType={featureType.value}
                      onOpenLaborDialog={onOpenLaborDialog}
                      onDeleteFeature={handleDeleteClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
          }}
        >
          <WarningIcon color="warning" />
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the feature{" "}
            <strong>"{deleteConfirmation.featureName}"</strong>?
            {deleteConfirmation.featureType && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  Type: {getFeatureTypeLabel(deleteConfirmation.featureType)}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 2, p: 2, bgcolor: "error.50", borderRadius: 1 }}>
              <Typography
                variant="body2"
                color="error.main"
                fontWeight="medium"
              >
                ⚠️ This action cannot be undone. All associated labor tasks and
                cost calculations will also be removed.
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
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
    </Box>
  );
};

export default FeaturesList;
