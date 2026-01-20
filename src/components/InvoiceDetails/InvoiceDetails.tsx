"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { invoiceApi } from "@/services";
import { InvoiceWithRelations, InvoiceStatus } from "@/types";
import { InvoiceGenerator, InvoiceData } from "@/components/InvoiceGenerator";
import { toast } from "react-toastify";

interface InvoiceDetailsProps {
  invoiceId: string;
}

const InvoiceDetails = ({ invoiceId }: InvoiceDetailsProps) => {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load invoice data
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const invoiceData = await invoiceApi.getInvoiceFull(invoiceId);
        setInvoice(invoiceData);
      } catch (err) {
        console.error("Error loading invoice:", err);
        setError("Failed to load invoice details");
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: InvoiceStatus) => {
    const colorMap: Record<
      InvoiceStatus,
      "success" | "warning" | "error" | "info" | "default"
    > = {
      draft: "default",
      sent: "info",
      partially_paid: "warning",
      paid: "success",
      overdue: "error",
      void: "default",
    };
    return colorMap[status] || "default";
  };

  // Handle status updates
  const handleStatusUpdate = async (newStatus: InvoiceStatus) => {
    if (!invoice) return;

    try {
      setActionLoading(true);
      await invoiceApi.updateInvoice(invoice.id, { status: newStatus });
      setInvoice({ ...invoice, status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update invoice status");
    } finally {
      setActionLoading(false);
    }
  };

  // Generate PDF data
  const generateInvoiceData = (): InvoiceData | null => {
    if (!invoice || !invoice.client) return null;

    return {
      invoiceNumber: invoice.invoice_number,
      date: formatDate(invoice.issued_date),
      dueDate: invoice.due_date ? formatDate(invoice.due_date) : "Net 30",
      customer: {
        name: invoice.client.display_name,
        email: invoice.client.primary_email || "",
        address: invoice.property?.address_line1 || "",
        city: invoice.property?.city || "",
        state: invoice.property?.state || "",
        zipCode: invoice.property?.zip || "",
      },
      items: invoice.items.map((item) => ({
        id: item.id,
        description: `${item.name}${
          item.description ? ` - ${item.description}` : ""
        }`,
        quantity: item.quantity,
        rate: item.unit_price_cents / 100,
        amount: item.line_subtotal_cents / 100,
      })),
      subtotal: invoice.subtotal_cents / 100,
      tax: invoice.tax_cents / 100,
      taxRate: invoice.tax_rate_bps / 10000,
      total: invoice.total_cents / 100,
      notes: invoice.notes || undefined,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Invoice not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/invoices")}
          variant="outlined"
        >
          Back to Invoices
        </Button>
      </Box>
    );
  }

  const invoiceData = generateInvoiceData();

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Invoice {invoice.invoice_number}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Chip
              label={invoice.status.replace("_", " ").toUpperCase()}
              color={getStatusColor(invoice.status)}
              variant="filled"
            />
            <Typography variant="body2" color="text.secondary">
              Created {formatDate(invoice.created_at)}
            </Typography>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Invoice">
            <IconButton
              onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
              disabled={actionLoading || invoice.status === "paid"}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send Invoice">
            <IconButton
              onClick={() => handleStatusUpdate("sent")}
              disabled={
                actionLoading ||
                invoice.status === "paid" ||
                invoice.status === "void"
              }
            >
              <SendIcon />
            </IconButton>
          </Tooltip>

          {invoiceData && (
            <InvoiceGenerator
              invoiceData={invoiceData}
              buttonText=""
              variant="outlined"
              size="small"
            />
          )}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Invoice Information */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Invoice Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AssignmentIcon sx={{ mr: 1 }} />
                Invoice Details
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Invoice Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {invoice.invoice_number}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Issue Date
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(invoice.issued_date)}
                      </Typography>
                    </Box>

                    {invoice.due_date && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(invoice.due_date)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={invoice.status.replace("_", " ").toUpperCase()}
                          color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Currency
                      </Typography>
                      <Typography variant="body1">
                        {invoice.currency}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tax Rate
                      </Typography>
                      <Typography variant="body1">
                        {(invoice.tax_rate_bps / 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {invoice.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Notes
                    </Typography>
                    <Paper sx={{ p: 2, mt: 1, bgcolor: "grey.50" }}>
                      <Typography variant="body2">{invoice.notes}</Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {invoice.terms && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Payment Terms
                    </Typography>
                    <Paper sx={{ p: 2, mt: 1, bgcolor: "grey.50" }}>
                      <Typography variant="body2">{invoice.terms}</Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          {invoice.client && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  Client Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Client Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {invoice.client.display_name}
                        </Typography>
                      </Box>

                      {invoice.client.primary_email && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                            {invoice.client.primary_email}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Client Type
                        </Typography>
                        <Typography variant="body1">
                          {invoice.client.client_type?.charAt(0).toUpperCase() +
                            invoice.client.client_type?.slice(1) || "N/A"}
                        </Typography>
                      </Box>

                      {invoice.client.primary_phone && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                            {invoice.client.primary_phone}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Property Information */}
          {invoice.property && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <HomeIcon sx={{ mr: 1 }} />
                  Property Information
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                      {invoice.property.address_line1}
                      {invoice.property.address_line2 &&
                        `, ${invoice.property.address_line2}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 3 }}
                    >
                      {invoice.property.city}, {invoice.property.state}{" "}
                      {invoice.property.zip}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Property Type
                    </Typography>
                    <Typography variant="body1">
                      {invoice.property.property_type?.charAt(0).toUpperCase() +
                        invoice.property.property_type?.slice(1) || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Project Information */}
          {invoice.project && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <WorkIcon sx={{ mr: 1 }} />
                  Project Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Project Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {invoice.project.name}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Project Type
                        </Typography>
                        <Typography variant="body1">
                          {invoice.project.project_type
                            ?.replace("_", " ")
                            .toUpperCase() || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body1">
                          {invoice.project.status
                            ?.replace("_", " ")
                            .toUpperCase() || "N/A"}
                        </Typography>
                      </Box>

                      {invoice.project.start_date && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Start Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(invoice.project.start_date)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>

                {invoice.project.scope_notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Project Scope
                      </Typography>
                      <Paper sx={{ p: 2, mt: 1, bgcolor: "grey.50" }}>
                        <Typography variant="body2">
                          {invoice.project.scope_notes}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Financial Summary */}
          <Card sx={{ mb: 3, position: "sticky", top: 20 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <MoneyIcon sx={{ mr: 1 }} />
                Financial Summary
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(invoice.subtotal_cents)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">
                        Tax ({(invoice.tax_rate_bps / 100).toFixed(1)}%):
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(invoice.tax_cents)}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Total:</Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {formatCurrency(invoice.total_cents)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Payment Status
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Amount Paid:</Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="success.main"
                      >
                        {formatCurrency(invoice.paid_cents)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Balance Due:</Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={
                          invoice.balance_cents && invoice.balance_cents > 0
                            ? "error.main"
                            : "success.main"
                        }
                      >
                        {formatCurrency(
                          invoice.balance_cents ||
                            invoice.total_cents - invoice.paid_cents
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Quick Actions */}
                {invoice.status !== "paid" && invoice.status !== "void" && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Quick Actions
                      </Typography>
                      <Stack spacing={1}>
                        {invoice.status === "draft" && (
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<SendIcon />}
                            onClick={() => handleStatusUpdate("sent")}
                            disabled={actionLoading}
                          >
                            Send Invoice
                          </Button>
                        )}

                        {(invoice.status === "sent" ||
                          invoice.status === "partially_paid") && (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<PaymentIcon />}
                            onClick={() => handleStatusUpdate("paid")}
                            disabled={actionLoading}
                          >
                            Mark as Paid
                          </Button>
                        )}

                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<ReceiptIcon />}
                          onClick={() =>
                            router.push(`/receipts?invoice_id=${invoice.id}`)
                          }
                        >
                          View Receipts
                        </Button>
                      </Stack>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Items */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DescriptionIcon sx={{ mr: 1 }} />
                Invoice Items ({invoice.items.length})
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="center" width="100px">
                        Qty
                      </TableCell>
                      <TableCell align="right" width="120px">
                        Unit Price
                      </TableCell>
                      <TableCell align="right" width="120px">
                        Subtotal
                      </TableCell>
                      <TableCell align="right" width="120px">
                        Tax
                      </TableCell>
                      <TableCell align="right" width="120px">
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.items
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {item.description || "—"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {item.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(item.unit_price_cents)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(item.line_subtotal_cents)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(item.line_tax_cents)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(item.line_total_cents)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}

                    {/* Totals Row */}
                    <TableRow>
                      <TableCell colSpan={4} />
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatCurrency(invoice.subtotal_cents)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatCurrency(invoice.tax_cents)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          {formatCurrency(invoice.total_cents)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetails;
