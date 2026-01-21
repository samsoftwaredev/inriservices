"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Divider,
  InputAdornment,
} from "@mui/material";
import { ProjectCost, PropertyRoomTransformed } from "@/types";
import { PROFIT_MARGIN_PERCNT, TAX_RATE_PERCNT } from "@/constants";
import {
  calculateProfits,
  calculateSubtotal,
  calculateTaxes,
  calculateTotal,
  formatCurrency,
} from "@/tools";
import CalcLaborHours from "./CalcLaborHours";

interface Props {
  rooms: PropertyRoomTransformed[];
  onCostsChange: (costs: ProjectCost) => void;
  initialCosts: ProjectCost;
}

interface CostFormData {
  laborCost: number;
  materialCost: number;
  companyFee: number;
}

const EstimateSummary = ({ rooms, onCostsChange, initialCosts }: Props) => {
  const [laborHours, setLaborHours] = useState(0);
  const [costs, setCosts] = useState<ProjectCost>({
    laborCost: initialCosts.laborCost,
    materialCost: initialCosts.materialCost,
    companyFee: initialCosts.companyFee,
    companyProfit: initialCosts.companyProfit,
    taxes: initialCosts.taxes,
    total: initialCosts.total,
  });

  const { control, watch, setValue } = useForm<CostFormData>({
    defaultValues: {
      laborCost: initialCosts.laborCost,
      materialCost: initialCosts.materialCost,
      companyFee: initialCosts.companyFee,
    },
  });

  const handleLaborChange = (summary: {
    totalHours: number;
    totalCost: number;
  }) => {
    setLaborHours(summary.totalHours);
    setValue("laborCost", summary.totalCost);
  };

  // Watch form values
  const formValues = watch();

  // Auto-calculate costs when form values change
  useEffect(() => {
    const { laborCost, materialCost, companyFee } = formValues;

    // Calculate company profit as 20% of labor + material costs
    const companyProfit = calculateProfits(laborCost, materialCost);

    // Calculate subtotal
    const subtotal = calculateSubtotal(
      laborCost,
      materialCost,
      companyFee,
      companyProfit,
    );

    // Calculate taxes as 8% of subtotal
    const taxes = calculateTaxes(subtotal);

    // Calculate final total including taxes
    const total = calculateTotal(
      laborCost,
      materialCost,
      companyFee,
      companyProfit,
      taxes,
    );

    const updatedCosts = {
      laborCost,
      materialCost,
      companyFee,
      companyProfit,
      taxes,
      total,
    };

    setCosts(updatedCosts);
    onCostsChange(updatedCosts);
  }, [formValues, onCostsChange]);

  return (
    <Box>
      {/* Estimate Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Estimate Summary</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Rooms: {rooms.length}
        </Typography>

        <CalcLaborHours onLaborChange={handleLaborChange} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          {/* Labor Cost */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Labor Cost
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              color="primary.main"
            >
              {formatCurrency(costs.laborCost)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on {laborHours} hrs
            </Typography>
          </Box>

          {/* Material Cost */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Material Cost
            </Typography>
            <Controller
              name="materialCost"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />
              )}
            />
          </Box>

          {/* Company Fee */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Company Fee
            </Typography>
            <Controller
              name="companyFee"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          {/* Labor Hours Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Labor Hours
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {laborHours} hrs
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Auto-calculated
            </Typography>
          </Box>

          {/* Company Profit (20% of Labor + Material) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Company Profit ({PROFIT_MARGIN_PERCNT * 100}%)
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              color="success.main"
            >
              {formatCurrency(costs.companyProfit)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Auto-calculated
            </Typography>
          </Box>

          {/* Taxes Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Taxes ({TAX_RATE_PERCNT * 100}%)
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              color="warning.main"
            >
              {formatCurrency(costs.taxes)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Auto-calculated
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Estimated Total:</Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatCurrency(costs.total)}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          *Final pricing may vary based on specific requirements.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EstimateSummary;
