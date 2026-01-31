"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Receipt as InvoiceIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { invoiceApi, invoiceItemApi, clientApi, projectApi } from "@/services";
import { Client, Project, Property, InvoiceStatus, Invoice } from "@/types";
import { useAuth } from "@/context";
import { generateInvoiceNumber } from "@/tools/invoiceUtils";
import { toast } from "react-toastify";
import PageHeader from "../PageHeader";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  tax_rate_bps: number;
}

interface CreateInvoiceFormData {
  client_id: string;
  project_id?: string;
  property_id?: string;
  invoice_number: string;
  issued_date: Date;
  due_date?: Date;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  tax_rate_bps: number;
  items: InvoiceItem[];
}

interface CreateInvoiceProps {
  invoiceId?: string;
}

const CreateInvoice = ({ invoiceId }: CreateInvoiceProps) => {
  const router = useRouter();
  const { userData } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing] = useState(!!invoiceId);
  const [initialDataLoaded, setInitialDataLoaded] = useState(!invoiceId);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInvoiceFormData>({
    defaultValues: {
      invoice_number: generateInvoiceNumber(),
      issued_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "draft",
      tax_rate_bps: 800, // 8% tax rate
      items: [
        {
          id: "1",
          name: "Service Item",
          description: "Description of the service provided",
          quantity: 1,
          unit_price_cents: 0,
          tax_rate_bps: 800,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");
  const watchedTaxRate = watch("tax_rate_bps");
  const watchedClientId = watch("client_id");

  // Load existing invoice data for editing
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!invoiceId) return;

      try {
        setLoading(true);
        const invoiceData = await invoiceApi.getInvoiceFull(invoiceId);

        // Set form values from existing invoice
        setValue("client_id", invoiceData.client_id);
        setValue("project_id", invoiceData.project_id || "");
        setValue("property_id", invoiceData.property_id || "");
        setValue("invoice_number", invoiceData.invoice_number);
        setValue("issued_date", new Date(invoiceData.issued_date));
        setValue(
          "due_date",
          invoiceData.due_date ? new Date(invoiceData.due_date) : undefined,
        );
        setValue("status", invoiceData.status);
        setValue("notes", invoiceData.notes || "");
        setValue("terms", invoiceData.terms || "");
        setValue("tax_rate_bps", invoiceData.tax_rate_bps);

        // Set invoice items
        const formItems = invoiceData.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          quantity: item.quantity,
          unit_price_cents: item.unit_price_cents,
          tax_rate_bps: item.tax_rate_bps || invoiceData.tax_rate_bps,
        }));
        setValue("items", formItems);

        setInitialDataLoaded(true);
      } catch (err) {
        console.error("Error loading invoice:", err);
        setError("Failed to load invoice data");
        toast.error("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceData();
  }, [invoiceId, setValue]);

  // Load clients on mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsResult = await clientApi.listClients({ limit: 100 });
        setClients(clientsResult.items);
      } catch (err) {
        console.error("Error loading clients:", err);
        toast.error("Failed to load clients");
      }
    };

    loadClients();
  }, []);

  // Load projects when client changes
  useEffect(() => {
    const loadProjects = async () => {
      if (!watchedClientId) {
        setProjects([]);
        return;
      }

      try {
        const projectsResult = await projectApi.listProjects({
          client_id: watchedClientId,
          limit: 50,
        });
        setProjects(projectsResult.items);
      } catch (err) {
        console.error("Error loading projects:", err);
        setProjects([]);
      }
    };

    loadProjects();
  }, [watchedClientId]);

  // Load properties when client changes
  useEffect(() => {
    const loadProperties = async () => {
      if (!watchedClientId) {
        setProperties([]);
        if (!isEditing) {
          setValue("property_id", "");
        }
        return;
      }

      try {
        const selectedClient = clients.find((c) => c.id === watchedClientId);
        if (selectedClient) {
          const clientWithProperties = await clientApi.getClient(
            selectedClient.id,
          );
          setProperties(clientWithProperties.properties || []);
        }
      } catch (err) {
        console.error("Error loading properties:", err);
        setProperties([]);
      }
    };

    if (clients.length > 0 && watchedClientId && initialDataLoaded) {
      loadProperties();
    }
  }, [watchedClientId, clients, setValue, isEditing, initialDataLoaded]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = watchedItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price_cents,
      0,
    );

    const tax = Math.round((subtotal * watchedTaxRate) / 10000);
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
    };
  };

  const { subtotal, tax, total } = calculateTotals();

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Add new item
  const addItem = () => {
    append({
      id: `temp_${Date.now()}`,
      name: "New Item",
      description: "",
      quantity: 1,
      unit_price_cents: 0,
      tax_rate_bps: watchedTaxRate,
    });
  };

  // Submit form
  const onSubmit = async (data: CreateInvoiceFormData) => {
    if (!userData?.companyId) {
      setError("Company information is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let invoice: Invoice;

      if (isEditing && invoiceId) {
        // Update existing invoice
        const invoiceInput = {
          client_id: data.client_id,
          project_id: data.project_id || null,
          property_id: data.property_id || null,
          invoice_number: data.invoice_number,
          issued_date: data.issued_date.toISOString().split("T")[0],
          due_date: data.due_date
            ? data.due_date.toISOString().split("T")[0]
            : null,
          status: data.status,
          currency: "USD",
          subtotal_cents: subtotal,
          tax_cents: tax,
          tax_rate_bps: data.tax_rate_bps,
          total_cents: total,
          notes: data.notes || null,
          terms: data.terms || null,
        };

        invoice = await invoiceApi.updateInvoice(invoiceId, invoiceInput);

        // Get existing items to compare
        const existingItems = await invoiceItemApi.listInvoiceItems(invoiceId);

        // Delete items that are no longer in the form
        const formItemIds = data.items
          .filter((item) => !item.id.startsWith("temp_"))
          .map((item) => item.id);
        const itemsToDelete = existingItems.filter(
          (item) => !formItemIds.includes(item.id),
        );

        for (const item of itemsToDelete) {
          await invoiceItemApi.deleteInvoiceItem(item.id);
        }

        // Update or create items
        const itemPromises = data.items.map(async (item) => {
          if (
            item.id.startsWith("temp_") ||
            !existingItems.find((ei) => ei.id === item.id)
          ) {
            // Create new item
            return invoiceItemApi.createInvoiceItem({
              company_id: userData.companyId,
              invoice_id: invoiceId,
              name: item.name,
              description: item.description || null,
              quantity: item.quantity,
              unit_price_cents: item.unit_price_cents,
              tax_rate_bps: item.tax_rate_bps || data.tax_rate_bps,
              sort_order: data.items.indexOf(item),
            });
          } else {
            // Update existing item
            return invoiceItemApi.updateInvoiceItem(item.id, {
              name: item.name,
              description: item.description || null,
              quantity: item.quantity,
              unit_price_cents: item.unit_price_cents,
              tax_rate_bps: item.tax_rate_bps || data.tax_rate_bps,
              sort_order: data.items.indexOf(item),
            });
          }
        });

        await Promise.all(itemPromises);
      } else {
        // Create new invoice
        const invoiceInput = {
          company_id: userData.companyId,
          client_id: data.client_id,
          project_id: data.project_id || null,
          property_id: data.property_id || null,
          invoice_number: data.invoice_number,
          issued_date: data.issued_date.toISOString().split("T")[0],
          due_date: data.due_date
            ? data.due_date.toISOString().split("T")[0]
            : null,
          status: data.status,
          currency: "USD",
          subtotal_cents: subtotal,
          tax_cents: tax,
          tax_rate_bps: data.tax_rate_bps,
          total_cents: total,
          notes: data.notes || null,
          terms: data.terms || null,
        };

        invoice = await invoiceApi.createInvoice(invoiceInput);

        // Create invoice items
        const itemPromises = data.items.map((item) =>
          invoiceItemApi.createInvoiceItem({
            company_id: userData.companyId,
            invoice_id: invoice.id,
            name: item.name,
            description: item.description || null,
            quantity: item.quantity,
            unit_price_cents: item.unit_price_cents,
            tax_rate_bps: item.tax_rate_bps || data.tax_rate_bps,
            sort_order: data.items.indexOf(item),
          }),
        );

        await Promise.all(itemPromises);
      }

      toast.success(
        isEditing
          ? "Invoice updated successfully!"
          : "Invoice created successfully!",
      );
      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(
        "Failed to create invoice. Please check your data and try again.",
      );
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Show loading state while loading initial data in edit mode */}
        {isEditing && !initialDataLoaded ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Header */}
            <PageHeader
              title={isEditing ? "Edit Invoice" : "Create New Invoice"}
              subtitle={
                isEditing
                  ? "Update invoice details"
                  : "Fill in the details to create a new invoice"
              }
            />

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Invoice Details Card */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Invoice Details
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="client_id"
                            control={control}
                            rules={{ required: "Client is required" }}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.client_id}>
                                <InputLabel>Client *</InputLabel>
                                <Select {...field} label="Client *">
                                  {clients.map((client) => (
                                    <MenuItem key={client.id} value={client.id}>
                                      {client.display_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.client_id && (
                                  <Typography variant="caption" color="error">
                                    {errors.client_id.message}
                                  </Typography>
                                )}
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="project_id"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>Project (Optional)</InputLabel>
                                <Select
                                  {...field}
                                  label="Project (Optional)"
                                  value={field.value || ""}
                                >
                                  <MenuItem value="">
                                    <em>No Project</em>
                                  </MenuItem>
                                  {projects.map((project) => (
                                    <MenuItem
                                      key={project.id}
                                      value={project.id}
                                    >
                                      {project.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="property_id"
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                disabled={!watchedClientId}
                              >
                                <InputLabel>Property (Optional)</InputLabel>
                                <Select
                                  {...field}
                                  label="Property (Optional)"
                                  value={field.value || ""}
                                >
                                  <MenuItem value="">
                                    <em>No Property</em>
                                  </MenuItem>
                                  {properties.map((property) => (
                                    <MenuItem
                                      key={property.id}
                                      value={property.id}
                                    >
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          component="div"
                                        >
                                          {property.address_line1}
                                          {property.address_line2 &&
                                            `, ${property.address_line2}`}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {property.city}, {property.state}{" "}
                                          {property.zip}
                                        </Typography>
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="invoice_number"
                            control={control}
                            rules={{ required: "Invoice number is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Invoice Number *"
                                error={!!errors.invoice_number}
                                helperText={errors.invoice_number?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select {...field} label="Status">
                                  <MenuItem value="draft">Draft</MenuItem>
                                  <MenuItem value="sent">Sent</MenuItem>
                                  <MenuItem value="paid">Paid</MenuItem>
                                  <MenuItem value="void">Void</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="issued_date"
                            control={control}
                            rules={{ required: "Issue date is required" }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                label="Issue Date *"
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    error: !!errors.issued_date,
                                    helperText: errors.issued_date?.message,
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="due_date"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                label="Due Date"
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name="tax_rate_bps"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Tax Rate (%)"
                                type="number"
                                value={field.value / 100} // Convert basis points to percentage
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value) * 100)
                                } // Convert percentage to basis points
                                inputProps={{ min: 0, max: 50, step: 0.25 }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 3 }}>
                        <Controller
                          name="notes"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Notes"
                              multiline
                              rows={3}
                              placeholder="Add any additional notes for this invoice..."
                            />
                          )}
                        />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Controller
                          name="terms"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Payment Terms"
                              multiline
                              rows={2}
                              placeholder="Payment terms and conditions..."
                            />
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Invoice Summary Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Invoice Summary
                      </Typography>

                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Subtotal:</Typography>
                          <Typography fontWeight="medium">
                            {formatCurrency(subtotal)}
                          </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between">
                          <Typography>
                            Tax ({(watchedTaxRate / 100).toFixed(1)}%):
                          </Typography>
                          <Typography fontWeight="medium">
                            {formatCurrency(tax)}
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
                            {formatCurrency(total)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Invoice Items */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                        flexDirection={{ xs: "column", sm: "row" }}
                        gap={{ xs: 2, sm: 0 }}
                      >
                        <Typography variant="h6">Invoice Items</Typography>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={addItem}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: { xs: "100%", sm: "auto" },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Add Item
                        </Button>
                      </Box>

                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Item Name</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell width="100px">Qty</TableCell>
                              <TableCell width="130px">Unit Price</TableCell>
                              <TableCell width="130px">Total</TableCell>
                              <TableCell width="60px">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {fields.map((field, index) => (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <Controller
                                    name={`items.${index}.name`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        size="small"
                                        variant="outlined"
                                        placeholder="Item name"
                                        error={!!errors.items?.[index]?.name}
                                      />
                                    )}
                                  />
                                </TableCell>

                                <TableCell>
                                  <Controller
                                    name={`items.${index}.description`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        size="small"
                                        variant="outlined"
                                        placeholder="Description"
                                        multiline
                                        maxRows={2}
                                      />
                                    )}
                                  />
                                </TableCell>

                                <TableCell>
                                  <Controller
                                    name={`items.${index}.quantity`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 1 }}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    )}
                                  />
                                </TableCell>

                                <TableCell>
                                  <Controller
                                    name={`items.${index}.unit_price_cents`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 0, step: 0.01 }}
                                        value={field.value / 100} // Convert cents to dollars
                                        onChange={(e) =>
                                          field.onChange(
                                            Number(e.target.value) * 100,
                                          )
                                        } // Convert dollars to cents
                                        placeholder="0.00"
                                      />
                                    )}
                                  />
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {formatCurrency(
                                      watchedItems[index]?.quantity *
                                        watchedItems[index]?.unit_price_cents ||
                                        0,
                                    )}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  {fields.length > 1 && (
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => remove(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Submit Buttons */}
                <Grid size={{ xs: 12 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ width: "100%" }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => router.back()}
                      disabled={loading}
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        order: { xs: 3, sm: 0 },
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setValue("status", "draft")}
                      disabled={loading}
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        order: { xs: 2, sm: 0 },
                      }}
                    >
                      <SaveIcon sx={{ mr: 1 }} />
                      Save as Draft
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      onClick={() => setValue("status", "sent")}
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        order: { xs: 1, sm: 0 },
                      }}
                    >
                      <SendIcon sx={{ mr: 1 }} />
                      {loading
                        ? isEditing
                          ? "Updating..."
                          : "Creating..."
                        : isEditing
                          ? "Update & Send Invoice"
                          : "Create & Send Invoice"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default CreateInvoice;
