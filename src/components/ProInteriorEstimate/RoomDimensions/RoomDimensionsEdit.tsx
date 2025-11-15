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
} from "@mui/material";
import {
  MeasurementUnit,
  RoomData,
  RoomDimensionsOverview,
} from "../../../interfaces/laborTypes";
import { calculateArea, calculatePerimeter } from "../laborCalc";
import GallonsCalc from "./GallonsCalc";

interface Props {
  measurementUnit: MeasurementUnit;
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
        const perimeter = calculatePerimeter(
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
      }
      if (field === "baseboardPerimeter") {
        const perimeter = calculatePerimeter(
          editData.baseboardPerimeter,
          roomData.baseboardHeight
        );
        setEditData({
          ...editData,
          baseboardPerimeter: event.target.value,
        });
        setRoomData({
          ...roomData,
          baseboardPerimeterCalculated: perimeter,
        });
      } else if (field === "baseboardHeight") {
        const perimeter = calculatePerimeter(editData.wallPerimeter, value);
        setEditData({
          ...editData,
          baseboardHeight: value,
        });
        setRoomData({
          ...roomData,
          baseboardPerimeterCalculated: perimeter,
        });
      } else if (field === "roomHeight") {
        const perimeter = calculatePerimeter(editData.wallPerimeter, value);
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
      wallPaintCoats: coats,
    });
    setRoomData({
      ...roomData,
      wallPaintCoats: coats,
    });
  };

  const handleBaseboardPaintCoatsChange = (
    event: SelectChangeEvent<number>
  ) => {
    const coats = event.target.value as number;
    setEditData({
      ...editData,
      baseboardPaintCoats: coats,
    });
    setRoomData({
      ...roomData,
      baseboardPaintCoats: coats,
    });
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
              value={editData.wallPaintCoats || roomData.wallPaintCoats || 2}
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

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label={`Baseboard Perimeter (${measurementUnit})`}
            value={editData.baseboardPerimeter}
            onChange={handleInputChange("baseboardPerimeter")}
            inputProps={{ min: 0, step: 0.1 }}
            size="small"
            helperText="Enter baseboard lengths separated by spaces"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label={`Baseboard Height (${measurementUnit})`}
            value={editData.baseboardHeight}
            onChange={handleInputChange("baseboardHeight")}
            inputProps={{ min: 0, step: 0.1 }}
            size="small"
            helperText="Enter baseboard height"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Baseboard Paint Coats</InputLabel>
            <Select
              value={
                editData.baseboardPaintCoats ||
                roomData.baseboardPaintCoats ||
                2
              }
              label="Baseboard Paint Coats"
              onChange={handleBaseboardPaintCoatsChange}
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
      <GallonsCalc
        roomData={roomData}
        editData={editData}
        measurementUnit={measurementUnit}
      />
    </>
  );
};

export default RoomDimensionsEdit;
