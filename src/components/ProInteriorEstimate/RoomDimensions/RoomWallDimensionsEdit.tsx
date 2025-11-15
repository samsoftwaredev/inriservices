"use client";

import React from "react";
import {
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import { RoomData, RoomDimensionsOverview } from "../laborTypes";
import {
  calculateArea,
  calculateWallPerimeter,
  numberOfPaintGallons,
} from "../laborCalc";

interface Props {
  measurementUnit: string;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
  setEditData: React.Dispatch<React.SetStateAction<RoomDimensionsOverview>>;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
}

const RoomDimensionsEdit = ({
  measurementUnit,
  roomData,
  editData,
  setEditData,
  setRoomData,
}: Props) => {
  const paintCoatOptions = [
    { value: 1, label: "1 Coat" },
    { value: 2, label: "2 Coats (Standard)" },
    { value: 3, label: "3 Coats (Premium)" },
    { value: 4, label: "4 Coats (High Coverage)" },
  ];

  const handleInputChange =
    (field: keyof typeof editData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      const area = calculateArea(editData.wallPerimeter);

      if (field === "wallPerimeter") {
        const perimeter = calculateWallPerimeter(
          editData.wallPerimeter,
          roomData.roomHeight
        );
        setEditData({
          ...editData,
          wallPerimeter: event.target.value,
        });
        setRoomData({
          ...roomData,
          wallPerimeterCalculated: perimeter,
          areaCalculated: area,
        });
      } else if (field === "roomHeight") {
        const perimeter = calculateWallPerimeter(editData.wallPerimeter, value);
        setEditData({
          ...editData,
          roomHeight: value,
        });
        setRoomData({
          ...roomData,
          wallPerimeterCalculated: perimeter,
        });
      }
    };

  const handlePaintCoatsChange = (event: SelectChangeEvent<number>) => {
    const coats = event.target.value as number;
    setEditData({
      ...editData,
      paintCoats: coats,
    });
    setRoomData({
      ...roomData,
      paintCoats: coats,
    });
  };

  const calculatePaintGallons = () => {
    const baseGallons = numberOfPaintGallons(roomData.wallPerimeterCalculated);
    const coats = roomData.paintCoats || editData.paintCoats || 2;
    return baseGallons * coats;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label={`Wall Perimeter (${measurementUnit})`}
            value={editData.wallPerimeter}
            onChange={handleInputChange("wallPerimeter")}
            inputProps={{ min: 0, step: 0.1 }}
            size="small"
            helperText="Enter wall lengths separated by spaces"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label={`Room Height (${measurementUnit})`}
            type="number"
            value={editData.roomHeight}
            onChange={handleInputChange("roomHeight")}
            inputProps={{ min: 0, step: 0.1 }}
            size="small"
            helperText="Standard ceiling height is 8-10 ft"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Paint Coats</InputLabel>
            <Select
              value={editData.paintCoats || roomData.paintCoats || 2}
              label="Paint Coats"
              onChange={handlePaintCoatsChange}
            >
              {paintCoatOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body1"
            sx={{ p: 1, bgcolor: "grey.50", borderRadius: 1 }}
          >
            <strong>Ceiling Area:</strong> {roomData.areaCalculated || 0}{" "}
            {measurementUnit}²
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body1"
            sx={{ p: 1, bgcolor: "grey.50", borderRadius: 1 }}
          >
            <strong>Floor Area:</strong> {roomData.areaCalculated || 0}{" "}
            {measurementUnit}²
          </Typography>
        </Grid>
      </Grid>

      {/* Paint Calculation Display */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Paint Required Calculation:</strong>
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${calculatePaintGallons().toFixed(1)} gallons`}
              color="primary"
              variant="filled"
            />
            {(roomData.paintCoats || editData.paintCoats || 2) > 1 && (
              <>
                <span>=</span>
                <Chip
                  label={`${numberOfPaintGallons(
                    roomData.wallPerimeterCalculated || 0
                  ).toFixed(1)} gallons`}
                  size="small"
                  variant="outlined"
                />
                <span>×</span>
                <Chip
                  label={`${
                    roomData.paintCoats || editData.paintCoats || 2
                  } coats`}
                  size="small"
                  variant="outlined"
                />
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomDimensionsEdit;
