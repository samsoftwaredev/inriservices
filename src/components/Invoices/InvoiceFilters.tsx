"use client";

import React from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { InvoiceStatus } from "@/types";

export interface InvoiceFilters {
  status?: InvoiceStatus;
  issuedYear?: number;
  clientId?: string;
  projectId?: string;
}

interface InvoiceFiltersProps {
  filters: InvoiceFilters;
  searchQuery: string;
  onFiltersChange: (newFilters: Partial<InvoiceFilters>) => void;
  onSearchChange: (query: string) => void;
  onCreateNew: () => void;
}

const InvoiceFiltersComponent: React.FC<InvoiceFiltersProps> = ({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchChange,
  onCreateNew,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FilterIcon sx={{ mr: 1 }} />
        Filters & Search
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search invoices by number..."
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

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) =>
                onFiltersChange({
                  status: (e.target.value as InvoiceStatus) || undefined,
                })
              }
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="partially_paid">Partially Paid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="void">Void</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.issuedYear || ""}
              label="Year"
              onChange={(e) =>
                onFiltersChange({
                  issuedYear: Number(e.target.value) || undefined,
                })
              }
            >
              <MenuItem value="">All Years</MenuItem>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateNew}
            fullWidth
          >
            New Invoice
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InvoiceFiltersComponent;
