"use client";

import React from "react";
import { Box, TextField, Grid, Alert } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ImageUpload from "@/components/ImageUpload";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface RoomFeatureFormData {
  featureName: string;
  featureDescription: string;
}

interface Props {
  onSubmit?: (data: RoomFeatureFormData) => void;
  defaultValues?: Partial<RoomFeatureFormData>;
  disabled?: boolean;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

const validationRules = {
  featureName: {
    required: "Feature name is required",
    minLength: {
      value: 2,
      message: "Feature name must be at least 2 characters",
    },
    maxLength: {
      value: 100,
      message: "Feature name must not exceed 100 characters",
    },
    pattern: {
      value: /^[a-zA-Z0-9\s\-_.,()]+$/,
      message:
        "Feature name can only contain letters, numbers, spaces, and basic punctuation",
    },
  },
  featureDescription: {
    maxLength: {
      value: 1000,
      message: "Description must not exceed 1000 characters",
    },
  },
};

const AddFeatureForm = ({
  onSubmit,
  defaultValues,
  disabled = false,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm<RoomFeatureFormData>({
    mode: "onChange",
    defaultValues: {
      featureName: defaultValues?.featureName || "",
      featureDescription: defaultValues?.featureDescription || "",
    },
  });

  const handleFormSubmit = (data: RoomFeatureFormData) => {
    onSubmit?.(data);
    reset(); // Reset form after successful submission
  };

  const featureNameValue = watch("featureName");
  const featureDescriptionValue = watch("featureDescription");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ mb: 3, bgcolor: "grey.50", borderRadius: 1, p: 2 }}
    >
      <Box sx={{ mb: 2 }}>
        <ImageUpload />
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
                fullWidth
                multiline
                minRows={2}
                size="small"
                label="Title / Name of Feature"
                placeholder="e.g., Large Window, Crown Molding, Built-in Shelving"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ||
                  `${featureNameValue.length}/100 characters`
                }
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
                multiline
                minRows={4}
                size="small"
                label="Additional Details / Client Notes (Optional)"
                placeholder="Additional details (e.g., Type of window, material, condition, special requirements, etc.)"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ||
                  `${featureDescriptionValue.length}/500 characters (Optional)`
                }
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
