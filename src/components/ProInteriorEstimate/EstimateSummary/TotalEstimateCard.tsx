"use client";

import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@/tools/costTools";

interface CostCalculation {
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  profitAmount: number;
  totalWithProfit: number;
  taxesToPay: number;
  paymentSystemFee: number;
  companyFeesTotal: number;
  totalWithTaxes: number;
}

interface DiscountConfig {
  type: "percentage" | "amount";
  value: number;
  isEditing: boolean;
}

export const TotalEstimateCard = ({
  costs,
  discount,
  isMobile,
}: {
  costs: CostCalculation;
  discount: DiscountConfig;
  isMobile: boolean;
}) => (
  <Grid
    size={12}
    display="flex"
    bgcolor="primary.light"
    justifyContent="space-between"
    sx={{
      px: { xs: 1, sm: 2 },
      py: { xs: 1.5, sm: 2 },
      borderRadius: 4,
      opacity: 0.9,
    }}
  >
    <Stack>
      <Typography variant={isMobile ? "h6" : "h4"}>Total Estimate</Typography>
      {costs.discountAmount > 0 && (
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          After{" "}
          {discount.type === "percentage"
            ? `${discount.value}%`
            : `$${discount.value}`}{" "}
          discount
        </Typography>
      )}
    </Stack>
    <Stack spacing={0} alignItems="flex-end">
      <Typography variant={isMobile ? "h5" : "h2"}>
        ${formatCurrency(costs.totalWithTaxes)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Profit ${formatCurrency(costs.profitAmount)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Taxes ${formatCurrency(costs.taxesToPay)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Payment system fee ${formatCurrency(costs.paymentSystemFee)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Company fees ${formatCurrency(costs.companyFeesTotal)}
      </Typography>
    </Stack>
  </Grid>
);
