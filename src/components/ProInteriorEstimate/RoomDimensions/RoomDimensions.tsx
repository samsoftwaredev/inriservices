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
import { RoomData } from "../laborTypes";
import InfoTooltip from "../InfoTooltip";
import {
  calculateArea,
  calculateWallPerimeter,
  numberOfPaintGallons,
} from "../laborCalc";

interface Props {
  measurementUnit: string;
  isEditMode: boolean;
  roomData: RoomData;
  editData: {
    area: string;
    wallPerimeter: string;
    roomHeight: number;
    roomName: string;
    roomDescription?: string;
    floorNumber?: number;
    paintCoats?: number;
  };
  setEditData: React.Dispatch<
    React.SetStateAction<{
      area: string;
      wallPerimeter: string;
      roomHeight: number;
      roomName: string;
      roomDescription?: string;
      floorNumber?: number;
      paintCoats?: number;
    }>
  >;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
}

const RoomDimensions = ({
  measurementUnit,
  isEditMode,
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
    const coats = roomData.paintCoats || editData.paintCoats || 2; // Default to 2 coats
    return baseGallons * coats;
  };

  const getPaintCoatLabel = (coats: number) => {
    const option = paintCoatOptions.find((opt) => opt.value === coats);
    return option?.label || `${coats} Coats`;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Room Dimensions
        <InfoTooltip message="You record a measurement of '3x5' by stating the units and dimensions, most commonly as '3 by 5'. This means the item is 3 units wide by 5 units long." />
      </Typography>
      {isEditMode ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label={`Wall Perimeter (${measurementUnit})`}
              value={editData.wallPerimeter}
              onChange={handleInputChange("wallPerimeter")}
              inputProps={{ min: 0, step: 0.1 }}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Ceiling Area:</strong> {roomData.areaCalculated}{" "}
              {measurementUnit}²
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Floor Area:</strong> {roomData.areaCalculated}{" "}
              {measurementUnit}²
            </Typography>
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
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>
                Wall Perimeter:
                <InfoTooltip message="Enter the length of each wall, separated by a space (e.g., 12.5 14 12.5). If only one number is entered, all walls will be assumed to have that length." />
              </strong>{" "}
              {roomData.wallPerimeterCalculated} {measurementUnit}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Ceiling Area:</strong> {roomData.areaCalculated}{" "}
              {measurementUnit}²
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Floor Area:</strong> {roomData.areaCalculated}{" "}
              {measurementUnit}²
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Room Height:</strong> {roomData.roomHeight}{" "}
              {measurementUnit}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">
              <strong>Paint Coats:</strong>{" "}
              {getPaintCoatLabel(roomData.paintCoats || 2)}
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Paint Calculation Display */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Paint Required:</strong>{" "}
          </Typography>
          <Chip label={`${calculatePaintGallons().toFixed(1)} gallons`} /> =
          {roomData.paintCoats && roomData.paintCoats > 1 && (
            <span>
              {" "}
              (
              <Chip
                label={`${numberOfPaintGallons(
                  roomData.wallPerimeterCalculated
                ).toFixed(1)} gallons`}
              />
              ×
              <Chip label={`${roomData.paintCoats || 2} coats`} /> )
            </span>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default RoomDimensions;
