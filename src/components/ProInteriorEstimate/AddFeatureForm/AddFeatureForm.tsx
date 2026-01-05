"use client";

import React, { useState } from "react";
import {
  Box,
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
import { FeatureType, RoomFeature } from "@/interfaces/laborTypes";
import { featureTypes } from "@/constants/laborData";
import ImageUpload from "@/components/ImageUpload";
import { uuidv4 } from "@/tools/general";
import { useRoom } from "@/context/RoomContext";

interface Props {
  roomId: string;
}

const AddFeatureForm = ({ roomId }: Props) => {
  const { roomData, updateRoom } = useRoom();
  const [featureType, setFeatureType] = useState<FeatureType>("windows");
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");

  const addFeature = () => {
    if (!featureName.trim()) return;

    const feature: RoomFeature = {
      id: `${roomId}-${uuidv4()}`,
      type: featureType,
      name: featureName,
      description: featureDescription,
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
  };

  const onChangeFeatureType = (e: SelectChangeEvent) => {
    setFeatureType(e.target.value as FeatureType);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureName(e.target.value);
  };

  return (
    <Box sx={{ mb: 3, bgcolor: "grey.50", borderRadius: 1 }}>
      <Box sx={{ mb: 2 }}>
        <ImageUpload />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
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
        <Grid size={{ xs: 12, sm: 6, md: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
          <TextField
            name="title"
            fullWidth
            size="small"
            label="Summary Title"
            value={featureName}
            onChange={onChangeTitle}
            placeholder="e.g., Large Window"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 2 }} sx={{ order: { xs: 4, md: 3 } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addFeature}
            disabled={!featureName.trim()}
            sx={{ width: "100%" }}
          >
            Add
          </Button>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 12 }}
          sx={{ order: { xs: 3, md: 4 } }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            label="Additional Details / Client Notes (Optional)"
            value={featureDescription}
            onChange={(e) => setFeatureDescription(e.target.value)}
            placeholder="Additional details (e.g., Type of window, material, scratched, broken, etc.)"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddFeatureForm;
