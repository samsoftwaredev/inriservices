"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  headerName: string;
  headerDescription?: string;
  children?: React.ReactNode;
}

const CustomerHeader = ({
  headerName,
  headerDescription = "",
  children = null,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          {headerName}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {headerDescription}
        </Typography>
      </Box>

      {children}
    </Box>
  );
};

export default CustomerHeader;
