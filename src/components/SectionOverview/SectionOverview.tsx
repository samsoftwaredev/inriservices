"use client";

import React from "react";
import { Box, TextField, Grid, Alert, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ImageUpload from "@/components/ImageUpload";
import { ImageFile } from "@/components/ImageUpload/ImageUpload.model";

interface SectionEstimationData {
  featureName: string;
  featureDescription: string;
}

interface Props {
  section: {
    id: string;
    name: string;
    description: string;
  };
  onSubmit?: (data: SectionEstimationData) => void;
  disabled?: boolean;
  onChangeSectionData: (
    sectionId: string,
    title: string,
    description: string,
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

const SectionEstimation = ({
  section,
  onSubmit,
  onChangeSectionData,
  disabled = false,
  onImagesChange,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SectionEstimationData>({
    mode: "onChange",
    defaultValues: {
      featureName: section?.name || "",
      featureDescription: section?.description || "",
    },
  });

  const handleFormSubmit = (data: SectionEstimationData) => {
    onSubmit?.(data);
    reset(); // Reset form after successful submission
  };

  const formData = watch();

  const onSaveForm = () =>
    onChangeSectionData(
      section.id,
      formData.featureName,
      formData.featureDescription,
    );

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Typography variant="h6" gutterBottom>
        {section.name}
      </Typography>
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

export default SectionEstimation;
