"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { PaymentMethod, ReceiptStatus } from "@/types";
import { receiptApi } from "@/services/receiptApi";
import { useClient } from "@/context/ClientContext";
import CreateReceipt from "../CreateReceipt";

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
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CreateReceiptDialog = ({ open, onClose, onSuccess, onError }: Props) => {
  const { currentClient } = useClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReceiptForm>({
    defaultValues: {
      currency: "USD",
      paidAt: new Date(),
      paymentMethod: "cash",
    },
  });

  const handleCreateReceipt = async (data: CreateReceiptForm) => {
    try {
      const receiptInput = {
        company_id: currentClient?.companyId!,
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
      handleClose();
      onSuccess();
    } catch (err) {
      console.error("Error creating receipt:", err);
      onError("Failed to create receipt");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <CreateReceipt onSuccess={handleClose} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateReceiptDialog;
