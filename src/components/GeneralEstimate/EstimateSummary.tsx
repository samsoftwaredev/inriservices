"use client";

import React, { useState } from "react";
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

const EstimateSummary = ({ rooms, onCostsChange, initialCosts }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [laborHours, setLaborHours] = useState(0);
  const [costs, setCosts] = useState<ProjectCost>({
    laborCost: initialCosts.laborCost,
    materialCost: initialCosts.materialCost,
    companyFee: initialCosts.companyFee,
    companyProfit: initialCosts.companyProfit,
    taxes: initialCosts.taxes, // 8% tax
    total: initialCosts.total, // Including 8% tax
  });
  const [tempCosts, setTempCosts] = useState(costs);

  const handleEdit = () => {
    setTempCosts(costs);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Calculate company profit as 20% of labor + material costs
    const companyProfit = calculateProfits(
      tempCosts.laborCost,
      tempCosts.materialCost
    );

    // Calculate subtotal
    const subtotal = calculateSubtotal(
      tempCosts.laborCost,
      tempCosts.materialCost,
      tempCosts.companyFee,
      companyProfit
    );

    // Calculate taxes as 8% of subtotal
    const taxes = calculateTaxes(subtotal);

    // Calculate final total including taxes
    const newTotal = calculateTotal(
      tempCosts.laborCost,
      tempCosts.materialCost,
      tempCosts.companyFee,
      companyProfit,
      taxes
    );

    const updatedCosts = {
      ...tempCosts,
      companyProfit,
      taxes,
      total: newTotal,
    };

    setCosts(updatedCosts);
    onCostsChange(updatedCosts);
    setTempCosts(updatedCosts);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCosts(costs);
    setIsEditing(false);
  };

  const handleCostChange = (field: keyof ProjectCost, value: string) => {
    setTempCosts((prev) => ({
      ...prev,
      [field]: parseFloat(value) ? parseFloat(value) : 0,
    }));
  };

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

        <CalcLaborHours
          onLaborChange={(summary) => {
            setLaborHours(summary.totalHours);
            handleCostChange("laborCost", summary.totalCost.toString());
          }}
        />

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
                type="text"
                value={tempCosts.laborCost}
                onChange={(e) => handleCostChange("laborCost", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
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
                type="text"
                value={tempCosts.materialCost}
                onChange={(e) =>
                  handleCostChange("materialCost", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
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
                type="text"
                value={tempCosts.companyFee}
                onChange={(e) => handleCostChange("companyFee", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(costs.companyFee)}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
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
              {formatCurrency(
                isEditing ? tempCosts.companyProfit : costs.companyProfit
              )}
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
              {formatCurrency(isEditing ? tempCosts.taxes : costs.taxes)}
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
            {formatCurrency(isEditing ? tempCosts.total : costs.total)}
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
