"use client";

import React, { useState } from "react";
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

interface ValidationErrors {
  materialCost?: string;
  companyFee?: string;
}

const EstimateSummary = ({ rooms, onCostsChange, initialCosts }: Props) => {
  const [laborHours, setLaborHours] = useState(0);
  const [materialCost, setMaterialCost] = useState(initialCosts.materialCost);
  const [companyFee, setCompanyFee] = useState(initialCosts.companyFee);
  const [laborCost, setLaborCost] = useState(initialCosts.laborCost);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation function
  const validateField = (
    name: "materialCost" | "companyFee",
    value: number,
  ): string | undefined => {
    if (isNaN(value)) {
      return "Must be a valid number";
    }
    if (value < 0) {
      return `${name === "materialCost" ? "Material cost" : "Company fee"} must be at least $0`;
    }
    return undefined;
  };

  // Calculate and update costs
  const calculateAndUpdateCosts = (
    labor: number,
    material: number,
    fee: number,
  ) => {
    const companyProfit = calculateProfits(labor, material);
    const subtotal = calculateSubtotal(labor, material, fee, companyProfit);
    const taxes = calculateTaxes(subtotal);
    const total = calculateTotal(labor, material, fee, companyProfit, taxes);

    const updatedCosts: ProjectCost = {
      laborCost: labor,
      materialCost: material,
      companyFee: fee,
      companyProfit,
      taxes,
      total,
    };

    onCostsChange(updatedCosts);
    return updatedCosts;
  };

  const handleMaterialCostChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setMaterialCost(numValue);
    const error = validateField("materialCost", numValue);
    setErrors((prev) => ({ ...prev, materialCost: error }));
    if (!error) {
      calculateAndUpdateCosts(laborCost, numValue, companyFee);
    }
  };

  const handleCompanyFeeChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCompanyFee(numValue);
    const error = validateField("companyFee", numValue);
    setErrors((prev) => ({ ...prev, companyFee: error }));
    if (!error) {
      calculateAndUpdateCosts(laborCost, materialCost, numValue);
    }
  };

  const handleLaborChange = (summary: {
    totalHours: number;
    totalCost: number;
  }) => {
    setLaborHours(summary.totalHours);
    setLaborCost(summary.totalCost);
    calculateAndUpdateCosts(summary.totalCost, materialCost, companyFee);
  };

  // Calculate current costs for display
  const companyProfit = calculateProfits(laborCost, materialCost);
  const subtotal = calculateSubtotal(
    laborCost,
    materialCost,
    companyFee,
    companyProfit,
  );
  const taxes = calculateTaxes(subtotal);
  const total = calculateTotal(
    laborCost,
    materialCost,
    companyFee,
    companyProfit,
    taxes,
  );

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
              {formatCurrency(laborCost)}
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
            <TextField
              fullWidth
              size="small"
              type="number"
              value={materialCost}
              onChange={(e) => handleMaterialCostChange(e.target.value)}
              error={!!errors.materialCost}
              helperText={errors.materialCost}
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
          </Box>

          {/* Company Fee */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Company Fee
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={companyFee}
              onChange={(e) => handleCompanyFeeChange(e.target.value)}
              error={!!errors.companyFee}
              helperText={errors.companyFee}
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
              {formatCurrency(companyProfit)}
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
              {formatCurrency(taxes)}
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
            {formatCurrency(total)}
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
