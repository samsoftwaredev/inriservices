"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Autocomplete,
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { assetsApi } from "@/services/assetsApi";
import { vendorsApi } from "@/services/vendersApi";
import { accountsApi } from "@/services/accountsApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import type { Asset, AssetStatus, Vendor, Accounts } from "@/types";
import { Constants } from "../../../database.types";
import { formatCurrency } from "@/tools/costTools";
import PageHeader from "../PageHeader";

interface AssetFormData {
  name: string;
  category: string;
  purchase_date: string;
  purchase_price_dollars: string;
  vendor_id: string;
  status: AssetStatus;
  notes: string;
  createTransaction: boolean;
}

const emptyForm: AssetFormData = {
  name: "",
  category: "",
  purchase_date: new Date().toISOString().split("T")[0],
  purchase_price_dollars: "",
  vendor_id: "",
  status: "active",
  notes: "",
  createTransaction: true,
};

const StatusColors: Record<AssetStatus, string> = {
  active: "success",
  sold: "info",
  disposed: "default",
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AssetsManager() {
  const currentYear = new Date().getFullYear();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assetAccounts, setAssetAccounts] = useState<Accounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "">("");
  const [yearFilter, setYearFilter] = useState<number | "">(currentYear);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<AssetFormData>>({});
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  // Year options
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await assetsApi.list({
        q: searchQuery || undefined,
        status: statusFilter || undefined,
        year: yearFilter || undefined,
        limit: 500,
      });
      setAssets(result.items);
    } catch (err) {
      console.error("Failed to load assets:", err);
      setError("Failed to load assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load vendors and asset accounts
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [vendorsResult, accountsResult] = await Promise.all([
          vendorsApi.list({ limit: 500 }),
          accountsApi.list({ type: "asset", is_active: true, limit: 100 }),
        ]);
        setVendors(vendorsResult.items);
        setAssetAccounts(accountsResult.items);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, yearFilter]);

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        name: asset.name,
        category: asset.category ?? "",
        purchase_date: asset.purchase_date.split("T")[0],
        purchase_price_dollars: (asset.purchase_price_cents / 100).toFixed(2),
        vendor_id: asset.vendor_id ?? "",
        status: asset.status,
        notes: asset.notes ?? "",
        createTransaction: false, // Don't create on edit
      });
    } else {
      setEditingAsset(null);
      setFormData(emptyForm);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAsset(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<AssetFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.purchase_date) {
      errors.purchase_date = "Purchase date is required";
    }

    if (!formData.purchase_price_dollars.trim()) {
      errors.purchase_price_dollars = "Purchase price is required";
    } else {
      const num = parseFloat(formData.purchase_price_dollars);
      if (isNaN(num) || num < 0) {
        errors.purchase_price_dollars = "Invalid price";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      const priceCents = Math.round(
        parseFloat(formData.purchase_price_dollars) * 100,
      );

      let transactionId: string | null = null;

      // Create transaction if requested (only on new assets)
      if (!editingAsset && formData.createTransaction) {
        if (assetAccounts.length === 0) {
          setError(
            'No asset accounts found. Please create an asset account in the "Accounts" tab first.',
          );
          setSaving(false);
          return;
        }

        // Use first asset account (or let user choose in future enhancement)
        const assetAccount = assetAccounts[0];

        const transaction = await financialTransactionsApi.create({
          transaction_date: formData.purchase_date,
          account_id: assetAccount.id,
          amount_cents: -priceCents, // Negative = cash out
          description: `Asset Purchase: ${formData.name.trim()}`,
          memo: formData.category.trim() || null,
          vendor_id: formData.vendor_id || null,
          source: "manual",
          company_id: "", // Set by RLS
          currency: "USD",
          reference_number: null,
          project_id: null,
          client_id: null,
          invoice_id: null,
          receipt_id: null,
          external_id: null,
        });

        transactionId = transaction.id;
      }

      const assetPayload: any = {
        name: formData.name.trim(),
        category: formData.category.trim() || null,
        purchase_date: formData.purchase_date,
        purchase_price_cents: priceCents,
        vendor_id: formData.vendor_id || null,
        status: formData.status,
        notes: formData.notes.trim() || null,
        transaction_id: transactionId,
      };

      if (editingAsset) {
        await assetsApi.update(editingAsset.id, assetPayload);
        setSuccessMessage("Asset updated successfully!");
      } else {
        assetPayload.company_id = ""; // Set by RLS
        await assetsApi.create(assetPayload);
        setSuccessMessage(
          `Asset created successfully!${formData.createTransaction ? " Transaction also created." : ""}`,
        );
      }

      handleCloseDialog();
      loadAssets();
    } catch (err: any) {
      console.error("Failed to save asset:", err);
      setError("Failed to save asset. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    setError(null);
    try {
      await assetsApi.delete(assetToDelete.id);
      setSuccessMessage("Asset deleted successfully!");
      setDeleteConfirmOpen(false);
      setAssetToDelete(null);
      loadAssets();
    } catch (err) {
      console.error("Failed to delete asset:", err);
      setError("Failed to delete asset. Please try again.");
      setDeleteConfirmOpen(false);
    }
  };

  const assetStatuses: readonly AssetStatus[] =
    Constants.public.Enums.asset_status;
  const selectedVendor = vendors.find((v) => v.id === formData.vendor_id);

  return (
    <Box>
      <PageHeader
        title="Assets Manager"
        subtitle="Track and manage your business assets"
        actions={
          <Button
            variant="contained"
            sx={{ my: 1 }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Asset
          </Button>
        }
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by name, category, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) =>
                setStatusFilter(e.target.value as AssetStatus | "")
              }
            >
              <MenuItem value="">All Statuses</MenuItem>
              {assetStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Purchase Year</InputLabel>
            <Select
              value={yearFilter}
              label="Purchase Year"
              onChange={(e) => setYearFilter(e.target.value as number | "")}
            >
              <MenuItem value="">All Years</MenuItem>
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : assets.length === 0 ? (
        <Alert severity="info">
          {searchQuery || statusFilter || yearFilter
            ? "No assets found matching your filters."
            : "No assets yet. Add your first asset to get started."}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell align="right">Purchase Price</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => {
                const vendor = asset.vendor_id
                  ? vendors.find((v) => v.id === asset.vendor_id)
                  : null;

                return (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {asset.name}
                      </Typography>
                      {asset.notes && (
                        <Typography variant="caption" color="text.secondary">
                          {asset.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{asset.category || "—"}</TableCell>
                    <TableCell>{formatDate(asset.purchase_date)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(asset.purchase_price_cents)}
                      </Typography>
                    </TableCell>
                    <TableCell>{vendor?.name || "—"}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={asset.status}
                        size="small"
                        color={StatusColors[asset.status] as any}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(asset)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(asset)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAsset ? "Edit Asset" : "Add New Asset"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Asset Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              fullWidth
            />

            <TextField
              label="Category (optional)"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              helperText="e.g., Equipment, Tools, Vehicle"
              fullWidth
            />

            <TextField
              label="Purchase Date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) =>
                setFormData({ ...formData, purchase_date: e.target.value })
              }
              error={!!formErrors.purchase_date}
              helperText={formErrors.purchase_date}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Purchase Price"
              type="number"
              value={formData.purchase_price_dollars}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchase_price_dollars: e.target.value,
                })
              }
              error={!!formErrors.purchase_price_dollars}
              helperText={formErrors.purchase_price_dollars}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
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

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as AssetStatus,
                  })
                }
              >
                {assetStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Notes (optional)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />

            {!editingAsset && (
              <Alert severity="info">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="checkbox"
                    checked={formData.createTransaction}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        createTransaction: e.target.checked,
                      })
                    }
                  />
                  <Typography variant="body2">
                    Create matching transaction in ledger (recommended)
                  </Typography>
                </Box>
                {formData.createTransaction && assetAccounts.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    Warning: No asset accounts found. Create one first in the
                    Accounts tab.
                  </Typography>
                )}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {editingAsset ? "Update" : "Create"}
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
            Are you sure you want to delete the asset &quot;
            {assetToDelete?.name}&quot;? This action cannot be undone.
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
