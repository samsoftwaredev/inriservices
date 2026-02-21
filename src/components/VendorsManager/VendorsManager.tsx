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
  Drawer,
  FormControl,
  IconButton,
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
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { vendorsApi } from "@/services/vendersApi";
import { financialTransactionsApi } from "@/services/financialTransactionsApi";
import type { Vendor, VendorType, FinancialTransaction } from "@/types";
import { Constants } from "../../../database.types";
import PageHeader from "../PageHeader";
import VendorsFilters from "./VendorsFilters";

interface VendorFormData {
  name: string;
  type: VendorType;
  email: string;
  phone: string;
  notes: string;
}

const emptyForm: VendorFormData = {
  name: "",
  type: "supplier",
  email: "",
  phone: "",
  notes: "",
};

const VendorTypeColors: Record<VendorType, string> = {
  supplier: "primary",
  subcontractor: "warning",
  service: "info",
  other: "default",
};

const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

export default function VendorsManager() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<VendorType | "">("");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<VendorFormData>>({});

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  // Detail drawer
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorTransactions, setVendorTransactions] = useState<
    FinancialTransaction[]
  >([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const loadVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await vendorsApi.list({
        q: searchQuery || undefined,
        type: typeFilter || undefined,
        limit: 500,
      });
      setVendors(result.items);
    } catch (err) {
      console.error("Failed to load vendors:", err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, typeFilter]);

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        type: vendor.type,
        email: vendor.email ?? "",
        phone: vendor.phone ?? "",
        notes: vendor.notes ?? "",
      });
    } else {
      setEditingVendor(null);
      setFormData(emptyForm);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVendor(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<VendorFormData> = {};

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
      if (editingVendor) {
        await vendorsApi.update(editingVendor.id, {
          name: formData.name.trim(),
          type: formData.type,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          notes: formData.notes.trim() || null,
        });
        setSuccessMessage("Vendor updated successfully!");
      } else {
        await vendorsApi.create({
          name: formData.name.trim(),
          type: formData.type,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          notes: formData.notes.trim() || null,
          tax_id_last4: null,
          company_id: "", // Will be set by backend via RLS
        });
        setSuccessMessage("Vendor created successfully!");
      }

      handleCloseDialog();
      loadVendors();
    } catch (err: any) {
      console.error("Failed to save vendor:", err);
      setError("Failed to save vendor. Please try again.");
    }
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vendorToDelete) return;

    setError(null);
    try {
      await vendorsApi.delete(vendorToDelete.id);
      setSuccessMessage("Vendor deleted successfully!");
      setDeleteConfirmOpen(false);
      setVendorToDelete(null);
      loadVendors();
    } catch (err) {
      console.error("Failed to delete vendor:", err);
      setError("Failed to delete vendor. It may be in use by transactions.");
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailDrawerOpen(true);
    setLoadingTransactions(true);

    try {
      const currentYear = new Date().getFullYear();
      const result = await financialTransactionsApi.list({
        vendor_id: vendor.id,
        year: currentYear,
        limit: 100,
      });
      setVendorTransactions(result.items);
    } catch (err) {
      console.error("Failed to load vendor transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const vendorTypes: readonly VendorType[] = Constants.public.Enums.vendor_type;

  return (
    <Box>
      <PageHeader
        title="Vendors"
        subtitle="Manage your suppliers, subcontractors, and service providers"
        actions={
          <Button
            variant="contained"
            sx={{ my: 1 }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Vendor
          </Button>
        }
      />

      {/* Filters */}
      <VendorsFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        vendorTypes={vendorTypes}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : vendors.length === 0 ? (
        <Alert severity="info">
          {searchQuery || typeFilter
            ? "No vendors found matching your filters."
            : "No vendors yet. Create your first vendor to get started."}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Tax ID</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewDetails(vendor)}
                >
                  <TableCell>
                    <strong>{vendor.name}</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.type}
                      size="small"
                      color={VendorTypeColors[vendor.type] as any}
                    />
                  </TableCell>
                  <TableCell>{vendor.email || "—"}</TableCell>
                  <TableCell>{vendor.phone || "—"}</TableCell>
                  <TableCell>
                    {vendor.tax_id_last4 ? `***${vendor.tax_id_last4}` : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(vendor);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(vendor);
                      }}
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
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingVendor ? "Edit Vendor" : "Add New Vendor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Vendor Name"
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
              <InputLabel>Vendor Type</InputLabel>
              <Select
                value={formData.type}
                label="Vendor Type"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as VendorType,
                  })
                }
              >
                {vendorTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Email (optional)"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Phone (optional)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              fullWidth
            />

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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVendor ? "Update" : "Create"}
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
            Are you sure you want to delete the vendor &quot;
            {vendorToDelete?.name}&quot;? This action cannot be undone.
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

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        PaperProps={{ sx: { width: 500 } }}
      >
        {selectedVendor && (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">{selectedVendor.name}</Typography>
              <IconButton onClick={() => setDetailDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Chip
                label={selectedVendor.type}
                color={VendorTypeColors[selectedVendor.type] as any}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {selectedVendor.email || "—"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {selectedVendor.phone || "—"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax ID (Last 4)
                </Typography>
                <Typography variant="body1">
                  {selectedVendor.tax_id_last4
                    ? `***${selectedVendor.tax_id_last4}`
                    : "—"}
                </Typography>
              </Box>

              {selectedVendor.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedVendor.notes}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions ({new Date().getFullYear()})
            </Typography>

            {loadingTransactions ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : vendorTransactions.length === 0 ? (
              <Alert severity="info" icon={<ReceiptIcon />}>
                No transactions this year
              </Alert>
            ) : (
              <List>
                {vendorTransactions.map((tx) => (
                  <ListItem key={tx.id} divider>
                    <ListItemText
                      primary={tx.description}
                      secondary={new Date(
                        tx.transaction_date,
                      ).toLocaleDateString()}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          tx.amount_cents < 0 ? "error.main" : "success.main",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(tx.amount_cents)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Drawer>

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
