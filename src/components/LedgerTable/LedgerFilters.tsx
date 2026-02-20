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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import type { Accounts, Vendor } from "@/types";

interface LedgerFiltersProps {
  selectedYear: number;
  selectedAccountId: string;
  selectedVendorId: string;
  searchQuery: string;
  yearOptions: number[];
  accountsList: Accounts[];
  vendorsList: Vendor[];
  onYearChange: (year: number) => void;
  onAccountChange: (accountId: string) => void;
  onVendorChange: (vendorId: string) => void;
  onSearchChange: (query: string) => void;
}

export default function LedgerFilters({
  selectedYear,
  selectedAccountId,
  selectedVendorId,
  searchQuery,
  yearOptions,
  accountsList,
  vendorsList,
  onYearChange,
  onAccountChange,
  onVendorChange,
  onSearchChange,
}: LedgerFiltersProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              value={selectedAccountId}
              label="Account"
              onChange={(e) => onAccountChange(e.target.value)}
            >
              <MenuItem value="">All Accounts</MenuItem>
              {accountsList.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.code ? `[${account.code}] ` : ""}
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={selectedVendorId}
              label="Vendor"
              onChange={(e) => onVendorChange(e.target.value)}
            >
              <MenuItem value="">All Vendors</MenuItem>
              {vendorsList.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 12, lg: 4 }}>
          <TextField
            fullWidth
            placeholder="Search description, memo, reference..."
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
      </Grid>
    </Paper>
  );
}
