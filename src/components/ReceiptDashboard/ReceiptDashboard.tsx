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
  Receipt as ReceiptIcon,
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
import { Receipt, ReceiptStatus, PaymentMethod, MetricCard } from "@/types";
import { receiptApi } from "@/services/receiptApi";
import MetricCards from "@/components/Dashboard/MetricCards";
import CreateReceiptDialog from "./CreateReceiptDialog";
import CustomerSelectionMenu from "../ProInteriorEstimate/CustomerSelectionMenu";
import { useRouter } from "next/navigation";

interface ReceiptFilters {
  status?: ReceiptStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date | null;
  endDate?: Date | null;
  clientId?: string;
  projectId?: string;
}

interface DashboardStats {
  totalReceipts: number;
  totalAmount: number;
  thisMonthAmount: number;
  avgReceiptAmount: number;
}

const ReceiptDashboard = () => {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ReceiptFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalReceipts: 0,
    totalAmount: 0,
    thisMonthAmount: 0,
    avgReceiptAmount: 0,
  });

  const itemsPerPage = 10;

  // Handle dialog events
  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadReceipts(); // Reload receipts
  };

  const handleCreateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Load receipts
  const loadReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        ...filters,
      };

      const result = await receiptApi.listReceipts(params);
      setReceipts(result.items);
      setTotalCount(result.total || 0);

      // Calculate stats
      calculateStats(result.items);
    } catch (err) {
      setError("Failed to load receipts");
      console.error("Error loading receipts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // Calculate dashboard stats
  const calculateStats = (receiptList: Receipt[]) => {
    const totalAmount = receiptList.reduce(
      (sum, receipt) =>
        receipt.status === "posted" ? sum + receipt.amount_cents : sum,
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAmount = receiptList.reduce((sum, receipt) => {
      const receiptDate = new Date(receipt.paid_at);
      if (
        receipt.status === "posted" &&
        receiptDate.getMonth() === currentMonth &&
        receiptDate.getFullYear() === currentYear
      ) {
        return sum + receipt.amount_cents;
      }
      return sum;
    }, 0);

    const postedReceipts = receiptList.filter((r) => r.status === "posted");
    const avgReceiptAmount =
      postedReceipts.length > 0 ? totalAmount / postedReceipts.length : 0;

    setStats({
      totalReceipts: receiptList.length,
      totalAmount,
      thisMonthAmount,
      avgReceiptAmount,
    });
  };

  // Load receipts on component mount and when dependencies change
  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

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
  const getStatusColor = (status: ReceiptStatus) => {
    switch (status) {
      case "posted":
        return "success";
      case "refunded":
        return "warning";
      case "voided":
        return "error";
      default:
        return "default";
    }
  };

  // Get payment method display
  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string> = {
      cash: "Cash",
      check: "Check",
      zelle: "Zelle",
      cash_app: "Cash App",
      venmo: "Venmo",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      ach: "ACH Transfer",
      wire: "Wire Transfer",
      other: "Other",
    };
    return methodMap[method] || method;
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ReceiptFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1); // Reset to first page
  };

  // Configure metric cards for MetricCards component
  const summaryCards: MetricCard[] = [
    {
      title: "Total Receipts",
      value: stats.totalReceipts,
      icon: <ReceiptIcon />,
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
      title: "This Month",
      value: stats.thisMonthAmount,
      icon: <TrendingUpIcon />,
      color: "info.light",
      bgColor: "info.50",
      iconWrapperColor: "info.main",
      format: formatCurrency,
    },
    {
      title: "Average Receipt",
      value: stats.avgReceiptAmount,
      icon: <AssessmentIcon />,
      color: "warning.light",
      bgColor: "warning.50",
      iconWrapperColor: "warning.main",
      format: formatCurrency,
    },
  ];

  const onViewReceipt = (receiptId: string) => {
    router.push(`/receipts/${receiptId}`);
  };

  const onEditReceipt = (receiptId: string) => {
    router.push(`/receipts/${receiptId}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CustomerSelectionMenu
        title={"Receipt Dashboard"}
        subtitle={"Manage and track all payment receipts"}
        onCreateNewCustomer={() => {}}
        onCreateNewLocation={() => {}}
      />

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
              placeholder="Search receipts..."
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

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={filters.paymentMethod || ""}
                label="Payment Method"
                onChange={(e) =>
                  handleFilterChange({
                    paymentMethod:
                      (e.target.value as PaymentMethod) || undefined,
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

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange({ startDate: date })}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange({ endDate: date })}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
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
        <Typography variant="h6">Receipts ({totalCount})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Receipt
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Receipts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>Receipt ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Loading receipts...
                </TableCell>
              </TableRow>
            ) : receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">
                    No receipts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => (
                <TableRow key={receipt.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      #{receipt.id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(receipt.amount_cents, receipt.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getPaymentMethodDisplay(receipt.payment_method)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={receipt.status.toUpperCase()}
                      color={getStatusColor(receipt.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(receipt.paid_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {receipt.client_id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {receipt.reference_number || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Receipt">
                      <IconButton
                        size="small"
                        onClick={() => onViewReceipt(receipt.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Receipt">
                      <IconButton
                        size="small"
                        onClick={() => onEditReceipt(receipt.id)}
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
      {totalCount > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(totalCount / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Create Receipt Dialog */}
      <CreateReceiptDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />
    </LocalizationProvider>
  );
};

export default ReceiptDashboard;
