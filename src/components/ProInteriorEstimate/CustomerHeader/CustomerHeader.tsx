"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocationData } from "../laborTypes";
import { theme } from "@/app/theme";

interface Props {
  onAddCustomerClick: (anchorEl: HTMLElement) => void;
}

const CustomerHeader = ({ onAddCustomerClick }: Props) => {
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
          Edit Estimate
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Fill in the details to generate a professional quote
        </Typography>
      </Box>

      <IconButton
        color="primary"
        onClick={handleClick}
        sx={{
          background: theme.palette.gradient.subtle,
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
