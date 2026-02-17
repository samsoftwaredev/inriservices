"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { accountsApi } from "@/services/accountsApi";
import { vendorsApi } from "@/services/vendersApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import ReceiptUploader from "@/components/ReceiptUploader";
import type {
  Accounts,
  Vendor,
  FinancialTransaction,
  FinancialDocument,
  TransactionSource,
} from "@/types";
// Constants not needed for this component

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
  transactionId?: string | null;
  onSaved?: () => void;
}

interface TransactionFormData {
  transaction_date: string;
  account_id: string;
  amount_dollars: string;
  description: string;
  memo: string;
  reference_number: string;
  vendor_id: string;
  project_id: string;
  client_id: string;
  source: TransactionSource;
}

const emptyForm: TransactionFormData = {
  transaction_date: new Date().toISOString().split("T")[0],
  account_id: "",
  amount_dollars: "",
  description: "",
  memo: "",
  reference_number: "",
  vendor_id: "",
  project_id: "",
  client_id: "",
  source: "manual",
};

const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

export default function TransactionDrawer({
  open,
  onClose,
  transactionId = null,
  onSaved,
}: TransactionDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TransactionFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);

  const [transaction, setTransaction] = useState<FinancialTransaction | null>(
    null,
  );

  // Load accounts and vendors
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [accountsResult, vendorsResult] = await Promise.all([
          accountsApi.list({ is_active: true, limit: 500 }),
          vendorsApi.list({ limit: 500 }),
        ]);
        setAccounts(accountsResult.items);
        setVendors(vendorsResult.items);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    loadOptions();
  }, []);

  // Load transaction if editing
  useEffect(() => {
    if (!open) {
      // Reset on close
      setFormData(emptyForm);
      setFormErrors({});
      setError(null);
      setTransaction(null);
      setDocuments([]);
      return;
    }

    if (!transactionId) {
      setFormData(emptyForm);
      setDocuments([]);
      return;
    }

    const loadTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const { tx, docs } =
          await financialTransactionsApi.getWithDocuments(transactionId);
        setTransaction(tx);
        setDocuments(docs);

        setFormData({
          transaction_date: tx.transaction_date.split("T")[0],
          account_id: tx.account_id,
          amount_dollars: (tx.amount_cents / 100).toFixed(2),
          description: tx.description,
          memo: tx.memo ?? "",
          reference_number: tx.reference_number ?? "",
          vendor_id: tx.vendor_id ?? "",
          project_id: tx.project_id ?? "",
          client_id: tx.client_id ?? "",
          source: tx.source,
        });
      } catch (err) {
        console.error("Failed to load transaction:", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [open, transactionId]);

  // Auto-suggest sign based on account type
  const selectedAccount = useMemo(() => {
    return accounts.find((a) => a.id === formData.account_id);
  }, [formData.account_id, accounts]);

  const suggestedSign = useMemo(() => {
    if (!selectedAccount) return null;
    const type = selectedAccount.type;
    if (type === "revenue" || type === "equity") return "positive";
    if (type === "cogs" || type === "expense" || type === "asset")
      return "negative";
    return null;
  }, [selectedAccount]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof TransactionFormData, string>> = {};

    if (!formData.transaction_date) {
      errors.transaction_date = "Date is required";
    }

    if (!formData.account_id) {
      errors.account_id = "Account is required";
    }

    if (!formData.amount_dollars.trim()) {
      errors.amount_dollars = "Amount is required";
    } else {
      const num = parseFloat(formData.amount_dollars);
      if (isNaN(num)) {
        errors.amount_dollars = "Invalid amount";
      }
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      const amountCents = Math.round(parseFloat(formData.amount_dollars) * 100);

      const payload: any = {
        transaction_date: formData.transaction_date,
        account_id: formData.account_id,
        amount_cents: amountCents,
        description: formData.description.trim(),
        memo: formData.memo.trim() || null,
        reference_number: formData.reference_number.trim() || null,
        vendor_id: formData.vendor_id || null,
        project_id: formData.project_id || null,
        client_id: formData.client_id || null,
        source: formData.source,
        currency: "USD",
      };

      if (transactionId) {
        await financialTransactionsApi.update(transactionId, payload);
      } else {
        payload.company_id = ""; // Set by RLS
        await financialTransactionsApi.create(payload);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setError("Failed to save transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionId) return;
    if (
      !confirm(
        "Are you sure you want to delete this transaction? This cannot be undone.",
      )
    )
      return;

    setDeleting(true);
    setError(null);

    try {
      await financialTransactionsApi.delete(transactionId);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Failed to delete transaction.");
    } finally {
      setDeleting(false);
    }
  };

  const selectedVendor = vendors.find((v) => v.id === formData.vendor_id);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 600 } } }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">
            {transactionId ? "Edit Transaction" : "Add Transaction"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Transaction Date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) =>
                  setFormData({ ...formData, transaction_date: e.target.value })
                }
                error={!!formErrors.transaction_date}
                helperText={formErrors.transaction_date}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth required error={!!formErrors.account_id}>
                <InputLabel>Account</InputLabel>
                <Select
                  value={formData.account_id}
                  label="Account"
                  onChange={(e) =>
                    setFormData({ ...formData, account_id: e.target.value })
                  }
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.code ? `[${account.code}] ` : ""}
                      {account.name}
                      <Chip label={account.type} size="small" sx={{ ml: 1 }} />
                    </MenuItem>
                  ))}
                </Select>
                {suggestedSign && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    💡 Tip: {selectedAccount?.type} accounts typically use{" "}
                    {suggestedSign === "positive" ? "positive" : "negative"}{" "}
                    amounts
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="Amount"
                type="number"
                value={formData.amount_dollars}
                onChange={(e) =>
                  setFormData({ ...formData, amount_dollars: e.target.value })
                }
                error={!!formErrors.amount_dollars}
                helperText={
                  formErrors.amount_dollars ||
                  "Use negative for expenses/draws, positive for revenue/contributions"
                }
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
                fullWidth
                multiline
                rows={2}
              />

              <Autocomplete
                options={vendors}
                getOptionLabel={(option) => option.name}
                value={selectedVendor || null}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, vendor_id: newValue?.id || "" })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Vendor (optional)" />
                )}
              />

              <TextField
                label="Memo (optional)"
                value={formData.memo}
                onChange={(e) =>
                  setFormData({ ...formData, memo: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Reference Number (optional)"
                value={formData.reference_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reference_number: e.target.value,
                  })
                }
                helperText="e.g., Check #, Invoice #"
                fullWidth
              />

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Attachments
              </Typography>

              <ReceiptUploader
                transactionId={transactionId}
                existingDocuments={documents}
                onDocumentsChange={setDocuments}
                vendorId={formData.vendor_id || null}
                projectId={formData.project_id || null}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
                justifyContent: "space-between",
              }}
            >
              <Box>
                {transactionId && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={
                      deleting ? <CircularProgress size={20} /> : <DeleteIcon />
                    }
                    onClick={handleDelete}
                    disabled={deleting || saving}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button onClick={onClose} disabled={saving || deleting}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    saving ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                  onClick={handleSubmit}
                  disabled={saving || deleting}
                >
                  {transactionId ? "Update" : "Create"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
