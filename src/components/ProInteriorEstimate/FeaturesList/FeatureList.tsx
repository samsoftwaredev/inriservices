"use client";

import React from "react";
import { Box, Typography, Paper, IconButton, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { RoomData, FeatureType, RoomFeature } from "../laborTypes";
import { featureTypes } from "../laborData";

interface Props {
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  onOpenLaborDialog: (featureType: FeatureType, featureId: string) => void;
}

const FeaturesList = ({ roomData, setRoomData, onOpenLaborDialog }: Props) => {
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
                          removeFeature(featureType.value, feature.id)
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
    </>
  );
};

export default FeaturesList;
