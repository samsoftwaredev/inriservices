"use client";

import React, { useEffect } from "react";
import { Box, TextField, Grid, Alert } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ImageUpload from "@/components/ImageUpload";
import { ImageFile } from "@/components/ImageUpload/ImageUpload.model";
import { PropertyRoomTransformed } from "@/types";

interface RoomFeatureFormData {
  featureName: string;
  featureDescription: string;
}

interface Props {
  room: PropertyRoomTransformed;
  onSubmit?: (data: RoomFeatureFormData) => void;
  disabled?: boolean;
  onChangeRoomData: (
    roomId: string,
    title: string,
    description: string
  ) => void;
  onImagesChange: (images: ImageFile[]) => void;
}

const validationRules = {
  featureName: {
    required: "Feature name is required",
    minLength: {
      value: 2,
      message: "Feature name must be at least 2 characters",
    },
  },
  featureDescription: {},
};

const AddFeatureForm = ({
  room,
  onSubmit,
  onChangeRoomData,
  disabled = false,
  onImagesChange,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RoomFeatureFormData>({
    mode: "onChange",
    defaultValues: {
      featureName: room?.name || "",
      featureDescription: room?.description || "",
    },
  });

  const handleFormSubmit = (data: RoomFeatureFormData) => {
    onSubmit?.(data);
    reset(); // Reset form after successful submission
  };

  const formData = watch();

  const onSaveForm = () =>
    onChangeRoomData(
      room.id,
      formData.featureName,
      formData.featureDescription
    );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ mb: 3, bgcolor: "grey.50", borderRadius: 1, p: 2 }}
    >
      <Box sx={{ mb: 2 }}>
        <ImageUpload onImagesChange={onImagesChange} />
      </Box>

      {/* Display form errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Please fix the errors below before proceeding.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="featureName"
            control={control}
            rules={validationRules.featureName}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                onBlur={onSaveForm}
                fullWidth
                multiline
                minRows={2}
                size="small"
                label="Title / Name of Feature"
                placeholder="e.g., Large Window, Crown Molding, Built-in Shelving"
                error={!!fieldState.error}
                disabled={disabled}
                inputProps={{
                  maxLength: 100,
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="featureDescription"
            control={control}
            rules={validationRules.featureDescription}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                onBlur={onSaveForm}
                multiline
                minRows={4}
                size="small"
                label="Additional Details / Client Notes (Optional)"
                placeholder="Additional details (e.g., Type of window, material, condition, special requirements, etc.)"
                error={!!fieldState.error}
                disabled={disabled}
                inputProps={{
                  maxLength: 500,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddFeatureForm;
