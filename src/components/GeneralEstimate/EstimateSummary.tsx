"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { PropertyRoomTransformed } from "@/types";

interface EstimateCosts {
  laborCost: number;
  materialCost: number;
  companyFee: number;
  companyProfit: number;
  total: number;
}

interface Props {
  rooms: PropertyRoomTransformed[];
  onCostsChange?: (costs: EstimateCosts) => void;
  initialCosts?: Partial<EstimateCosts>;
}

const EstimateSummary = ({ rooms, onCostsChange, initialCosts }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [costs, setCosts] = useState<EstimateCosts>(() => {
    // Calculate initial estimates based on room count
    const baseEstimate = rooms.length * 450 + (rooms.length - 1) * 50;
    const defaultLaborCost = Math.round(baseEstimate * 0.4);
    const defaultMaterialCost = Math.round(baseEstimate * 0.3);
    const defaultCompanyFee = Math.round(baseEstimate * 0.15);
    const defaultCompanyProfit = Math.round(
      (defaultLaborCost + defaultMaterialCost) * 0.2
    );

    return {
      laborCost: initialCosts?.laborCost ?? defaultLaborCost,
      materialCost: initialCosts?.materialCost ?? defaultMaterialCost,
      companyFee: initialCosts?.companyFee ?? defaultCompanyFee,
      companyProfit: initialCosts?.companyProfit ?? defaultCompanyProfit,
      total: initialCosts?.total ?? baseEstimate,
    };
  });

  const [tempCosts, setTempCosts] = useState(costs);

  // Calculate and update total whenever costs change
  const updateTotal = useCallback(() => {
    const newTotal = costs.laborCost + costs.materialCost + costs.companyFee;
    if (newTotal !== costs.total) {
      const updatedCosts = { ...costs, total: newTotal };
      setCosts(updatedCosts);
      onCostsChange?.(updatedCosts);
    }
  }, [costs, onCostsChange]);

  const handleEdit = () => {
    setTempCosts(costs);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Calculate company profit as 20% of labor + material costs
    const companyProfit = Math.round(
      (tempCosts.laborCost + tempCosts.materialCost) * 0.2
    );
    const newTotal =
      tempCosts.laborCost +
      tempCosts.materialCost +
      tempCosts.companyFee +
      companyProfit;
    const updatedCosts = { ...tempCosts, companyProfit, total: newTotal };
    setCosts(updatedCosts);
    onCostsChange?.(updatedCosts);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCosts(costs);
    setIsEditing(false);
  };

  const handleCostChange = (field: keyof EstimateCosts, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempCosts((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const tempCompanyProfit = Math.round(
    (tempCosts.laborCost + tempCosts.materialCost) * 0.2
  );
  const tempTotal =
    tempCosts.laborCost +
    tempCosts.materialCost +
    tempCosts.companyFee +
    tempCompanyProfit;
  return (
    <Box>
      {/* Estimate Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Estimate Summary</Typography>
          {!isEditing ? (
            <Tooltip title="Edit costs">
              <IconButton onClick={handleEdit} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Save changes">
                <IconButton onClick={handleSave} size="small" color="primary">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton
                  onClick={handleCancel}
                  size="small"
                  color="secondary"
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Rooms: {rooms.length}
        </Typography>

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
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                type="number"
                value={tempCosts.laborCost}
                onChange={(e) => handleCostChange("laborCost", e.target.value)}
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
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(costs.laborCost)}
              </Typography>
            )}
          </Box>

          {/* Material Cost */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Material Cost
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                type="number"
                value={tempCosts.materialCost}
                onChange={(e) =>
                  handleCostChange("materialCost", e.target.value)
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
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(costs.materialCost)}
              </Typography>
            )}
          </Box>

          {/* Company Fee */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Company Fee
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                type="number"
                value={tempCosts.companyFee}
                onChange={(e) => handleCostChange("companyFee", e.target.value)}
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
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(costs.companyFee)}
              </Typography>
            )}
          </Box>

          {/* Company Profit (20% of Labor + Material) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Company Profit (20%)
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              color="success.main"
            >
              {formatCurrency(
                isEditing ? tempCompanyProfit : costs.companyProfit
              )}
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
            {formatCurrency(isEditing ? tempTotal : costs.total)}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          *Tax not included. Final pricing may vary based on specific
          requirements.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EstimateSummary;
