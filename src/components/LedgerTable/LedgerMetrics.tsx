"use client";

import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon,
  LinkOff as LinkOffIcon,
} from "@mui/icons-material";

interface LedgerMetricsProps {
  totalAmountCents: number;
  totalTransactions: number;
  transactionsWithNoLinks: number;
  formatCurrency: (cents: number) => string;
}

const MetricCard = ({
  title,
  value,
  icon,
  color = "primary.main",
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}) => {
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
            fontWeight: "bold",
            mb: description ? 1 : 0,
          }}
        >
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function LedgerMetrics({
  totalAmountCents,
  totalTransactions,
  transactionsWithNoLinks,
  formatCurrency,
}: LedgerMetricsProps) {
  const isPositive = totalAmountCents >= 0;
  const color = isPositive ? "success.main" : "error.main";
  const icon = isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Total Amount"
            value={formatCurrency(totalAmountCents)}
            icon={icon}
            color={color}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Total Transactions"
            value={totalTransactions.toString()}
            icon={<ReceiptIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="No Attachments"
            value={transactionsWithNoLinks.toString()}
            icon={<LinkOffIcon />}
            color="warning.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
