"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { PaymentMethod, ReceiptStatus, Receipt } from "@/types";
import { receiptApi } from "@/services/receiptApi";
import { toast } from "react-toastify";

interface EditReceiptForm {
  clientId: string;
  projectId?: string;
  invoiceId?: string;
  amountCents: number;
  currency: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paidAt: Date;
  notes?: string;
  status: ReceiptStatus;
}

interface Props {
  receiptId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditReceipt = ({ receiptId, onSuccess, onCancel }: Props) => {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditReceiptForm>();

  // Load receipt data
  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        const receiptData = await receiptApi.getReceipt(receiptId);
        setReceipt(receiptData);

        // Populate form with existing data
        setValue("clientId", receiptData.client_id);
        setValue("projectId", receiptData.project_id || "");
        setValue("invoiceId", receiptData.invoice_id || "");
        setValue("amountCents", receiptData.amount_cents / 100); // Convert to dollars
        setValue("currency", receiptData.currency);
        setValue("paymentMethod", receiptData.payment_method);
        setValue("referenceNumber", receiptData.reference_number || "");
        setValue("paidAt", new Date(receiptData.paid_at));
        setValue("notes", receiptData.notes || "");
        setValue("status", receiptData.status);
      } catch (err) {
        console.error("Error loading receipt:", err);
        setSubmitError("Failed to load receipt data");
        toast.error("Failed to load receipt data");
      } finally {
        setLoading(false);
      }
    };

    if (receiptId) {
      loadReceipt();
    }
  }, [receiptId, setValue]);

  const handleUpdateReceipt = async (data: EditReceiptForm) => {
    setSubmitError(null);
    try {
      const receiptInput = {
        amount_cents: Math.round(data.amountCents * 100),
        currency: data.currency,
        payment_method: data.paymentMethod,
        reference_number: data.referenceNumber || null,
        paid_at: data.paidAt.toISOString(),
        status: data.status,
        notes: data.notes || null,
      };

      await receiptApi.updateReceipt(receiptId, receiptInput);
      setSubmitSuccess(true);
      toast.success("Receipt updated successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error updating receipt:", err);
      setSubmitError("Failed to update receipt. Please try again.");
      toast.error("Failed to update receipt");
    }
  };

  const handleReset = () => {
    if (receipt) {
      // Reset to original values
      setValue("clientId", receipt.client_id);
      setValue("projectId", receipt.project_id || "");
      setValue("invoiceId", receipt.invoice_id || "");
      setValue("amountCents", receipt.amount_cents / 100);
      setValue("currency", receipt.currency);
      setValue("paymentMethod", receipt.payment_method);
      setValue("referenceNumber", receipt.reference_number || "");
      setValue("paidAt", new Date(receipt.paid_at));
      setValue("notes", receipt.notes || "");
      setValue("status", receipt.status);
    }
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!receipt) {
    return <Alert severity="error">Receipt not found or failed to load.</Alert>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h5" gutterBottom>
        Edit Receipt
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Update the receipt details below.
      </Typography>

      {submitSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSubmitSuccess(false)}
        >
          Receipt updated successfully!
        </Alert>
      )}

      {submitError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setSubmitError(null)}
        >
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleUpdateReceipt)}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="clientId"
              control={control}
              rules={{ required: "Client ID is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Client ID"
                  error={!!errors.clientId}
                  helperText={errors.clientId?.message || "Cannot be changed"}
                  disabled // Client cannot be changed
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Project ID (Optional)"
                  disabled // Project cannot be changed for accounting safety
                  helperText="Cannot be changed"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="invoiceId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Invoice ID (Optional)"
                  disabled // Invoice cannot be changed for accounting safety
                  helperText="Cannot be changed"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="amountCents"
              control={control}
              rules={{
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Amount"
                  type="number"
                  inputProps={{
                    step: "0.01",
                    min: "0.01",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  error={!!errors.amountCents}
                  helperText={errors.amountCents?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="currency"
              control={control}
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.currency}>
                  <InputLabel>Currency</InputLabel>
                  <Select {...field} label="Currency">
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.paymentMethod}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select {...field} label="Payment Method">
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="zelle">Zelle</MenuItem>
                    <MenuItem value="cash_app">Cash App</MenuItem>
                    <MenuItem value="venmo">Venmo</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="debit_card">Debit Card</MenuItem>
                    <MenuItem value="ach">ACH</MenuItem>
                    <MenuItem value="wire">Wire Transfer</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="referenceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reference Number (Optional)"
                  placeholder="Check #, Transaction ID, etc."
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="paidAt"
              control={control}
              rules={{ required: "Payment date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Payment Date"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.paidAt,
                      helperText: errors.paidAt?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="posted">Posted</MenuItem>
                    <MenuItem value="voided">Voided</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  placeholder="Additional notes about this receipt..."
                />
              )}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel || handleReset}
            disabled={isSubmitting}
          >
            {onCancel ? "Cancel" : "Reset"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Updating..." : "Update Receipt"}
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default EditReceipt;
