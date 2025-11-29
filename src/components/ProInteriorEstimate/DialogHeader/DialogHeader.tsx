"use client";

import React from "react";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { FeatureType } from "@/interfaces/laborTypes";
import { featureTypes } from "@/constants/laborData";

interface Props {
  selectedFeature: { type: FeatureType; id: string } | null;
  isEditingFeature: boolean;
  editFeatureName: string;
  setEditFeatureName: (name: string) => void;
  editFeatureType: FeatureType;
  onFeatureTypeChange: (event: SelectChangeEvent<FeatureType>) => void;
  onEditFeature: () => void;
  onSaveFeatureEdit: () => void;
  onCancelFeatureEdit: () => void;
  getFeatureData: () => { name: string; type: string };
  getFeatureTypeLabel: (type: FeatureType) => string;
}

const DialogHeader = ({
  selectedFeature,
  isEditingFeature,
  editFeatureName,
  setEditFeatureName,
  editFeatureType,
  onFeatureTypeChange,
  onEditFeature,
  onSaveFeatureEdit,
  onCancelFeatureEdit,
  getFeatureData,
  getFeatureTypeLabel,
}: Props) => {
  const featureData = getFeatureData();

  return (
    <>
      <Typography variant="subtitle2">Assign Labor Tasks</Typography>
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
                    onChange={onFeatureTypeChange}
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
                    onClick={onSaveFeatureEdit}
                    disabled={!editFeatureName.trim()}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={onCancelFeatureEdit}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5" color="text.secondary">
                {featureData.name} ({getFeatureTypeLabel(selectedFeature.type)})
              </Typography>
              <IconButton size="small" onClick={onEditFeature}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default DialogHeader;
