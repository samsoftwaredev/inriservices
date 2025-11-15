"use client";

import React from "react";
import { Typography, Grid, Chip } from "@mui/material";
import { RoomData } from "../laborTypes";
import InfoTooltip from "../InfoTooltip";
import { numberOfPaintGallons } from "../laborCalc";

interface Props {
  measurementUnit: string;
  roomData: RoomData;
}

const RoomWallDimensionsDisplay = ({ measurementUnit, roomData }: Props) => {
  const paintCoatOptions = [
    { value: 1, label: "1 Coat" },
    { value: 2, label: "2 Coats (Standard)" },
    { value: 3, label: "3 Coats (Premium)" },
    { value: 4, label: "4 Coats (High Coverage)" },
  ];

  const getPaintCoatLabel = (coats: number) => {
    const option = paintCoatOptions.find((opt) => opt.value === coats);
    return option?.label || `${coats} Coats`;
  };

  const calculatePaintGallons = () => {
    const baseGallons = numberOfPaintGallons(
      roomData.wallPerimeterCalculated || 0
    );
    const coats = roomData.paintCoats || 2;
    return baseGallons * coats;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Wall Perimeter
              <InfoTooltip message="Total perimeter calculated from wall measurements. Enter wall lengths separated by spaces for accurate calculations." />
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {roomData.wallPerimeterCalculated || 0} {measurementUnit}
            </Typography>
          </div>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Room Height
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {roomData.roomHeight || 0} {measurementUnit}
            </Typography>
          </div>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Paint Coats
            </Typography>
            <Chip
              label={getPaintCoatLabel(roomData.paintCoats || 2)}
              color="primary"
              variant="outlined"
            />
          </div>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ceiling Area
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {roomData.areaCalculated || 0} {measurementUnit}²
            </Typography>
          </div>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Floor Area
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {roomData.areaCalculated || 0} {measurementUnit}²
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* Paint Calculation Display */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff3e0",
              borderRadius: "8px",
              border: "1px solid #ffcc02",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Paint Requirements
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total needed:
              </Typography>
              <Chip
                label={`${calculatePaintGallons().toFixed(1)} gallons`}
                color="warning"
                variant="filled"
                sx={{ fontWeight: "bold" }}
              />
              {(roomData.paintCoats || 2) > 1 && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    =
                  </Typography>
                  <Chip
                    label={`${numberOfPaintGallons(
                      roomData.wallPerimeterCalculated || 0
                    ).toFixed(1)} gallons`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    ×
                  </Typography>
                  <Chip
                    label={`${roomData.paintCoats || 2} coats`}
                    size="small"
                    variant="outlined"
                  />
                </>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomWallDimensionsDisplay;
