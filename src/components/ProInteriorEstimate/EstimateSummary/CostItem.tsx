"use client";

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export const CostItem = ({
  item,
  isMobile,
}: {
  item: { label: string; cost: number; icon: React.ReactNode };
  isMobile: boolean;
}) => (
  <Grid
    size={12}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    sx={{ px: { xs: 1, sm: 2 }, borderRadius: 4, opacity: 0.9 }}
  >
    <Typography
      variant={isMobile ? "subtitle1" : "h6"}
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        {item.icon}
      </Box>
      {item.label}
    </Typography>
    <Typography variant={isMobile ? "subtitle1" : "h6"}>
      ${item.cost.toLocaleString()}
    </Typography>
  </Grid>
);
