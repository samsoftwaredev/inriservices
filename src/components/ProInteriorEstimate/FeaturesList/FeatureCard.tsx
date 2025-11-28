"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { RoomFeature, FeatureType } from "@/interfaces/laborTypes";
import { getDefaultFeatureImage } from "@/tools/featureTool";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Props {
  feature: RoomFeature;
  featureType: FeatureType;
  onOpenLaborDialog: (featureType: FeatureType, featureId: string) => void;
  onDeleteFeature: (
    featureType: FeatureType,
    featureId: string,
    featureName: string
  ) => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FeatureCard = ({
  feature,
  featureType,
  onOpenLaborDialog,
  onDeleteFeature,
}: Props) => {
  const featureCost = calculateFeatureCost(feature);
  const hasImage = feature.image && feature.image.trim() !== "";
  const imageUrl = hasImage
    ? feature.image
    : getDefaultFeatureImage(featureType);

  const handleDeleteClick = () => {
    onDeleteFeature(featureType, feature.id, feature.name || "this feature");
  };

  const handleLaborClick = () => {
    onOpenLaborDialog(featureType, feature.id);
  };

  return (
    <Card
      sx={{
        border: "none",
        boxShadow: "none",
        maxWidth: { xs: "100%", sm: 300 },
        minWidth: { xs: "100%", sm: 280 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      {/* Feature Image */}
      <CardMedia
        component="img"
        height={160}
        image={imageUrl}
        alt={feature.name || "Feature image"}
        sx={{
          objectFit: "cover",
          bgcolor: "grey.100",
        }}
        // onError={(e) => {
        //   // Fallback to default image if custom image fails to load
        //   const target = e.target as HTMLImageElement;
        //   target.src = getDefaultFeatureImage(featureType);
        // }}
      />

      {/* Feature Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: 600,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {feature.name || "Unnamed Feature"}
        </Typography>

        {/* Dimensions */}
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1,
          }}
        >
          <strong>Dimensions:</strong> {feature.dimensions || "Not specified"}
        </Typography>

        {/* Description */}
        {feature.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
            }}
          >
            {feature.description}
          </Typography>
        )}

        {/* Labor Tasks */}
        {feature.workLabor && feature.workLabor.length > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight="medium"
              gutterBottom
              component="div"
            >
              Labor Tasks ({feature.workLabor.length}):
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mb: 1,
              }}
            >
              {feature.workLabor.slice(0, 3).map((task, index) => (
                <Chip
                  key={index}
                  label={task.name}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {feature.workLabor.length > 3 && (
                <Chip
                  label={`+${feature.workLabor.length - 3} more`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Box>

            {/* Cost */}
            <Chip
              label={`Est. Cost: $${featureCost.toFixed(2)}`}
              size="small"
              color="success"
              variant="filled"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        )}

        {/* No Labor Warning */}
        {(!feature.workLabor || feature.workLabor.length === 0) && (
          <Box sx={{ mt: 1.5 }}>
            <Chip
              label="No labor tasks assigned"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          </Box>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleLaborClick}
          title="Assign Labor Tasks"
          sx={{
            bgcolor: "primary.50",
            "&:hover": {
              bgcolor: "primary.100",
            },
          }}
        >
          <AssignmentIcon fontSize="small" />
        </IconButton>

        <Stack direction="row" spacing={1}>
          {!hasImage && (
            <IconButton
              size="small"
              color="secondary"
              title="Add Custom Image"
              sx={{
                bgcolor: "grey.100",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteClick}
            title="Delete Feature"
            sx={{
              bgcolor: "error.50",
              "&:hover": {
                bgcolor: "error.100",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default FeatureCard;
