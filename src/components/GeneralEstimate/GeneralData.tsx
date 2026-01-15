"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Paper, TextField, Typography, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays, format } from "date-fns";
import { ProjectFormData } from "@/types";
import { debounce } from "@/tools";

interface Props {
  initialData: {
    name: string;
    startDate: string | null;
    endDate: string | null;
  } | null;
  onFormChange: (data: ProjectFormData) => void;
}

const GeneralData = ({ initialData, onFormChange }: Props) => {
  // Default values
  const defaultProjectName = `Project ${format(new Date(), "MM/dd/yyyy")}`;
  const defaultStartDate = new Date();
  const defaultEndDate = addDays(new Date(), 30); // 30 days from today

  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: initialData?.name || defaultProjectName,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : defaultStartDate,
      endDate: initialData?.endDate
        ? new Date(initialData.endDate)
        : defaultEndDate,
    },
    mode: "onChange",
  });

  // Watch form changes and notify parent
  const formData = watch();

  const onSaveForm = () => onFormChange(formData);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Project Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Project name is required",
                  minLength: {
                    value: 3,
                    message: "Project name must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Project Name"
                    placeholder="Enter project name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="outlined"
                    onBlur={onSaveForm}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: "Start date is required",
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                    onChange={(date) => {
                      field.onChange(date);
                      onSaveForm();
                      // Auto-adjust end date if start date is after end date
                      const currentEndDate = watch("endDate");
                      if (date && currentEndDate && date > currentEndDate) {
                        setValue("endDate", addDays(date, 30));
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "End date is required",
                  validate: (value) => {
                    const startDate = watch("startDate");
                    if (startDate && value && value <= startDate) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="End Date"
                    minDate={watch("startDate") || undefined}
                    onChange={(date) => {
                      field.onChange(date);
                      onSaveForm();
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                        onBlur: onSaveForm,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default GeneralData;
