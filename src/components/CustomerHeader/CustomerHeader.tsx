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
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "flex-start", sm: "space-between" },
        alignItems: { xs: "stretch", sm: "flex-start" },
        gap: { xs: 2, sm: 0 },
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1, mb: { xs: 1, sm: 0 } }}>
        <Typography variant="h4" gutterBottom>
          {headerName}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {headerDescription}
        </Typography>
      </Box>
      <Box sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>
        {children}
      </Box>
    </Box>
  );
};

export default CustomerHeader;
