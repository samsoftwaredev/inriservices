"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
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
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import {
  PaymentMethod,
  ReceiptStatus,
  Client,
  Project,
  ProjectWithRelationsAndRooms,
} from "@/types";
import { receiptApi } from "@/services/receiptApi";
import { useClient } from "@/context/ClientContext";
import ClientSearchSelector from "@/components/ClientSearchSelector";
import ProjectSearchSelector from "@/components/ProjectSearchSelector";

interface CreateReceiptForm {
  clientId: string;
  projectId?: string;
  invoiceId?: string;
  amountCents: number;
  currency: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paidAt: Date;
  notes?: string;
}

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateReceipt = ({ onSuccess, onCancel }: Props) => {
  const { currentClient } = useClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState<Client | null>(
    null,
  );
  const [selectedProjectData, setSelectedProjectData] = useState<
    Project | ProjectWithRelationsAndRooms | null
  >(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReceiptForm>({
    defaultValues: {
      clientId: currentClient?.id || "",
      currency: "USD",
      paidAt: new Date(),
      paymentMethod: "cash",
    },
  });

  const handleCreateReceipt = async (data: CreateReceiptForm) => {
    setSubmitError(null);
    try {
      // Use selectedClientData's company_id if available, otherwise fallback to currentClient
      const companyId =
        selectedClientData?.company_id || currentClient?.companyId;

      if (!companyId) {
        setSubmitError("Company ID is required. Please select a client.");
        return;
      }

      const receiptInput = {
        company_id: companyId,
        client_id: data.clientId,
        project_id: data.projectId || null,
        invoice_id: data.invoiceId || null,
        amount_cents: Math.round(data.amountCents * 100),
        currency: data.currency,
        payment_method: data.paymentMethod,
        reference_number: data.referenceNumber || null,
        paid_at: data.paidAt.toISOString(),
        status: "posted" as ReceiptStatus,
        notes: data.notes || null,
      };

      await receiptApi.createReceipt(receiptInput);
      setSubmitSuccess(true);
      reset();
      setSelectedClientData(null);
      setSelectedProjectData(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating receipt:", err);
      setSubmitError("Failed to create receipt. Please try again.");
    }
  };

  const handleReset = () => {
    reset();
    setSubmitError(null);
    setSubmitSuccess(false);
    setSelectedClientData(null);
    setSelectedProjectData(null);
  };

  const handleClientChange = (clientId: string, client: Client) => {
    setValue("clientId", clientId, { shouldValidate: true });
    setSelectedClientData(client);
    // Clear project selection when client changes
    setSelectedProjectData(null);
    setValue("projectId", "");
  };

  const handleProjectChange = (
    projectId: string,
    project: Project | ProjectWithRelationsAndRooms,
  ) => {
    setValue("projectId", projectId);
    setSelectedProjectData(project);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h5" gutterBottom>
        Create New Receipt
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter the receipt details below to record a new payment.
      </Typography>

      {submitSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSubmitSuccess(false)}
        >
          Receipt created successfully!
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

      <form onSubmit={handleSubmit(handleCreateReceipt)}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="clientId"
              control={control}
              rules={{ required: "Client is required" }}
              render={({ field }) => (
                <ClientSearchSelector
                  value={field.value}
                  onChange={handleClientChange}
                  label="Select Client *"
                  error={!!errors.clientId}
                  helperText={errors.clientId?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <ProjectSearchSelector
                  value={field.value}
                  onChange={handleProjectChange}
                  clientId={selectedClientData?.id}
                  label="Select Project (Optional)"
                  error={!!errors.projectId}
                  helperText={
                    errors.projectId?.message ||
                    (selectedClientData
                      ? "Filtered by selected client"
                      : "Select a client first to filter projects")
                  }
                  disabled={isSubmitting}
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
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Amount"
                  type="number"
                  inputProps={{ step: 0.01, min: 0 }}
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
              name="paymentMethod"
              control={control}
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.paymentMethod}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select {...field} label="Payment Method">
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="debit_card">Debit Card</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="zelle">Zelle</MenuItem>
                    <MenuItem value="venmo">Venmo</MenuItem>
                    <MenuItem value="cash_app">Cash App</MenuItem>
                    <MenuItem value="ach">ACH</MenuItem>
                    <MenuItem value="wire">Wire</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.paymentMethod && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {errors.paymentMethod.message}
                    </Typography>
                  )}
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
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="paidAt"
              control={control}
              rules={{ required: "Paid date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Paid Date"
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
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
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
            {isSubmitting ? "Creating..." : "Create Receipt"}
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default CreateReceipt;
