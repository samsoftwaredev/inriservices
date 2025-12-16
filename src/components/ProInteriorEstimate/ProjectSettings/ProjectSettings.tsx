"use client";

import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TextField,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  Customer,
  LocationData,
  MeasurementUnit,
} from "@/interfaces/laborTypes";
import { floorOptions } from "@/constants/laborData";
import { usa_states } from "@/constants";
import { useBuilding } from "@/context";

interface Props {
  currentCustomer: Customer;
  onCustomerUpdate: (customer: Customer) => void;
  setBuildingData: React.Dispatch<React.SetStateAction<LocationData>>;
}

// Form data interface for react-hook-form
interface ProjectFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerContact: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  measurementUnit: MeasurementUnit;
  floorPlan: number;
}

// Validation rules
const validationRules = {
  customerName: {
    required: "Customer name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
  },
  customerEmail: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  },
  customerPhone: {
    required: "Phone number is required",
    pattern: {
      value: /^[\+]?[(]?[0-9\s\-\(\)]{10,}$/,
      message: "Please enter a valid phone number (at least 10 digits)",
    },
  },
  customerContact: {
    required: "Contact information is required",
    minLength: {
      value: 2,
      message: "Contact must be at least 2 characters",
    },
  },
  address: {
    required: "Address is required",
    minLength: {
      value: 5,
      message: "Address must be at least 5 characters",
    },
  },
  city: {
    required: "City is required",
    minLength: {
      value: 2,
      message: "City must be at least 2 characters",
    },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message:
        "City can only contain letters, spaces, hyphens, and apostrophes",
    },
  },
  state: {
    required: "State is required",
  },
  zipCode: {
    required: "ZIP code is required",
    pattern: {
      value: /^\d{5}(-\d{4})?$/,
      message: "Please enter a valid ZIP code (12345 or 12345-6789)",
    },
  },
  measurementUnit: {
    required: "Measurement unit is required",
  },
  floorPlan: {
    required: "Number of floors is required",
  },
};

