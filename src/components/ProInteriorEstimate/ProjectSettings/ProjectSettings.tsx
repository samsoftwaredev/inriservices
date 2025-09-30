"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { LocationData, MeasurementUnit } from "../laborTypes";
import { floorOptions } from "../laborData";

interface Props {
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
}

const ProjectSettings = ({ locationData, setLocationData }: Props) => {
  const measurementUnitList: MeasurementUnit[] = ["ft", "m", "in"];

  const handleMeasurementUnitChange = (
    event: SelectChangeEvent<MeasurementUnit>
  ) => {
    setLocationData({
      ...locationData,
      measurementUnit: event.target.value as MeasurementUnit,
    });
  };

  const handleFloorPlanChange = (event: SelectChangeEvent<number>) => {
    const newFloorCount = event.target.value as number;
    setLocationData({
      ...locationData,
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
    <Grid container spacing={3} sx={{ my: 2 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel id="measurement-unit-label">Measurement Unit</InputLabel>
          <Select
            labelId="measurement-unit-label"
            id="measurement-unit-select"
            value={locationData.measurementUnit}
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
        <FormControl fullWidth>
          <InputLabel id="floor-plan-label">Number of Floors</InputLabel>
          <Select
            labelId="floor-plan-label"
            id="floor-plan-select"
            value={locationData.floorPlan}
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
  );
};

export default ProjectSettings;
