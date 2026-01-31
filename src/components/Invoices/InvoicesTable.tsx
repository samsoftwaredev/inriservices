"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { InvoiceStatus } from "@/types";
import { InvoiceWithClient } from "@/services/invoiceApi";

interface Props {
  invoices: InvoiceWithClient[];
  loading: boolean;
  page: number;
  totalCount: number;
  itemsPerPage: number;
  onViewInvoice: (invoiceId: string) => void;
  onEditInvoice: (invoiceId: string) => void;
  onPageChange: (page: number) => void;
}

const InvoicesTable = ({
  invoices,
  loading,
  page,
  totalCount,
  itemsPerPage,
  onViewInvoice,
  onEditInvoice,
  onPageChange,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    invoiceId: string,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedInvoiceId(invoiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoiceId(null);
  };

  const handleView = () => {
    if (selectedInvoiceId) {
      onViewInvoice(selectedInvoiceId);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedInvoiceId) {
      onEditInvoice(selectedInvoiceId);
    }
    handleMenuClose();
  };

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
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (
    status: InvoiceStatus,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "info";
      case "draft":
        return "default";
      case "overdue":
        return "error";
      case "partially_paid":
        return "warning";
      case "void":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">
                    No invoices found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} hover sx={{ cursor: "pointer" }}>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2" fontWeight="medium">
                      {invoice.invoice_number}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography
                      component="a"
                      href={`clients/${invoice.client.id}`}
                      variant="body2"
                    >
                      {invoice.client.display_name}{" "}
                      {invoice.client.primary_email}{" "}
                      {invoice.client.primary_phone}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(invoice.total_cents || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2">
                      {formatCurrency(invoice.paid_cents || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2">
                      {formatCurrency(invoice.balance_cents || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Chip
                      label={invoice.status.replace("_", " ").toUpperCase()}
                      color={getStatusColor(invoice.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2">
                      {invoice.issued_date
                        ? formatDate(invoice.issued_date)
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onViewInvoice(invoice.id)}>
                    <Typography variant="body2">
                      {invoice.due_date ? formatDate(invoice.due_date) : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="More Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, invoice.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Invoice</ListItemText>
        </MenuItem>
      </Menu>

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(totalCount / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default InvoicesTable;
