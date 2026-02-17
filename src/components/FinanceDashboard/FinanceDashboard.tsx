"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { accountsApi } from "@/services/accountsApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import type { Accounts, FinancialTransaction } from "@/types";
import { formatCurrency } from "@/tools/costTools";

interface SummaryMetrics {
  grossRevenue: number;
  cogs: number;
  operatingExpenses: number;
  netProfit: number;
  ownerDraws: number;
  ownerContributions: number;
}

const MetricCard = ({
  title,
  value,
  icon,
  color = "primary.main",
  isPositive = true,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  isPositive?: boolean;
}) => {
  const displayValue = formatCurrency(value);
  const isNegative = value < 0;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              color: "white",
              borderRadius: 2,
              p: 1,
              mr: 2,
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: isNegative && isPositive ? "error.main" : "text.primary",
            fontWeight: "bold",
          }}
        >
          {displayValue}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function FinanceDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Map<string, Accounts>>(new Map());
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  // Generate year options (current year + past 5 years)
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Load accounts (once)
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const result = await accountsApi.list({ is_active: true, limit: 500 });
        const accountMap = new Map<string, Accounts>();
        result.items.forEach((acc) => {
          accountMap.set(acc.id, acc);
        });
        setAccounts(accountMap);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setError("Failed to load accounts. Please try again.");
      }
    };
    loadAccounts();
  }, []);

  // Load transactions when year changes
  useEffect(() => {
    const loadTransactions = async () => {
      if (accounts.size === 0) return; // Wait for accounts to load first

      setLoading(true);
      setError(null);

      try {
        const result = await financialTransactionsApi.list({
          year: selectedYear,
          limit: 10000, // Get all for the year
        });
        setTransactions(result.items);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedYear, accounts]);

  // Compute metrics from transactions
  const metrics = useMemo((): SummaryMetrics => {
    const initial: SummaryMetrics = {
      grossRevenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      netProfit: 0,
      ownerDraws: 0,
      ownerContributions: 0,
    };

    transactions.forEach((tx) => {
      const account = accounts.get(tx.account_id);
      if (!account) return;

      const amount = tx.amount_cents;

      switch (account.type) {
        case "revenue":
          initial.grossRevenue += amount;
          break;
        case "cogs":
          initial.cogs += amount; // negative
          break;
        case "expense":
          initial.operatingExpenses += amount; // negative
          break;
        case "equity":
          // Distinguish draws vs contributions by sign
          if (amount < 0) {
            initial.ownerDraws += amount;
          } else {
            initial.ownerContributions += amount;
          }
          break;
        // asset/liability not part of P&L summary
      }
    });

    // Net Profit = Revenue + COGS + Expenses (COGS/Expense are negative)
    initial.netProfit =
      initial.grossRevenue + initial.cogs + initial.operatingExpenses;

    return initial;
  }, [transactions, accounts]);

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
          Financial Dashboard
        </Typography>
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
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {transactions.length === 0 ? (
            <Alert severity="info">
              No transactions found for {selectedYear}. Start by adding
              transactions in the Ledger tab.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="Gross Revenue"
                  value={metrics.grossRevenue}
                  icon={<TrendingUpIcon />}
                  color="success.main"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="COGS"
                  value={metrics.cogs}
                  icon={<ShoppingCartIcon />}
                  color="warning.main"
                  isPositive={false}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="Operating Expenses"
                  value={metrics.operatingExpenses}
                  icon={<ReceiptIcon />}
                  color="error.main"
                  isPositive={false}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="Net Profit"
                  value={metrics.netProfit}
                  icon={<MoneyIcon />}
                  color={metrics.netProfit >= 0 ? "success.main" : "error.main"}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="Owner Draws"
                  value={metrics.ownerDraws}
                  icon={<TrendingDownIcon />}
                  color="info.main"
                  isPositive={false}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MetricCard
                  title="Owner Contributions"
                  value={metrics.ownerContributions}
                  icon={<AccountBalanceIcon />}
                  color="primary.main"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
