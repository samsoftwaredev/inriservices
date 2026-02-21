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
import type { Accounts, FinancialTransaction, MetricCard } from "@/types";
import { formatCurrency } from "@/tools/costTools";
import { FinancialReportButton } from "@/components/FinancialReportPDF";
import type {
  CompanyInfo,
  ReportPeriod,
} from "@/components/FinancialReportPDF";
import {
  companyEmail,
  companyFullAddress,
  companyName,
  companyPhoneFormatted,
} from "@/constants";
import PageHeader from "../PageHeader";
import MetricCards from "../Dashboard/MetricCards";

interface SummaryMetrics {
  grossRevenue: number;
  cogs: number;
  operatingExpenses: number;
  netProfit: number;
  ownerDraws: number;
  ownerContributions: number;
}

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

      const amount = tx.amount_cents / 100; // Convert to dollars

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

  // Prepare company info and period for PDF report
  const companyInfo: CompanyInfo = {
    name: companyName,
    address: companyFullAddress,
    phone: companyPhoneFormatted,
    email: companyEmail,
  };

  const reportPeriod: ReportPeriod = {
    startDate: `${selectedYear}-01-01`,
    endDate: `${selectedYear}-12-31`,
    year: selectedYear,
    accountingMethod: "Cash",
  };

  const summaryCardsData: MetricCard[] = [
    {
      iconWrapperColor: "success.main",
      bgColor: "success.light",
      format: formatCurrency,
      title: "Gross Revenue",
      value: metrics.grossRevenue,
      icon: <TrendingUpIcon />,
      color: "success.main",
      description:
        "Total income from services before any deductions. Calculated as the sum of all transactions linked to revenue accounts.",
    },
    {
      iconWrapperColor: "warning.main",
      bgColor: "warning.light",
      format: formatCurrency,
      title: "COGS",
      value: metrics.cogs,
      icon: <ShoppingCartIcon />,
      color: "warning.main",
      description:
        "Cost of Goods Sold: Direct costs of materials and labor for services delivered.",
    },
    {
      iconWrapperColor: "error.main",
      bgColor: "error.light",
      format: formatCurrency,
      title: "Operating Expenses",
      value: metrics.operatingExpenses,
      icon: <ReceiptIcon />,
      color: "error.main",
      description:
        "Business expenses not directly tied to services (rent, utilities, insurance, etc.).",
    },
    {
      iconWrapperColor: "info.main",
      bgColor: "info.light",
      format: formatCurrency,
      title: "Net Profit",
      value: metrics.netProfit,
      icon: <MoneyIcon />,
      color: metrics.netProfit >= 0 ? "success.main" : "error.main",
      description:
        "Calculated as: Gross Revenue + COGS + Operating Expenses (expenses are negative).",
    },
    {
      title: "Owner Draws",
      value: metrics.ownerDraws,
      icon: <TrendingDownIcon />,
      iconWrapperColor: "info.main",
      bgColor: "info.light",
      format: formatCurrency,
      color: "info.main",
      description:
        "Money withdrawn by the owner from the business (equity transactions with negative amounts).",
    },
    {
      iconWrapperColor: "primary.main",
      bgColor: "primary.light",
      format: formatCurrency,
      title: "Owner Contributions",
      value: metrics.ownerContributions,
      icon: <AccountBalanceIcon />,
      color: "primary.main",
      description:
        "Money invested by the owner into the business (equity transactions with positive amounts).",
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Financial Dashboard"
        subtitle="Get a quick overview of your financial performance for the year."
        actions={
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
            }}
          >
            <FormControl sx={{ minWidth: 150, width: "100%" }} size="small">
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
        }
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
      ) : (
        <>
          {transactions.length === 0 ? (
            <Alert severity="info">
              No transactions found for {selectedYear}. Start by adding
              transactions in the Ledger tab.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <MetricCards summaryCards={summaryCardsData} />
            </Grid>
          )}
        </>
      )}
      {!loading && transactions.length > 0 && (
        <FinancialReportButton
          transactions={transactions}
          accounts={accounts}
          company={companyInfo}
          period={reportPeriod}
          prepared={{
            preparedBy: companyInfo.name,
          }}
        />
      )}
    </Box>
  );
}
