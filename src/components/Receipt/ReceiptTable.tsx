"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import { ReceiptTransformed, PaymentMethod } from "@/types";

interface Props {
  receipt: ReceiptTransformed;
}

const ReceiptTable = ({ receipt }: Props) => {
  const theme = useTheme();
  const bar = theme.palette.primary.main;

  const formatCurrency = (cents: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format((cents ?? 0) / 100);

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
        For Payment Received
      </Typography>

      <Box
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ bgcolor: bar, px: 2, py: 1 }}>
          <Typography
            sx={{
              color: "common.white",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0.4,
            }}
          >
            DETAILS
          </Typography>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {receipt.invoiceId
                    ? `Invoice ${String(receipt.invoiceId)
                        .slice(-6)
                        .toUpperCase()}`
                    : "Project Payment"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Method: {getPaymentMethodDisplay(receipt.paymentMethod)}
                  {receipt.referenceNumber
                    ? ` • Ref: ${receipt.referenceNumber}`
                    : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid at: {formatDateTime(receipt.paidAt)}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 900 }}>
                {formatCurrency(receipt.amountCents, receipt.currency)}
              </TableCell>
            </TableRow>

            {receipt.notes ? (
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell colSpan={2}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {receipt.notes}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Box>

      {/* Totals footer */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Box sx={{ width: { xs: "100%", sm: 320 } }}>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatCurrency(receipt.amountCents, receipt.currency)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Tax
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatCurrency(0, receipt.currency)}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontWeight: 900 }}>Total</Typography>
              <Typography sx={{ fontWeight: 900, color: bar }}>
                {formatCurrency(receipt.amountCents, receipt.currency)}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        Thanks for your business!
      </Typography>
    </Box>
  );
};

export default ReceiptTable;
