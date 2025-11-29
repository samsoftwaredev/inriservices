"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";

export const SubtotalRow = ({
  subtotal,
  isMobile,
}: {
  subtotal: number;
  isMobile: boolean;
}) => (
  <Grid
    size={12}
    display="flex"
    justifyContent="space-between"
    sx={{ px: { xs: 1, sm: 2 }, py: 1, opacity: 0.8 }}
  >
    <Typography variant={isMobile ? "body1" : "h6"} fontWeight="300">
      Subtotal
    </Typography>
    <Typography variant={isMobile ? "body1" : "h6"} fontWeight="300">
      ${subtotal.toLocaleString()}
    </Typography>
  </Grid>
);
