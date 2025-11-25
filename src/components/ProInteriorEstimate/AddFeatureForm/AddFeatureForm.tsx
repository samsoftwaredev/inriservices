"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  RoomData,
  FeatureType,
  RoomFeature,
  MeasurementUnit,
} from "@/interfaces/laborTypes";
import { featureTypes } from "../laborData";
import ImageUpload from "@/components/ImageUpload";

interface Props {
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
}

const AddFeatureForm = ({ measurementUnit, roomData, setRoomData }: Props) => {
  const [newFeature, setNewFeature] = useState({
    type: "windows" as FeatureType,
    name: "",
    description: "",
    dimensions: "",
  });

  const addFeature = () => {
    if (!newFeature.name.trim()) return;

    const feature: RoomFeature = {
      id: Date.now().toString(),
      type: newFeature.type,
      name: newFeature.name,
      description: newFeature.description,
      dimensions: newFeature.dimensions,
      image: "",
      picture: null,
      workLabor: [],
    };

    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [newFeature.type]: [...roomData.features[newFeature.type], feature],
      },
    });

    // Reset form
    setNewFeature({
      type: "windows",
      name: "",
      description: "",
      dimensions: "",
    });
  };

  return (
    <Box sx={{ mb: 3, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Add New Feature
      </Typography>
      <Box sx={{ mb: 2 }}>
        <ImageUpload />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Feature Type</InputLabel>
            <Select
              value={newFeature.type}
              label="Feature Type"
              onChange={(e: SelectChangeEvent<FeatureType>) =>
                setNewFeature({
                  ...newFeature,
                  type: e.target.value as FeatureType,
                })
              }
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
          <TextField
            fullWidth
            size="small"
            label="Title"
            value={newFeature.name}
            onChange={(e) =>
              setNewFeature({ ...newFeature, name: e.target.value })
            }
            placeholder="e.g., Large Window"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            size="small"
            label={`Dimensions (${measurementUnit})`}
            value={newFeature.dimensions}
            onChange={(e) =>
              setNewFeature({
                ...newFeature,
                dimensions: e.target.value,
              })
            }
            placeholder="e.g., 3x4"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addFeature}
            disabled={!newFeature.name.trim()}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        multiline
        minRows={2}
        size="small"
        label="Description (Optional)"
        value={newFeature.description}
        onChange={(e) =>
          setNewFeature({ ...newFeature, description: e.target.value })
        }
        sx={{ mt: 2 }}
        placeholder="Additional details (e.g., Type of window, material, scratched, broken, etc.)"
      />
    </Box>
  );
};

export default AddFeatureForm;
