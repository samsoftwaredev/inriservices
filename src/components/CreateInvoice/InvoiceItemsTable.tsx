"use client";
import React from "react";
import {
  TextField,
  IconButton,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  tax_rate_bps: number;
}

interface InvoiceItemsTableProps {
  fields: Array<InvoiceItem & { id: string }>;
  control: Control<any>;
  errors: FieldErrors<any>;
  watchedItems: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  formatCurrency: (cents: number) => string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  fields,
  control,
  errors,
  watchedItems,
  onAddItem,
  onRemoveItem,
  formatCurrency,
}) => {
  return (
    <>
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
          onClick={onAddItem}
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

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Card key={field.id} variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                {/* Item Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    display="block"
                  >
                    Item Name *
                  </Typography>
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
                        error={!!(errors.items as any)?.[index]?.name}
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    display="block"
                  >
                    Description
                  </Typography>
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
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Quantity */}
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    display="block"
                  >
                    Quantity
                  </Typography>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Unit Price */}
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    display="block"
                  >
                    Unit Price
                  </Typography>
                  <Controller
                    name={`items.${index}.unit_price_cents`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={field.value / 100}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) * 100)
                        }
                        placeholder="0.00"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Total */}
                <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    height="100%"
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                        display="block"
                      >
                        Total
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(
                          watchedItems[index]?.quantity *
                            watchedItems[index]?.unit_price_cents || 0,
                        )}
                      </Typography>
                    </Box>

                    {/* Delete Button */}
                    {fields.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveItem(index)}
                        sx={{ mb: 0.5 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
};

export default InvoiceItemsTable;
