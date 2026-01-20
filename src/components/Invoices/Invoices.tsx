"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Receipt as InvoiceIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Invoice, InvoiceStatus, MetricCard } from "@/types";
import { invoiceApi } from "@/services/invoiceApi";
import MetricCards from "@/components/Dashboard/MetricCards";
import { useRouter } from "next/navigation";

interface InvoiceFilters {
  status?: InvoiceStatus;
  issuedYear?: number;
  clientId?: string;
  projectId?: string;
}

interface DashboardStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

const Invoices = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  const itemsPerPage = 10;

  // Load invoices
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        q: searchQuery || undefined,
        ...filters,
      };

      const result = await invoiceApi.listInvoices(params);
      setInvoices(result.items);
      setTotalCount(result.total || 0);

      // Calculate stats
      calculateStats(result.items);
    } catch (err) {
      setError("Failed to load invoices");
      console.error("Error loading invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchQuery]);

  // Calculate dashboard stats
  const calculateStats = (invoiceList: Invoice[]) => {
    const totalAmount = invoiceList.reduce(
      (sum, invoice) => sum + (invoice.total_cents || 0),
      0
    );

    const paidAmount = invoiceList.reduce(
      (sum, invoice) =>
        invoice.status === "paid" ? sum + (invoice.total_cents || 0) : sum,
      0
    );

    const pendingAmount = invoiceList.reduce(
      (sum, invoice) =>
        invoice.status === "sent" || invoice.status === "overdue"
          ? sum + ((invoice.total_cents || 0) - (invoice.paid_cents || 0))
          : sum,
      0
    );

    setStats({
      totalInvoices: invoiceList.length,
      totalAmount,
      paidAmount,
      pendingAmount,
    });
  };

  // Load invoices on component mount and when dependencies change
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Format currency
  const formatCurrency = (cents: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "info";
      case "draft":
        return "default";
      case "overdue":
        return "error";
      case "partially_paid":
        return "warning";
      case "void":
        return "error";
      default:
        return "default";
    }
  };
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<InvoiceFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1); // Reset to first page
  };

  // Configure metric cards for MetricCards component
  const summaryCards: MetricCard[] = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: <InvoiceIcon />,
      color: "primary.light",
      bgColor: "primary.50",
      iconWrapperColor: "primary.main",
      format: (value: number) => value.toString(),
    },
    {
      title: "Total Amount",
      value: stats.totalAmount,
      icon: <MoneyIcon />,
      color: "success.light",
      bgColor: "success.50",
      iconWrapperColor: "success.main",
      format: formatCurrency,
    },
    {
      title: "Paid Amount",
      value: stats.paidAmount,
      icon: <TrendingUpIcon />,
      color: "info.light",
      bgColor: "info.50",
      iconWrapperColor: "info.main",
      format: formatCurrency,
    },
    {
      title: "Pending Amount",
      value: stats.pendingAmount,
      icon: <AssessmentIcon />,
      color: "warning.light",
      bgColor: "warning.50",
      iconWrapperColor: "warning.main",
      format: formatCurrency,
    },
  ];

  const onViewInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  const onEditInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}/edit`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <InvoiceIcon sx={{ mr: 2, fontSize: 40 }} />
            Invoice Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all invoices
          </Typography>
        </Box>

        {/* Stats Cards */}
        <MetricCards summaryCards={summaryCards} />

        {/* Filters and Search */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    handleFilterChange({
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
                    handleFilterChange({
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
                onClick={() => router.push("/invoices/new")}
                fullWidth
              >
                New Invoice
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Actions Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Invoices ({totalCount})</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({});
              setSearchQuery("");
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Invoices Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>Invoice #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="text.secondary">
                      No invoices found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {invoice.invoice_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.client_id?.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(invoice.total_cents || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(invoice.paid_cents || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(invoice.balance_cents || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status.replace("_", " ").toUpperCase()}
                        color={getStatusColor(invoice.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.issued_date
                          ? formatDate(invoice.issued_date)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.due_date
                          ? formatDate(invoice.due_date)
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Invoice">
                        <IconButton
                          size="small"
                          onClick={() => onViewInvoice(invoice.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Invoice">
                        <IconButton
                          size="small"
                          onClick={() => onEditInvoice(invoice.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(totalCount / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Invoices;
