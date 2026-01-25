"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Stack,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Undo as RefundIcon,
} from "@mui/icons-material";
import {
  ReceiptTransformed,
  PaymentMethod,
  ReceiptStatus,
  ClientFullData,
} from "@/types";
import { receiptApi } from "@/services/receiptApi";
import ReceiptTable from "./ReceiptTable";
import {
  companyAddressLocality,
  companyEmail,
  companyFullAddress,
  companyName,
  companyPhoneFormatted,
} from "@/constants";
import { formatPhoneNumber } from "@/tools";

interface Props {
  receiptId: string;
  receipt: ReceiptTransformed;
  onEdit: (receipt: ReceiptTransformed) => void;
  onVoid?: (receiptId: string) => void;
  onRefund?: (receiptId: string) => void;
  client: ClientFullData;
}

const Receipt = ({
  receiptId,
  receipt,
  onEdit,
  onVoid,
  onRefund,
  client,
}: Props) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const formatCurrency = (cents: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format((cents ?? 0) / 100);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const getStatusChip = (status: ReceiptStatus) => {
    const map: Record<
      ReceiptStatus,
      { label: string; color: "success" | "warning" | "error" | "default" }
    > = {
      posted: { label: "PAID", color: "success" },
      refunded: { label: "REFUNDED", color: "warning" },
      voided: { label: "VOID", color: "error" },
    };
    const s = map[status] ?? {
      label: String(status).toUpperCase(),
      color: "default" as const,
    };
    return (
      <Chip
        size="small"
        label={s.label}
        color={s.color}
        sx={{ fontWeight: 800 }}
      />
    );
  };

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

  const receiptNumber = useMemo(() => {
    // If you later add a receipt_number column, show that instead.
    const suffix = (receipt?.id ?? receiptId ?? "").slice(-6).toUpperCase();
    return `#${suffix || "—"}`;
  }, [receipt?.id, receiptId]);

  const handleVoid = async () => {
    if (!receipt) return;
    setLoading(true);
    try {
      await receiptApi.voidReceipt(receipt.id);
      if (typeof onVoid === "function") onVoid(receipt.id);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!receipt) return;
    setLoading(true);
    try {
      await receiptApi.refundReceipt(receipt.id);
      if (typeof onRefund === "function") onRefund(receipt.id);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading receipt...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!receipt) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No receipt data provided.
      </Alert>
    );
  }

  // Mock-style green bar color (matches screenshot vibe)
  const bar = theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {/* Top row: company info (left) + receipt meta box (right) */}
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src="/inriLogo.png"
              variant="circular"
              sx={{
                width: 48,
                height: 48,
                border: "2px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              {/* fallback */}
              {companyName}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, lineHeight: 1.1 }}
              >
                {companyName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {companyFullAddress}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {companyPhoneFormatted + " • " + companyEmail}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              borderRadius: 1.5,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ bgcolor: bar, px: 2, py: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={{ color: "common.white", fontWeight: 900 }}>
                  Receipt {receiptNumber}
                </Typography>
                {getStatusChip(receipt.status)}
              </Stack>
            </Box>

            <Box sx={{ px: 2, py: 1.5 }}>
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Paid
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatDate(receipt.paidAt)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Method
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {getPaymentMethodDisplay(receipt.paymentMethod)}
                  </Typography>
                </Stack>

                {receipt.referenceNumber ? (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Reference
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {receipt.referenceNumber}
                    </Typography>
                  </Stack>
                ) : null}

                <Divider sx={{ my: 0.5 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 900, color: bar }}
                  >
                    {formatCurrency(receipt.amountCents, receipt.currency)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Top-right actions (like toolbar icons) */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            sx={{ mt: 1 }}
          >
            {onEdit ? (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onEdit(receipt)}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}

            <Tooltip title="Download">
              <IconButton
                size="small"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton
                size="small"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>

      {/* Recipient block (matches mock) */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 900, color: "text.secondary", letterSpacing: 0.6 }}
        >
          RECIPIENT:
        </Typography>

        <Typography sx={{ fontWeight: 900, mt: 0.25 }}>
          {client?.displayName ??
            `Client ${receipt.clientId.slice(-6).toUpperCase()}`}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {formatPhoneNumber(client?.phone) ?? ""}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {client?.properties[0].addressLine1 ?? ""}
          {client?.properties[0].addressLine2
            ? `, ${client.properties[0].addressLine2}`
            : ""}
          {client?.properties[0].city ? `, ${client.properties[0].city}` : ""}
          {client?.properties[0].state
            ? `, ${client.properties[0].state}`
            : ""}{" "}
          {client?.properties[0].zip ?? ""}, USA
        </Typography>
      </Box>

      {/* Services/summary table (receipt-style) */}
      <ReceiptTable receipt={receipt} />

      {/* Actions (bottom, only for posted) */}
      {receipt.status === "posted" ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            {onVoid && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleVoid}
              >
                Void Receipt
              </Button>
            )}
            {onRefund && (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RefundIcon />}
                onClick={handleRefund}
              >
                Refund Receipt
              </Button>
            )}
          </Stack>
        </Box>
      ) : null}
    </Paper>
  );
};

export default Receipt;