const ProjectSettings = ({
  setBuildingData,
  currentCustomer,
  onCustomerUpdate,
}: Props) => {
  const { buildingData } = useBuilding();

  // Initialize react-hook-form with default values
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ProjectFormData>({
    mode: "onChange", // Validate on every change
    defaultValues: {
      customerName: currentCustomer.name || "",
      customerEmail: currentCustomer.email || "",
      customerPhone: currentCustomer.phone || "",
      customerContact: currentCustomer.contact || "",
      address: buildingData.address || "",
      city: buildingData.city || "",
      state: buildingData.state || "",
      zipCode: buildingData.zipCode || "",
      measurementUnit: buildingData.measurementUnit || "ft",
      floorPlan: buildingData.floorPlan || 1,
    },
  });

  // Watch all form values to trigger updates
  const watchedValues = watch();

  // Update parent components when form values change
  useEffect(() => {
    if (isDirty && isValid) {
      // Update customer data
      const updatedCustomer: Customer = {
        ...currentCustomer, // Preserve existing id and buildings
        name: watchedValues.customerName,
        email: watchedValues.customerEmail,
        phone: watchedValues.customerPhone,
        contact: watchedValues.customerContact,
      };
      onCustomerUpdate(updatedCustomer);

      // Update building data
      const updatedBuildingData: LocationData = {
        ...buildingData,
        address: watchedValues.address,
        city: watchedValues.city,
        state: watchedValues.state,
        zipCode: watchedValues.zipCode,
        measurementUnit: watchedValues.measurementUnit,
        floorPlan: watchedValues.floorPlan,
      };
      setBuildingData(updatedBuildingData);
    }
  }, [
    watchedValues,
    isDirty,
    isValid,
    onCustomerUpdate,
    setBuildingData,
    buildingData,
    currentCustomer,
  ]);

  // Update form when external props change
  useEffect(() => {
    reset({
      customerName: currentCustomer.name || "",
      customerEmail: currentCustomer.email || "",
      customerPhone: currentCustomer.phone || "",
      customerContact: currentCustomer.contact || "",
      address: buildingData.address || "",
      city: buildingData.city || "",
      state: buildingData.state || "",
      zipCode: buildingData.zipCode || "",
      measurementUnit: buildingData.measurementUnit || "ft",
      floorPlan: buildingData.floorPlan || 1,
    });
  }, [currentCustomer, buildingData, reset]);

  // Helper function to get measurement unit label
  const getMeasurementUnitLabel = (unit: MeasurementUnit): string => {
    switch (unit) {
      case "ft":
        return "Feet (ft)";
      case "m":
        return "Meters (m)";
      case "in":
        return "Inches (in)";
      default:
        return unit;
    }
  };

  // Helper function to get floor label
  const getFloorLabel = (floorCount: number): string => {
    return floorCount === 1 ? "1 Floor" : `${floorCount} Floors`;
  };

  const measurementUnitList: MeasurementUnit[] = ["ft", "m", "in"];

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
      {/* Customer Information Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Customer Information
        </Typography>

        <Grid container spacing={2}>
          {/* Customer Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerName"
              control={control}
              rules={validationRules.customerName}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Customer Name"
                  size="small"
                  placeholder="Enter customer name"
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                />
              )}
            />
          </Grid>

          {/* Customer Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerEmail"
              control={control}
              rules={validationRules.customerEmail}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  size="small"
                  placeholder="customer@example.com"
                  type="email"
                  error={!!errors.customerEmail}
                  helperText={errors.customerEmail?.message}
                />
              )}
            />
          </Grid>

          {/* Customer Phone */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerPhone"
              control={control}
              rules={validationRules.customerPhone}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  size="small"
                  placeholder="(555) 123-4567"
                  type="tel"
                  error={!!errors.customerPhone}
                  helperText={errors.customerPhone?.message}
                />
              )}
            />
          </Grid>

          {/* Customer Contact */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerContact"
              control={control}
              rules={validationRules.customerContact}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Contact Method"
                  size="small"
                  placeholder="Preferred contact method"
                  error={!!errors.customerContact}
                  helperText={errors.customerContact?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Project Location Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Project Location
        </Typography>

        <Grid container spacing={2}>
          {/* Address - Full width */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              rules={validationRules.address}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Project Address"
                  size="small"
                  placeholder="Enter the project street address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* City, State, ZIP Row */}
          <Grid size={{ xs: 12, sm: 5 }}>
            <Controller
              name="city"
              control={control}
              rules={validationRules.city}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="City"
                  size="small"
                  placeholder="Enter city"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="state"
              control={control}
              rules={validationRules.state}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.state}>
                  <InputLabel id="state-select-label">State</InputLabel>
                  <Select
                    {...field}
                    labelId="state-select-label"
                    id="state-select"
                    label="State"
                  >
                    {usa_states.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.value} - {state.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.state && (
                    <FormHelperText>{errors.state.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="zipCode"
              control={control}
              rules={validationRules.zipCode}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ZIP Code"
                  size="small"
                  placeholder="12345"
                  inputProps={{ maxLength: 10 }}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Project Settings Section */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Project Settings
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="measurementUnit"
              control={control}
              rules={validationRules.measurementUnit}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.measurementUnit}
                >
                  <InputLabel id="measurement-unit-label">
                    Measurement Unit
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="measurement-unit-label"
                    id="measurement-unit-select"
                    label="Measurement Unit"
                  >
                    {measurementUnitList.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {getMeasurementUnitLabel(unit)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.measurementUnit && (
                    <FormHelperText>
                      {errors.measurementUnit.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="floorPlan"
              control={control}
              rules={validationRules.floorPlan}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.floorPlan}>
                  <InputLabel id="floor-plan-label">
                    Number of Floors
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="floor-plan-label"
                    id="floor-plan-select"
                    label="Number of Floors"
                  >
                    {floorOptions.map((floorCount) => (
                      <MenuItem key={floorCount} value={floorCount}>
                        {getFloorLabel(floorCount)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.floorPlan && (
                    <FormHelperText>{errors.floorPlan.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProjectSettings;
