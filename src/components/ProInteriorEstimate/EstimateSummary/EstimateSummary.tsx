"use client";

import React from "react";

import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { theme } from "@/app/theme";
import { AddBox, Calculate, FormatPaint, Work } from "@mui/icons-material";
import { useGallons } from "@/context/useGallons";
import { useBuilding } from "@/context";
import { calculatePaintGallons, convertToFeet } from "@/tools";

const GallonsBasePaintType = ({ roomFeature }: { roomFeature?: string }) => {
  const { totalGallonsByBasePaint, measurementUnit } = useGallons();
  if (
    !roomFeature ||
    !totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ] ||
    totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ].reduce((acc, curr) => acc + curr.totalPerimeter, 0) === 0
  ) {
    return null;
  }
  return (
    <Typography variant="body2">
      {totalGallonsByBasePaint[
        roomFeature as keyof typeof totalGallonsByBasePaint
      ]?.map(({ paintBase, totalPerimeter }, index) => {
        const isSquared = roomFeature === "ceiling" || roomFeature === "floor";
        const gallons = calculatePaintGallons(
          totalPerimeter,
          1,
          measurementUnit,
          1,
          isSquared
        );
        const feet = convertToFeet(
          totalPerimeter,
          measurementUnit,
          isSquared
        ).toFixed(2);

        return (
          <span key={index}>
            {paintBase}: {gallons}g. ({feet}ft.)
            {index < Object.entries(totalGallonsByBasePaint).length - 1 && ", "}
          </span>
        );
      })}
    </Typography>
  );
};

const hoursRate = 35; // Define the hourly rate here or import it if defined elsewhere
const costGallons = 40; // Define the cost per gallon here or import it if defined elsewhere
const profitMargin = 0.2; // Define the profit margin here or import it if defined elsewhere
const taxAmount = 0.0825; // Define the tax amount here or import it if defined elsewhere

const EstimateSummary = () => {
  const {
    totalGallonsBySection,
    totalGallons,
    mappingNames,
    totalHours,
    totalDays,
  } = useGallons();
  const { buildingData } = useBuilding();
  const totalRooms = buildingData.sections.length;

  const estimateWorkItems = [
    {
      label: "Paint Cost",
      cost: totalGallons * costGallons,
      icon: <FormatPaint />,
    },
    { label: "Labor Cost", cost: totalHours * hoursRate, icon: <Work /> },
    { label: "Materials", cost: 0, icon: <AddBox /> },
  ];
  const totalGallonsBySectionEntries = Object.entries(
    totalGallonsBySection
  ).filter(([, value]) => value > 0);
  const totalEstimate = estimateWorkItems.reduce(
    (acc, item) => acc + item.cost,
    0
  );
  const profitAmount = totalEstimate * profitMargin;
  const totalWithProfit = totalEstimate + profitAmount;
  const taxesToPay = totalWithProfit * taxAmount;
  const totalWithTaxes = totalWithProfit + totalWithProfit * taxAmount;

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
            <Typography variant="h5" display="flex" alignItems="center" gap={1}>
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {item.icon}
              </Box>
              {item.label}
            </Typography>
            <Typography variant="h5">${item.cost.toLocaleString()}</Typography>
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
          <Stack>
            <Typography variant="h4">Total Estimate</Typography>
          </Stack>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="h2">
              $
              {totalWithTaxes.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant="body2">
              Profit $
              {profitAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant="body2">
              Taxes $
              {taxesToPay.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="h5">Approximately Total</Typography>
          <Typography variant="h5">
            {totalHours} | {totalDays} day{totalDays !== 1 ? "s" : ""}
          </Typography>
        </Grid>
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="h5">Rooms</Typography>
          <Typography variant="h5">{totalRooms}</Typography>
        </Grid>
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="h5">Paint Gallons</Typography>
          <Typography variant="h5">{totalGallons}</Typography>
        </Grid>

        <Grid
          size={12}
          display="flex"
          justifyContent="flex-end"
          flexDirection="column"
          textAlign="right"
        >
          {totalGallonsBySectionEntries.map(([key, value], index) => (
            <Box my={1} key={index}>
              <Typography fontWeight="900">
                {mappingNames[key]}: {value} gallons
              </Typography>
              <GallonsBasePaintType roomFeature={key} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EstimateSummary;
