"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { ReceiptStatus, PaymentMethod } from "@/types";
import { ReceiptWithClient } from "@/services/receiptApi";

interface ReceiptsTableProps {
  receipts: ReceiptWithClient[];
  loading: boolean;
  onViewReceipt: (receiptId: string) => void;
  onEditReceipt: (receiptId: string) => void;
}

const ReceiptsTable = ({
  receipts,
  loading,
  onViewReceipt,
  onEditReceipt,
}: ReceiptsTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null,
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    receiptId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReceiptId(receiptId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReceiptId(null);
  };

  const handleView = () => {
    if (selectedReceiptId) {
      onViewReceipt(selectedReceiptId);
      handleMenuClose();
    }
  };

  const handleEdit = () => {
    if (selectedReceiptId) {
      onEditReceipt(selectedReceiptId);
      handleMenuClose();
    }
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

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>Receipt ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Loading receipts...
                </TableCell>
              </TableRow>
            ) : receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">
                    No receipts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => (
                <TableRow key={receipt.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      #{receipt.id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(receipt.amount_cents, receipt.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getPaymentMethodDisplay(receipt.payment_method)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={receipt.status.toUpperCase()}
                      color={getStatusColor(receipt.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(receipt.paid_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      component="a"
                      href={`clients/${receipt.client_id}`}
                      variant="body2"
                      fontFamily="monospace"
                    >
                      {receipt.client.display_name} <br />
                      {receipt.client.primary_email} <br />
                      {receipt.client.primary_phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {receipt.reference_number || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, receipt.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          <ListItemText>View Receipt</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Receipt</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ReceiptsTable;
