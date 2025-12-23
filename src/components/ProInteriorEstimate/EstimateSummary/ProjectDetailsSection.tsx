"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";

export const ProjectDetailsSection = ({
  totalHours,
  totalDays,
  totalRooms,
  totalGallons,
  isMobile,
}: {
  totalHours: number;
  totalDays: number;
  totalRooms: number;
  totalGallons: number;
  isMobile: boolean;
}) => (
  <>
    <Grid size={12} display="flex" justifyContent="space-between">
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        Approximate Time
      </Typography>
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        {totalHours} hrs | {totalDays} day{totalDays !== 1 ? "s" : ""}
      </Typography>
    </Grid>

    <Grid size={12} display="flex" justifyContent="space-between">
      <Typography variant={isMobile ? "subtitle1" : "h6"}>Rooms</Typography>
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        {totalRooms}
      </Typography>
    </Grid>

    <Grid size={12} display="flex" justifyContent="space-between">
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        Paint Gallons
      </Typography>
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        {totalGallons}
      </Typography>
    </Grid>
  </>
);
