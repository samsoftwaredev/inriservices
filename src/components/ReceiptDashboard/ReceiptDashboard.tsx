"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Alert, Pagination } from "@mui/material";
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
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
import ReceiptsTable from "./ReceiptsTable";
import ReceiptsFilters from "./ReceiptsFilters";
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
      0,
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
      <ReceiptsFilters
        filters={filters}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchQuery}
      />

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
      <ReceiptsTable
        receipts={receipts}
        loading={loading}
        onViewReceipt={onViewReceipt}
        onEditReceipt={onEditReceipt}
      />

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
