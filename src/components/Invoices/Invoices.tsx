"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import {
  Receipt as InvoiceIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Invoice, MetricCard } from "@/types";
import { invoiceApi, InvoiceWithClient } from "@/services/invoiceApi";
import MetricCards from "@/components/Dashboard/MetricCards";
import { useRouter } from "next/navigation";
import InvoicesTable from "./InvoicesTable";
import InvoiceFiltersComponent, { InvoiceFilters } from "./InvoiceFilters";

interface DashboardStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

const Invoices = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
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
      0,
    );

    const paidAmount = invoiceList.reduce(
      (sum, invoice) =>
        invoice.status === "paid" ? sum + (invoice.total_cents || 0) : sum,
      0,
    );

    const pendingAmount = invoiceList.reduce(
      (sum, invoice) =>
        invoice.status === "sent" || invoice.status === "overdue"
          ? sum + ((invoice.total_cents || 0) - (invoice.paid_cents || 0))
          : sum,
      0,
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

  // Format currency for stats
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
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
      format: (value: number) => value.toString(),
    },
    {
      title: "Total Amount",
      value: stats.totalAmount,
      icon: <MoneyIcon />,
      color: "success.light",
      format: formatCurrency,
    },
    {
      title: "Paid Amount",
      value: stats.paidAmount,
      icon: <TrendingUpIcon />,
      color: "info.light",
      format: formatCurrency,
    },
    {
      title: "Pending Amount",
      value: stats.pendingAmount,
      icon: <AssessmentIcon />,
      color: "warning.light",
      format: formatCurrency,
    },
  ];

  const onViewInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  const onEditInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}/edit`);
  };

  const onClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPage(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
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
        <InvoiceFiltersComponent
          filters={filters}
          searchQuery={searchQuery}
          onFiltersChange={handleFilterChange}
          onSearchChange={setSearchQuery}
          onClearFilters={onClearFilters}
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
          <Typography variant="h6">Invoices ({totalCount})</Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/invoices/new")}
            startIcon={<AddIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
          >
            New Invoice
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Invoices Table */}
        <InvoicesTable
          invoices={invoices}
          loading={loading}
          page={page}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onViewInvoice={onViewInvoice}
          onEditInvoice={onEditInvoice}
          onPageChange={setPage}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Invoices;
