"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { accountsApi } from "@/services/accountsApi";
import { vendorsApi } from "@/services/vendersApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import TransactionDrawer from "@/components/TransactionDrawer";
import type { Accounts, Vendor, FinancialTransaction } from "@/types";

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
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          General Ledger
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTransaction}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Account</InputLabel>
            <Select
              value={selectedAccountId}
              label="Account"
              onChange={(e) => setSelectedAccountId(e.target.value)}
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

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={selectedVendorId}
              label="Vendor"
              onChange={(e) => setSelectedVendorId(e.target.value)}
            >
              <MenuItem value="">All Vendors</MenuItem>
              {vendorsList.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            placeholder="Search description, memo, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />
        </Box>
      </Paper>

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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Links</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const account = accounts.get(tx.account_id);
                const vendor = tx.vendor_id ? vendors.get(tx.vendor_id) : null;

                return (
                  <TableRow
                    key={tx.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleEditTransaction(tx.id)}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(tx.transaction_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {account && (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {account.name}
                          </Typography>
                          {account.code && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {account.code}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{tx.description}</Typography>
                      {tx.memo && (
                        <Typography variant="caption" color="text.secondary">
                          {tx.memo}
                        </Typography>
                      )}
                      {tx.reference_number && (
                        <Chip
                          label={`Ref: ${tx.reference_number}`}
                          size="small"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor ? (
                        <Chip
                          icon={<BusinessIcon />}
                          label={vendor.name}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color:
                            tx.amount_cents < 0 ? "error.main" : "success.main",
                        }}
                      >
                        {formatCurrency(tx.amount_cents)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        {tx.invoice_id && (
                          <Tooltip title="Linked to Invoice">
                            <Chip
                              icon={<ReceiptIcon />}
                              label="INV"
                              size="small"
                              color="primary"
                              sx={{ height: 24 }}
                            />
                          </Tooltip>
                        )}
                        {tx.receipt_id && (
                          <Tooltip title="Linked to Receipt">
                            <Chip
                              icon={<ReceiptIcon />}
                              label="RCP"
                              size="small"
                              color="success"
                              sx={{ height: 24 }}
                            />
                          </Tooltip>
                        )}
                        {tx.project_id && (
                          <Tooltip title="Linked to Project">
                            <Chip
                              icon={<WorkIcon />}
                              label="PRJ"
                              size="small"
                              color="info"
                              sx={{ height: 24 }}
                            />
                          </Tooltip>
                        )}
                        {tx.client_id && (
                          <Tooltip title="Linked to Client">
                            <Chip
                              icon={<PersonIcon />}
                              label="CLT"
                              size="small"
                              color="secondary"
                              sx={{ height: 24 }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TransactionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        transactionId={selectedTransactionId}
        onSaved={handleTransactionSaved}
      />
    </Box>
  );
}
