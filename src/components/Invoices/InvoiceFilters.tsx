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
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 2, md: 3 },
        borderRadius: { xs: 1, sm: 2 },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
          mb: { xs: 1.5, md: 2 },
        }}
      >
        <FilterIcon sx={{ mr: 1, fontSize: { xs: 20, md: 24 } }} />
        Filters & Search
      </Typography>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {/* Search Input - Full width on mobile, larger on desktop */}
        <Grid size={{ xs: 12, md: 4, lg: 5 }}>
          <TextField
            fullWidth
            placeholder="Search invoices by number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />
        </Grid>

        {/* Status Filter - Half width on mobile, smaller on desktop */}
        <Grid size={{ xs: 6, sm: 4, md: 2.5, lg: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
              Status
            </InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) =>
                onFiltersChange({
                  status: (e.target.value as InvoiceStatus) || undefined,
                })
              }
              sx={{
                "& .MuiSelect-select": {
                  fontSize: { xs: "0.875rem", md: "1rem" },
                },
              }}
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

        {/* Year Filter - Half width on mobile, smaller on desktop */}
        <Grid size={{ xs: 6, sm: 4, md: 2.5, lg: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
              Year
            </InputLabel>
            <Select
              value={filters.issuedYear || ""}
              label="Year"
              onChange={(e) =>
                onFiltersChange({
                  issuedYear: Number(e.target.value) || undefined,
                })
              }
              sx={{
                "& .MuiSelect-select": {
                  fontSize: { xs: "0.875rem", md: "1rem" },
                },
              }}
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

        {/* New Invoice Button - Full width on mobile, auto on larger screens */}
        <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
            onClick={onCreateNew}
            fullWidth
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              py: { xs: 0.75, md: 1 },
              whiteSpace: "nowrap",
            }}
          >
            New Invoice
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InvoiceFiltersComponent;
