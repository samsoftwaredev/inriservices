"use client";

import React from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import type { Accounts, Vendor, FinancialTransaction } from "@/types";

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  accounts: Map<string, Accounts>;
  vendors: Map<string, Vendor>;
  formatCurrency: (cents: number) => string;
  formatDate: (dateString: string) => string;
  onEditTransaction: (txId: string) => void;
}

export default function TransactionsTable({
  transactions,
  accounts,
  vendors,
  formatCurrency,
  formatDate,
  onEditTransaction,
}: TransactionsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="center">Links</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx) => {
            const account = accounts.get(tx.account_id);
            const vendor = tx.vendor_id ? vendors.get(tx.vendor_id) : null;

            return (
              <TableRow
                key={tx.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onEditTransaction(tx.id)}
              >
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(tx.transaction_date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {account && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {account.name}
                      </Typography>
                      {account.code && (
                        <Typography variant="caption" color="text.secondary">
                          {account.code}
                        </Typography>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{tx.description}</Typography>
                  {tx.memo && (
                    <Typography variant="caption" color="text.secondary">
                      {tx.memo}
                    </Typography>
                  )}
                  {tx.reference_number && (
                    <Chip
                      label={`Ref: ${tx.reference_number}`}
                      size="small"
                      sx={{ ml: 1, height: 20 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {vendor ? (
                    <Chip
                      icon={<BusinessIcon />}
                      label={vendor.name}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                      color:
                        tx.amount_cents < 0 ? "error.main" : "success.main",
                    }}
                  >
                    {formatCurrency(tx.amount_cents)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    {tx.invoice_id && (
                      <Tooltip title="Linked to Invoice">
                        <Chip
                          icon={<ReceiptIcon />}
                          label="INV"
                          size="small"
                          color="primary"
                          sx={{ height: 24 }}
                        />
                      </Tooltip>
                    )}
                    {tx.receipt_id && (
                      <Tooltip title="Linked to Receipt">
                        <Chip
                          icon={<ReceiptIcon />}
                          label="RCP"
                          size="small"
                          color="success"
                          sx={{ height: 24 }}
                        />
                      </Tooltip>
                    )}
                    {tx.project_id && (
                      <Tooltip title="Linked to Project">
                        <Chip
                          icon={<WorkIcon />}
                          label="PRJ"
                          size="small"
                          color="info"
                          sx={{ height: 24 }}
                        />
                      </Tooltip>
                    )}
                    {tx.client_id && (
                      <Tooltip title="Linked to Client">
                        <Chip
                          icon={<PersonIcon />}
                          label="CLT"
                          size="small"
                          color="secondary"
                          sx={{ height: 24 }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
