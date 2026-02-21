"use client";

import React from "react";
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import type { VendorType } from "@/types";

interface VendorsFiltersProps {
  searchQuery: string;
  typeFilter: VendorType | "";
  vendorTypes: readonly VendorType[];
  onSearchChange: (query: string) => void;
  onTypeChange: (type: VendorType | "") => void;
}

export default function VendorsFilters({
  searchQuery,
  typeFilter,
  vendorTypes,
  onSearchChange,
  onTypeChange,
}: VendorsFiltersProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6">Table Filters</Typography>
      <Grid
        container
        spacing={2}
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Vendor Type</InputLabel>
            <Select
              value={typeFilter}
              label="Vendor Type"
              onChange={(e) => onTypeChange(e.target.value as VendorType | "")}
            >
              <MenuItem value="">All Types</MenuItem>
              {vendorTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
