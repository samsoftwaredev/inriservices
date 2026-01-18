"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  DateRange as DateIcon,
  AttachMoney as MoneyIcon,
  Description as NotesIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Cancel as CancelIcon,
  Undo as RefundIcon,
} from "@mui/icons-material";
import { ReceiptTransformed, PaymentMethod, ReceiptStatus } from "@/types";
import { receiptApi } from "@/services/receiptApi";

interface Props {
  receiptId: string;
  receipt: ReceiptTransformed;
  onEdit: (receipt: ReceiptTransformed) => void;
  onVoid: (receiptId: string) => void;
  onRefund: (receiptId: string) => void;
}

const Receipt = ({ receiptId, receipt, onEdit, onVoid, onRefund }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (cents: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status: ReceiptStatus) => {
    switch (status) {
      case "posted":
        return "success";
      case "refunded":
        return "warning";
      case "voided":
        return "error";
      default:
        return "default";
    }
  };

  // Get payment method display
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

  const handleVoid = async () => {
    if (!receipt || !onVoid) return;
    try {
      await receiptApi.voidReceipt(receipt.id);
      onVoid(receipt.id);
    } catch (err) {
      console.error("Error voiding receipt:", err);
    }
  };

  const handleRefund = async () => {
    if (!receipt || !onRefund) return;
    try {
      await receiptApi.refundReceipt(receipt.id);
      onRefund(receipt.id);
    } catch (err) {
      console.error("Error refunding receipt:", err);
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

  return (
    <Paper
      elevation={2}
      sx={{ maxWidth: 800, mx: "auto", p: 0, overflow: "hidden" }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          p: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                <ReceiptIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Receipt #{receipt.id.slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {formatCurrency(receipt.amountCents, receipt.currency)}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={receipt.status.toUpperCase()}
              color={getStatusColor(receipt.status) as any}
              sx={{ color: "white", fontWeight: "bold" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "center", md: "flex-end" }}
            >
              {onEdit && (
                <Tooltip title="Edit Receipt">
                  <IconButton
                    onClick={() => onEdit(receipt)}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Download Receipt">
                <IconButton
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Receipt">
                <IconButton
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Payment Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PaymentIcon sx={{ mr: 1 }} />
                  Payment Details
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Amount:</Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {formatCurrency(receipt.amountCents, receipt.currency)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">
                      Payment Method:
                    </Typography>
                    <Typography fontWeight="medium">
                      {getPaymentMethodDisplay(receipt.paymentMethod)}
                    </Typography>
                  </Box>
                  {receipt.referenceNumber && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="text.secondary">Reference:</Typography>
                      <Typography fontWeight="medium">
                        {receipt.referenceNumber}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Currency:</Typography>
                    <Typography fontWeight="medium">
                      {receipt.currency.toUpperCase()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Date Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DateIcon sx={{ mr: 1 }} />
                  Dates
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Paid Date:</Typography>
                    <Typography fontWeight="medium">
                      {formatDate(receipt.paidAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Created:</Typography>
                    <Typography>{formatDate(receipt.createdAt)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Relations */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <BusinessIcon sx={{ mr: 1 }} />
                  Related Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="text.secondary">Client ID:</Typography>
                      <Typography fontWeight="medium">
                        {receipt.clientId.slice(-8)}
                      </Typography>
                    </Box>
                  </Grid>
                  {receipt.projectId && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="text.secondary">
                          Project ID:
                        </Typography>
                        <Typography fontWeight="medium">
                          {receipt.projectId.slice(-8)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {receipt.invoiceId && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="text.secondary">
                          Invoice ID:
                        </Typography>
                        <Typography fontWeight="medium">
                          {receipt.invoiceId.slice(-8)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notes */}
          {receipt.notes && (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <NotesIcon sx={{ mr: 1 }} />
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {receipt.notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        {receipt.status === "posted" && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleVoid}
              >
                Void Receipt
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RefundIcon />}
                onClick={handleRefund}
              >
                Refund Receipt
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Receipt;
