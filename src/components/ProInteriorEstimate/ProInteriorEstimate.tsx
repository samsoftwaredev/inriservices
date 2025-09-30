"use client";

import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Room from "./Room";
import { floorOptions } from "./laborData";

type MeasurementUnit = "ft" | "m" | "in";

interface Section {
  id: string;
  name: string;
  description: string;
  floorNumber: number;
}

interface LocationData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  measurementUnit: MeasurementUnit;
  floorPlan: number;
  sections: Section[];
}

const ProInteriorEstimate = () => {
  const measurementUnitList: MeasurementUnit[] = ["ft", "m", "in"];

  const [locationData, setLocationData] = useState<LocationData>({
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    measurementUnit: "ft",
    floorPlan: 1,
    sections: [
      {
        id: "1",
        name: "Living Room",
        description: "Spacious living area",
        floorNumber: 1,
      },
      {
        id: "2",
        name: "Kitchen",
        description: "Modern kitchen area",
        floorNumber: 1,
      },
    ],
  });

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

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(), // Simple ID generation
      name: `Room ${locationData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setLocationData({
      ...locationData,
      sections: [...locationData.sections, newSection],
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

  const onRoomUpdate = (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {
    setLocationData((prevData) => {
      const updatedSections = prevData.sections.map((section) =>
        section.id === updates.id
          ? {
              ...section,
              name: updates.roomName,
              description: updates.roomDescription,
              floorNumber: updates.floorNumber,
            }
          : section
      );
      return {
        ...prevData,
        sections: updatedSections,
      };
    });
  };

  const getFloorLabel = (floorCount: number): string => {
    return floorCount === 1 ? "1 Floor" : `${floorCount} Floors`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interior Estimate for {locationData.address}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        {locationData.city}, {locationData.state} {locationData.zipCode}
      </Typography>

      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="measurement-unit-label">
              Measurement Unit
            </InputLabel>
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

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Work Sections</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewSection}
          sx={{ ml: 2 }}
        >
          Add Section
        </Button>
      </Box>

      {locationData.sections.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No sections added yet.
        </Typography>
      )}

      {locationData.sections.map((section) => (
        <Box key={section.id} sx={{ mb: 2 }}>
          <Room
            onRoomUpdate={onRoomUpdate}
            roomName={section.name}
            roomDescription={section.description}
            measurementUnit={locationData.measurementUnit}
            floorNumber={section.floorNumber}
            id={section.id}
          />
        </Box>
      ))}

      {/* Alternative: Floating Action Button */}
      {/* 
      <Fab
        color="primary"
        aria-label="add section"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={addNewSection}
      >
        <AddIcon />
      </Fab>
      */}
    </Box>
  );
};

export default ProInteriorEstimate;
