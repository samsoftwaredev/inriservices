"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocationData } from "../laborTypes";

interface Props {
  locationData: LocationData;
  onAddCustomerClick: (anchorEl: HTMLElement) => void;
}

const CustomerHeader = ({ locationData, onAddCustomerClick }: Props) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onAddCustomerClick(event.currentTarget);
  };

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
          Interior Estimate for {locationData.address}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {locationData.city}, {locationData.state} {locationData.zipCode}
        </Typography>
      </Box>

      <IconButton
        color="primary"
        onClick={handleClick}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default CustomerHeader;
