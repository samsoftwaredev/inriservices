"use client";

import React from "react";
import { Typography, Grid, Chip } from "@mui/material";
import { numberOfPaintGallons } from "../laborCalc";
import {
  MeasurementUnit,
  RoomData,
  RoomDimensionsOverview,
} from "../../../interfaces/laborTypes";
import { convertMeasurement } from "@/tools/convertMeasurement";

interface Props {
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
}

const GallonsCalc = ({ roomData, editData, measurementUnit }: Props) => {
  const calculatePaintGallons = (
    perimeter: number | string,
    coatsFromRoomData: number | undefined,
    coatsFromEditData: number | undefined,
    defaultCoats: number = 2
  ) => {
    const convertedPerimeter = convertMeasurement(
      typeof perimeter === "string" ? parseFloat(perimeter) : perimeter,
      measurementUnit,
      "ft"
    );
    const baseGallons = numberOfPaintGallons(convertedPerimeter);
    const coats = coatsFromRoomData || coatsFromEditData || defaultCoats;
    return { gallons: baseGallons * coats, coats };
  };

  const allGallons = [
    calculatePaintGallons(
      roomData.wallPerimeterCalculated,
      roomData.wallPaintCoats,
      editData.wallPaintCoats
    ),
    calculatePaintGallons(
      roomData.baseboardPerimeterCalculated,
      roomData.baseboardPaintCoats,
      editData.baseboardPaintCoats
    ),
  ];

  const totalPaintGallons = allGallons.reduce(
    (acc, val) => acc + val.gallons,
    0
  );

  return (
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
            label={`${totalPaintGallons} gallons`}
            color="primary"
            variant="filled"
          />
          <span>=</span>
          {allGallons.map((feature, index) => (
            <>
              (
              <Chip
                label={`${feature.gallons.toFixed(1)} gallons`}
                size="small"
                variant="outlined"
              />
              <span>×</span>
              <Chip
                label={`${feature.coats} coats`}
                size="small"
                variant="outlined"
              />
              ){index < allGallons.length - 1 && <span> + </span>}
            </>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default GallonsCalc;
