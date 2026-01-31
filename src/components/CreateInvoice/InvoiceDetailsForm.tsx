"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Client, Project, Property, InvoiceStatus } from "@/types";
import InvoiceItemsTable from "./InvoiceItemsTable";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  tax_rate_bps: number;
}

interface InvoiceDetailsFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  clients: Client[];
  projects: Project[];
  properties: Property[];
  watchedClientId: string;
  watchedTaxRate: number;
  subtotal: number;
  tax: number;
  total: number;
  formatCurrency: (cents: number) => string;
  fields: Array<InvoiceItem & { id: string }>;
  watchedItems: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  control,
  errors,
  clients,
  projects,
  properties,
  watchedClientId,
  watchedTaxRate,
  subtotal,
  tax,
  total,
  formatCurrency,
  fields,
  watchedItems,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <>
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
                          {String(errors.client_id.message)}
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
                          <MenuItem key={project.id} value={project.id}>
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
                    <FormControl fullWidth disabled={!watchedClientId}>
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
                          <MenuItem key={property.id} value={property.id}>
                            <Box>
                              <Typography variant="body2" component="div">
                                {property.address_line1}
                                {property.address_line2 &&
                                  `, ${property.address_line2}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {property.city}, {property.state} {property.zip}
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
                      helperText={errors.invoice_number?.message as string}
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
                    <Paper elevation={0} sx={{ backgroundColor: "white" }}>
                      <DatePicker
                        {...field}
                        label="Issue Date *"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.issued_date,
                            helperText: errors.issued_date?.message as string,
                          },
                        }}
                      />
                    </Paper>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <Paper elevation={0} sx={{ backgroundColor: "white" }}>
                      <DatePicker
                        {...field}
                        label="Due Date"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    </Paper>
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
                      value={field.value / 100}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) * 100)
                      }
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
                <Typography variant="h6" color="primary" fontWeight="bold">
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
            <InvoiceItemsTable
              fields={fields}
              control={control}
              errors={errors}
              watchedItems={watchedItems}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
              formatCurrency={formatCurrency}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default InvoiceDetailsForm;
