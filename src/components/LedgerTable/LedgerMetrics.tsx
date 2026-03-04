"use client";

import React from "react";
import { Box, Grid } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  LinkOff as LinkOffIcon,
} from "@mui/icons-material";
import MetricCards from "../Dashboard/MetricCards";
import { MetricCard } from "@/types";
import { formatCurrency } from "../FinancialReportPDF";

interface LedgerMetricsProps {
  totalAmountCents: number;
  totalTransactions: number;
  transactionsWithNoLinks: number;
}

export default function LedgerMetrics({
  totalAmountCents,
  totalTransactions,
  transactionsWithNoLinks,
}: LedgerMetricsProps) {
  const isPositive = totalAmountCents >= 0;
  const color = isPositive ? "success.main" : "error.main";

  const summaryCards: MetricCard[] = [
    {
      title: "Total Amount",
      value: totalAmountCents,
      icon: <AccountBalanceIcon />,
      color: color,
      format: formatCurrency,
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: <ReceiptIcon />,
      color: "primary.main",
      format: (value) => value.toString(),
    },
    {
      title: "No Attachments",
      value: transactionsWithNoLinks,
      icon: <LinkOffIcon />,
      color: "warning.main",
      format: (value) => value.toString(),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <MetricCards summaryCards={summaryCards} />
      </Grid>
    </Box>
  );
}
