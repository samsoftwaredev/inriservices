"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { accountsApi } from "@/services/accountsApi";
import type { Accounts, AccountType } from "@/types";
import { Constants } from "../../../database.types";

interface AccountFormData {
  name: string;
  type: AccountType;
  code: string;
  description: string;
  is_active: boolean;
}

const emptyForm: AccountFormData = {
  name: "",
  type: "expense",
  code: "",
  description: "",
  is_active: true,
};

const AccountTypeColors: Record<AccountType, string> = {
  revenue: "success",
  cogs: "warning",
  expense: "error",
  asset: "info",
  liability: "secondary",
  equity: "primary",
};

export default function AccountsManager() {
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Accounts | null>(null);
  const [formData, setFormData] = useState<AccountFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<AccountFormData>>({});

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Accounts | null>(null);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await accountsApi.list({ limit: 500 });
      setAccounts(result.items);
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError("Failed to load accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleOpenDialog = (account?: Accounts) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        code: account.code ?? "",
        description: account.description ?? "",
        is_active: account.is_active,
      });
    } else {
      setEditingAccount(null);
      setFormData(emptyForm);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<AccountFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.type) {
      (errors as any).type = "Type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError(null);
    try {
      if (editingAccount) {
        await accountsApi.update(editingAccount.id, {
          name: formData.name.trim(),
          type: formData.type,
          code: formData.code.trim() || null,
          description: formData.description.trim() || null,
          is_active: formData.is_active,
        });
        setSuccessMessage("Account updated successfully!");
      } else {
        // For create, we need company_id (handled by RLS on backend)
        await accountsApi.create({
          name: formData.name.trim(),
          type: formData.type,
          code: formData.code.trim() || null,
          description: formData.description.trim() || null,
          is_active: formData.is_active,
          company_id: "", // Will be set by backend via RLS
          parent_account_id: null,
        });
        setSuccessMessage("Account created successfully!");
      }

      handleCloseDialog();
      loadAccounts();
    } catch (err: any) {
      console.error("Failed to save account:", err);
      if (err.message?.includes("duplicate") || err.code === "23505") {
        setError("An account with this code already exists.");
      } else {
        setError("Failed to save account. Please try again.");
      }
    }
  };

  const handleDeleteClick = (account: Accounts) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    setError(null);
    try {
      await accountsApi.delete(accountToDelete.id);
      setSuccessMessage("Account deleted successfully!");
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
      loadAccounts();
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError("Failed to delete account. It may be in use by transactions.");
      setDeleteConfirmOpen(false);
    }
  };

  const handleToggleActive = async (account: Accounts) => {
    try {
      await accountsApi.update(account.id, {
        is_active: !account.is_active,
      });
      setSuccessMessage(
        `Account ${!account.is_active ? "activated" : "deactivated"}!`,
      );
      loadAccounts();
    } catch (err) {
      console.error("Failed to toggle account status:", err);
      setError("Failed to update account status.");
    }
  };

  // Group accounts by type
  const groupedAccounts = accounts.reduce(
    (acc, account) => {
      if (!acc[account.type]) acc[account.type] = [];
      acc[account.type].push(account);
      return acc;
    },
    {} as Record<AccountType, Accounts[]>,
  );

  const accountTypes: readonly AccountType[] =
    Constants.public.Enums.account_type;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Chart of Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Account
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Alert severity="info">
          No accounts yet. Create your first account to get started.
        </Alert>
      ) : (
        <Box>
          {accountTypes.map((type) => {
            const typeAccounts = groupedAccounts[type] || [];
            if (typeAccounts.length === 0) return null;

            return (
              <Box key={type} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    textTransform: "capitalize",
                    color: `${AccountTypeColors[type]}.main`,
                  }}
                >
                  {type}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {typeAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          sx={{
                            opacity: account.is_active ? 1 : 0.5,
                          }}
                        >
                          <TableCell>
                            <code>{account.code || "—"}</code>
                          </TableCell>
                          <TableCell>
                            <strong>{account.name}</strong>
                          </TableCell>
                          <TableCell>{account.description || "—"}</TableCell>
                          <TableCell align="center">
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={account.is_active}
                                  onChange={() => handleToggleActive(account)}
                                  color="success"
                                />
                              }
                              label={account.is_active ? "Active" : "Inactive"}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(account)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(account)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAccount ? "Edit Account" : "Add New Account"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Account Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              fullWidth
            />

            <FormControl fullWidth required error={!!formErrors.type}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={formData.type}
                label="Account Type"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as AccountType,
                  })
                }
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Chip
                      label={type.toUpperCase()}
                      size="small"
                      color={AccountTypeColors[type] as any}
                      sx={{ mr: 1 }}
                    />
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Account Code (optional)"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              error={!!formErrors.code}
              helperText={formErrors.code || "e.g., 4000, 5100"}
              fullWidth
            />

            <TextField
              label="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  color="success"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAccount ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the account &quot;
            {accountToDelete?.name}&quot;? This action cannot be undone and may
            fail if the account is linked to transactions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
