"use client";

import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Paper,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import {
  Customer,
  LocationData,
  MeasurementUnit,
} from "@/interfaces/laborTypes";
import { floorOptions } from "../laborData";
import { usa_states } from "@/constants";

interface Props {
  currentCustomer: Customer;
  onCustomerUpdate: (customer: Customer) => void;
  buildingData: LocationData;
  setBuildingData: React.Dispatch<React.SetStateAction<LocationData>>;
}

const ProjectSettings = ({
  buildingData,
  setBuildingData,
  currentCustomer,
  onCustomerUpdate,
}: Props) => {
  const measurementUnitList: MeasurementUnit[] = ["ft", "m", "in"];
  const [editData, setEditData] = useState<Customer>({ ...currentCustomer });

  const handleInputChange =
    (field: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditData({
        ...editData,
        [field]: event.target.value,
      });

      // Update the parent component immediately
      onCustomerUpdate({
        ...editData,
        [field]: event.target.value,
      });
    };

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const updatedCustomer = {
      ...editData,
      state: event.target.value,
    };
    setEditData(updatedCustomer);
    onCustomerUpdate(updatedCustomer);
  };

  const handleMeasurementUnitChange = (
    event: SelectChangeEvent<MeasurementUnit>
  ) => {
    setBuildingData({
      ...buildingData,
      measurementUnit: event.target.value as MeasurementUnit,
    });
  };

  const handleFloorPlanChange = (event: SelectChangeEvent<number>) => {
    const newFloorCount = event.target.value as number;
    setBuildingData({
      ...buildingData,
      floorPlan: newFloorCount,
    });
  };

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

  const getFloorLabel = (floorCount: number): string => {
    return floorCount === 1 ? "1 Floor" : `${floorCount} Floors`;
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
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
            <TextField
              fullWidth
              label="Project Address"
              value={editData.address}
              onChange={handleInputChange("address")}
              size="small"
              placeholder="Enter the project street address"
            />
          </Grid>

          {/* City, State, ZIP Row */}
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              label="City"
              value={editData.city}
              onChange={handleInputChange("city")}
              size="small"
              placeholder="Enter city"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="state-select-label">State</InputLabel>
              <Select
                labelId="state-select-label"
                id="state-select"
                value={editData.state}
                label="State"
                onChange={handleStateChange}
              >
                {usa_states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.value} - {state.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={editData.zipCode}
              onChange={handleInputChange("zipCode")}
              size="small"
              placeholder="12345"
              inputProps={{ maxLength: 10 }}
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
            <FormControl fullWidth size="small">
              <InputLabel id="measurement-unit-label">
                Measurement Unit
              </InputLabel>
              <Select
                labelId="measurement-unit-label"
                id="measurement-unit-select"
                value={buildingData.measurementUnit}
                label="Measurement Unit"
                onChange={handleMeasurementUnitChange}
              >
                {measurementUnitList.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {getMeasurementUnitLabel(unit)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="floor-plan-label">Number of Floors</InputLabel>
              <Select
                labelId="floor-plan-label"
                id="floor-plan-select"
                value={buildingData.floorPlan}
                label="Number of Floors"
                onChange={handleFloorPlanChange}
              >
                {floorOptions.map((floorCount) => (
                  <MenuItem key={floorCount} value={floorCount}>
                    {getFloorLabel(floorCount)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProjectSettings;
