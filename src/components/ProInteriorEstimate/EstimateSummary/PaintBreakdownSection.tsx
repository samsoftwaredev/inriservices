"use client";

import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GallonsBasePaintType } from "./GallonsBasePaintType";

export const PaintBreakdownSection = ({
  totalGallonsBySectionEntries,
  mappingNames,
  isMobile,
}: {
  totalGallonsBySectionEntries: Array<[string, number]>;
  mappingNames: Record<string, string>;
  isMobile: boolean;
}) => (
  <Grid
    size={12}
    display="flex"
    justifyContent="flex-end"
    flexDirection="column"
    textAlign="right"
  >
    {totalGallonsBySectionEntries.map(([key, value], index) => (
      <Box my={1} key={index}>
        <Typography fontWeight="900" variant={isMobile ? "body2" : "body1"}>
          {mappingNames[key]}: {value} gallons
        </Typography>
        <GallonsBasePaintType roomFeature={key} />
      </Box>
    ))}
  </Grid>
);
