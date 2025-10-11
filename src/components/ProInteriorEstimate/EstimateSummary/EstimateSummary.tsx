"use client";

import React from "react";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { theme } from "@/app/theme";
import {
  AddBox,
  Calculate,
  FormatColorFill,
  FormatPaint,
  Work,
} from "@mui/icons-material";

interface Props {}

const EstimateSummary = ({}: Props) => {
  const numberOfPaintGallons = {
    label: "Paint (gallons)",
    value: 120,
    icon: <FormatColorFill />,
  };

  const estimateWorkItems = [
    { label: "Paint Cost", cost: 350, icon: <FormatPaint /> },
    { label: "Labor Cost", cost: 350, icon: <Work /> },
    { label: "Materials", cost: 350, icon: <AddBox /> },
  ];

  const totalEstimate = estimateWorkItems.reduce(
    (acc, item) => acc + item.cost,
    0
  );
  const totalHours = "36 hrs";
  const totalPaintGallons = numberOfPaintGallons.value;
  const totalRooms = "3";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        background: theme.palette.gradient.colorful,
        color: theme.palette.common.white,
        mb: 2,
      }}
    >
      <Box display={"flex"} alignItems="center" mb={1} gap={1}>
        <Calculate />
        <Typography variant="h5">Estimate Summary</Typography>
      </Box>

      <Divider sx={{ my: 1, bgcolor: "white" }} />

      <Grid container spacing={2}>
        {estimateWorkItems.map((item, index) => (
          <Grid
            key={index}
            size={12}
            display="flex"
            justifyContent="space-between"
            sx={{ px: 2, borderRadius: 4, opacity: 0.9 }}
          >
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {item.icon}
              </Box>
              {item.label}
            </Typography>
            <Typography variant="h6">${item.cost.toLocaleString()}</Typography>
          </Grid>
        ))}

        <Divider sx={{ my: 1, bgcolor: "white" }} />

        <Grid
          size={12}
          display="flex"
          bgcolor="primary.light"
          justifyContent="space-between"
          sx={{ px: 1, py: 2, borderRadius: 4, opacity: 0.9 }}
        >
          <Typography variant="h4">Total Estimate</Typography>
          <Typography variant="h2">
            ${totalEstimate.toLocaleString()}
          </Typography>
        </Grid>

        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="body2">Approximately Total Hours</Typography>
          <Typography variant="body2">{totalHours}</Typography>
        </Grid>
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="body2">Paint Gallons</Typography>
          <Typography variant="body2">{totalPaintGallons}</Typography>
        </Grid>
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="body2">Rooms</Typography>
          <Typography variant="body2">{totalRooms}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EstimateSummary;
