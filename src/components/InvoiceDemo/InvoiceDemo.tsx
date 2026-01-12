"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import {
  InvoiceGenerator,
  InvoiceData,
  InvoiceItem,
  Customer,
} from "../InvoiceGenerator";
import { formatInvoiceCurrency } from "@/tools/invoiceUtils";

// Types for the demo
interface DemoInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface DemoCustomer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const InvoiceDemo: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Customer data
  const [customer, setCustomer] = useState<DemoCustomer>({
    name: "John Smith",
    email: "john.smith@email.com",
    address: "123 Maple Drive",
    city: "Garland",
    state: "TX",
    zipCode: "75040",
  });

  // Invoice items
  const [items, setItems] = useState<DemoInvoiceItem[]>([
    {
      id: "1",
      description: "Living Room - Interior Painting (2 coats)",
      quantity: 1,
      rate: 650,
    },
    {
      id: "2",
      description: "Master Bedroom - Paint & Primer",
      quantity: 1,
      rate: 450,
    },
    {
      id: "3",
      description: "Kitchen - Cabinet Refresh",
      quantity: 1,
      rate: 800,
    },
  ]);

  const [notes, setNotes] = useState(
    "Thank you for choosing InriPaintWall! All work includes premium materials, professional preparation, and cleanup. Payment is due within 30 days of invoice date."
  );

  // Add new item
  const addItem = () => {
    const newItem: DemoInvoiceItem = {
      id: Date.now().toString(),
      description: "New Service",
      quantity: 1,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update item
  const updateItem = (
    id: string,
    field: keyof DemoInvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Update customer
  const updateCustomer = (field: keyof DemoCustomer, value: string) => {
    setCustomer({ ...customer, [field]: value });
  };

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const taxRate = 0.0825; // 8.25% Texas sales tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Generate invoice data
  const generateInvoiceData = (): InvoiceData => {
    const invoiceItems: InvoiceItem[] = items.map((item) => ({
      ...item,
      amount: item.quantity * item.rate,
    }));

    return {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      customer: customer as Customer,
      items: invoiceItems,
      subtotal,
      tax,
      taxRate,
      total,
      notes,
    };
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Invoice Generator Demo
      </Typography>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={customer.name}
                    onChange={(e) => updateCustomer("name", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => updateCustomer("email", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={customer.address}
                    onChange={(e) => updateCustomer("address", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={customer.city}
                    onChange={(e) => updateCustomer("city", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    label="State"
                    value={customer.state}
                    onChange={(e) => updateCustomer("state", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    label="ZIP"
                    value={customer.zipCode}
                    onChange={(e) => updateCustomer("zipCode", e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Subtotal: {formatInvoiceCurrency(subtotal)}
                </Typography>
                <Typography variant="body2">
                  Tax (8.25%): {formatInvoiceCurrency(tax)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" color="primary">
                  Total: {formatInvoiceCurrency(total)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview
                </Button>

                <InvoiceGenerator
                  invoiceData={generateInvoiceData()}
                  buttonText="Download PDF"
                  variant="contained"
                  size="medium"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Items */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Invoice Items</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  size="small"
                >
                  Add Item
                </Button>
              </Box>

              {items.map((item, index) => (
                <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Rate ($)"
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <Typography variant="h6" align="center">
                        {formatInvoiceCurrency(item.quantity * item.rate)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Notes */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional notes for the invoice"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional information, terms, or special instructions..."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              InriPaintWall Invoice
            </Typography>
            <Typography variant="h6" gutterBottom>
              Invoice #{generateInvoiceData().invoiceNumber}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Bill To:
            </Typography>
            <Typography variant="body2">
              {customer.name}
              <br />
              {customer.address}
              <br />
              {customer.city}, {customer.state} {customer.zipCode}
              <br />
              {customer.email}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Items:
              </Typography>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography variant="caption">
                      {item.quantity} × {formatInvoiceCurrency(item.rate)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {formatInvoiceCurrency(item.quantity * item.rate)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: "right" }}>
              <Typography>
                Subtotal: {formatInvoiceCurrency(subtotal)}
              </Typography>
              <Typography>Tax: {formatInvoiceCurrency(tax)}</Typography>
              <Typography variant="h6">
                Total: {formatInvoiceCurrency(total)}
              </Typography>
            </Box>

            {notes && (
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2">{notes}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <InvoiceGenerator
            invoiceData={generateInvoiceData()}
            buttonText="Download PDF"
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceDemo;
