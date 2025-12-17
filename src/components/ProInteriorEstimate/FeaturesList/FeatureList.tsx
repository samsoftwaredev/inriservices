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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { RoomData, FeatureType, RoomFeature } from "@/interfaces/laborTypes";
import { featureTypes } from "@/constants/laborData";
import FeatureCard from "./FeatureCard";
import { calculateFeatureCost } from "@/tools";
import { useRoom } from "@/context/RoomContext";

interface Props {
  onOpenLaborDialog: (featureType: FeatureType, featureId: string) => void;
}

interface DeleteConfirmationState {
  open: boolean;
  featureType: FeatureType | null;
  featureId: string | null;
  featureName: string | null;
}

const getFeatureTypeLabel = (featureType: FeatureType): string => {
  const type = featureTypes.find((ft) => ft.value === featureType);
  return type?.label || featureType;
};

const getFeatureTypeIcon = (featureType: FeatureType): React.ReactNode => {
  const iconMap: Record<FeatureType, React.ReactNode> = {
    ceilings: "🏢",
    flooring: "🛋️",
    cabinetry: "🗄️",
    outlets: "🔌",
    switches: "💡",
    fixtures: "🚰",
    trim: "🪚",
    windows: "🪟",
    doors: "🚪",
    walls: "🧱",
    closets: "🚪",
    crownMolding: "👑",
    chairRail: "🪑",
    baseboard: "📏",
    wainscoting: "🪵",
    other: "❓",
  };

  return iconMap[featureType] || <CategoryIcon />;
};

const calculateTotalCostForType = (features: RoomFeature[]): number => {
  return features.reduce((total, feature) => {
    if (!feature.workLabor) return total;
    return total + calculateFeatureCost(feature);
  }, 0);
};

const FeaturesList = ({ onOpenLaborDialog }: Props) => {
  const { roomData, updateRoom } = useRoom();
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
    updateRoom({
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
              <Grid container gap={5}>
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
