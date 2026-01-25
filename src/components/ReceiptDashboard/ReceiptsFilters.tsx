"use client";

import React from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ReceiptStatus, PaymentMethod } from "@/types";

interface ReceiptFilters {
  status?: ReceiptStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date | null;
  endDate?: Date | null;
  clientId?: string;
  projectId?: string;
}

interface ReceiptsFiltersProps {
  filters: ReceiptFilters;
  searchQuery: string;
  onFilterChange: (filters: Partial<ReceiptFilters>) => void;
  onSearchChange: (query: string) => void;
}

const ReceiptsFilters: React.FC<ReceiptsFiltersProps> = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
}) => {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        <FilterIcon sx={{ mr: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        Filters & Search
      </Typography>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid size={12}>
          <TextField
            fullWidth
            placeholder="Search receipts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) =>
                onFilterChange({
                  status: (e.target.value as ReceiptStatus) || undefined,
                })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="posted">Posted</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="voided">Voided</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={filters.paymentMethod || ""}
              label="Payment Method"
              onChange={(e) =>
                onFilterChange({
                  paymentMethod: (e.target.value as PaymentMethod) || undefined,
                })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="check">Check</MenuItem>
              <MenuItem value="zelle">Zelle</MenuItem>
              <MenuItem value="venmo">Venmo</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ backgroundColor: "white" }}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => onFilterChange({ startDate: date })}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ backgroundColor: "white" }}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => onFilterChange({ endDate: date })}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReceiptsFilters;
