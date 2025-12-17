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
  FeatureType,
  RoomFeature,
  MeasurementUnit,
} from "@/interfaces/laborTypes";
import { featureTypes } from "@/constants/laborData";
import ImageUpload from "@/components/ImageUpload";
import { uuidv4 } from "@/tools/general";
import { useRoom } from "@/context/RoomContext";

interface Props {
  roomId: string;
  measurementUnit: MeasurementUnit;
}

const AddFeatureForm = ({ roomId, measurementUnit }: Props) => {
  const { roomData, updateRoom } = useRoom();
  const [featureType, setFeatureType] = useState<FeatureType>("windows");
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [featureDimensions, setFeatureDimensions] = useState("");

  const addFeature = () => {
    if (!featureName.trim()) return;

    const feature: RoomFeature = {
      id: `${roomId}-${uuidv4()}`,
      type: featureType,
      name: featureName,
      description: featureDescription,
      dimensions: featureDimensions,
      image: "",
      workLabor: [],
    };

    updateRoom({
      ...roomData,
      features: {
        ...roomData.features,
        [featureType]: [...roomData.features[featureType], feature],
      },
    });

    // Reset form
    setFeatureType("windows");
    setFeatureName("");
    setFeatureDescription("");
    setFeatureDimensions("");
  };

  const onChangeFeatureType = (e: SelectChangeEvent) => {
    setFeatureType(e.target.value as FeatureType);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureName(e.target.value);
  };

  const onChangeDimensions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureDimensions(e.target.value);
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
            <InputLabel htmlFor="featureTypeList">Feature Type</InputLabel>
            <Select
              labelId="featureTypeList-label"
              id="featureTypeList"
              name="featureTypeList"
              value={featureType}
              label="Feature Type"
              onChange={onChangeFeatureType}
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
            name="title"
            fullWidth
            size="small"
            label="Title"
            value={featureName}
            onChange={onChangeTitle}
            placeholder="e.g., Large Window"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            name="dimensions"
            size="small"
            label={`Dimensions (${measurementUnit})`}
            value={featureDimensions}
            onChange={onChangeDimensions}
            placeholder="e.g., 3x4"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addFeature}
            disabled={!featureName.trim()}
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
        value={featureDescription}
        onChange={(e) => setFeatureDescription(e.target.value)}
        sx={{ mt: 2 }}
        placeholder="Additional details (e.g., Type of window, material, scratched, broken, etc.)"
      />
    </Box>
  );
};

export default AddFeatureForm;
