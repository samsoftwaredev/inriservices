"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { accountsApi } from "@/services/accountsApi";
import { vendorsApi } from "@/services/vendersApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import TransactionDrawer from "@/components/TransactionDrawer";
import LedgerFilters from "./LedgerFilters";
import LedgerMetrics from "./LedgerMetrics";
import TransactionsTable from "./TransactionsTable";
import type {
  Accounts,
  Vendor,
  FinancialTransaction,
  FinancialDocument,
} from "@/types";
import PageHeader from "../PageHeader";

const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function LedgerTable() {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [transactions, setTransactions] = useState<
    { tx: FinancialTransaction; docs: FinancialDocument[]; id: string }[]
  >([]);
  const [accounts, setAccounts] = useState<Map<string, Accounts>>(new Map());
  const [vendors, setVendors] = useState<Map<string, Vendor>>(new Map());

  // Filters
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  // Generate year options
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Load accounts and vendors
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [accountsResult, vendorsResult] = await Promise.all([
          accountsApi.list({ is_active: true, limit: 500 }),
          vendorsApi.list({ limit: 500 }),
        ]);

        const accountMap = new Map<string, Accounts>();
        accountsResult.items.forEach((acc) => {
          accountMap.set(acc.id, acc);
        });
        setAccounts(accountMap);

        const vendorMap = new Map<string, Vendor>();
        vendorsResult.items.forEach((vendor) => {
          vendorMap.set(vendor.id, vendor);
        });
        setVendors(vendorMap);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    loadOptions();
  }, []);

  // Load transactions
  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await financialTransactionsApi.list({
        year: selectedYear,
        account_id: selectedAccountId || undefined,
        vendor_id: selectedVendorId || undefined,
        q: searchQuery || undefined,
        limit: 1000,
      });
      setTransactions(result.items);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accounts.size > 0) {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedYear,
    selectedAccountId,
    selectedVendorId,
    searchQuery,
    accounts,
  ]);

  const handleAddTransaction = () => {
    setSelectedTransactionId(null);
    setDrawerOpen(true);
  };

  const handleEditTransaction = (txId: string) => {
    setSelectedTransactionId(txId);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedTransactionId(null);
  };

  const handleTransactionSaved = () => {
    loadTransactions();
  };

  const accountsList = Array.from(accounts.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const vendorsList = Array.from(vendors.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Calculate total amount from current transactions
  const totalAmountCents = useMemo(() => {
    return transactions.reduce((sum, item) => sum + item.tx.amount_cents, 0);
  }, [transactions]);

  // Calculate transactions with no links
  const transactionsWithNoLinks = useMemo(() => {
    return transactions.filter(
      (item) =>
        !item.tx.invoice_id &&
        !item.tx.receipt_id &&
        !item.tx.project_id &&
        !item.tx.client_id,
    ).length;
  }, [transactions]);

  return (
    <>
      <PageHeader
        title="General Ledger"
        subtitle="View and manage all your financial transactions in one place."
        actions={
          <Button
            variant="contained"
            sx={{ my: 1 }}
            startIcon={<AddIcon />}
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        }
      />

      {/* Filters */}
      <LedgerFilters
        selectedYear={selectedYear}
        selectedAccountId={selectedAccountId}
        selectedVendorId={selectedVendorId}
        searchQuery={searchQuery}
        yearOptions={yearOptions}
        accountsList={accountsList}
        vendorsList={vendorsList}
        onYearChange={setSelectedYear}
        onAccountChange={setSelectedAccountId}
        onVendorChange={setSelectedVendorId}
        onSearchChange={setSearchQuery}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Alert severity="info">
          {selectedAccountId || selectedVendorId || searchQuery
            ? "No transactions found matching your filters."
            : `No transactions for ${selectedYear}. Add your first transaction to get started.`}
        </Alert>
      ) : (
        <>
          <LedgerMetrics
            totalAmountCents={totalAmountCents}
            totalTransactions={transactions.length}
            transactionsWithNoLinks={transactionsWithNoLinks}
            formatCurrency={formatCurrency}
          />
          <TransactionsTable
            transactions={transactions}
            accounts={accounts}
            vendors={vendors}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEditTransaction={handleEditTransaction}
          />
        </>
      )}

      <TransactionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        transactionId={selectedTransactionId}
        onSaved={handleTransactionSaved}
      />
    </>
  );
}
