"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Speed,
  Build,
  Security,
  AttachMoney,
  AccountBalance,
} from "@mui/icons-material";
import InfoTooltip from "../InfoTooltip";

interface ProjectExpectations {
  materialQuality: number;
  velocity: number;
  projectDetails: number;
  workmanshipMonths: number;
  budgetRange: number[];
}

interface Props {
  baseCost: number;
  onCostChange: (
    adjustedCost: number,
    expectations: ProjectExpectations
  ) => void;
}

const CustomerExpectations = ({ baseCost, onCostChange }: Props) => {
  const [expectations, setExpectations] = useState<ProjectExpectations>({
    materialQuality: 1, // 0: Low, 1: Medium, 2: High
    velocity: 0, // 0: Standard, 1: Fast, 2: Super Fast
    projectDetails: 1, // 0: Low, 1: Medium, 2: High
    workmanshipMonths: 2, // Index in warranty months array
    budgetRange: [100, 30000], // Min and max budget in dollars
  });

  // Configuration for each slider
  const materialQualityOptions = [
    { label: "Low", multiplier: 0.8, color: "#ff5722" },
    { label: "Medium", multiplier: 1.0, color: "#ff9800" },
    { label: "High", multiplier: 1.4, color: "#4caf50" },
  ];

  const velocityOptions = [
    { label: "Standard", multiplier: 1.0, color: "#2196f3" },
    { label: "Fast", multiplier: 1.25, color: "#ff9800" },
    { label: "Lightning", multiplier: 1.6, color: "#f44336" },
  ];

  const projectDetailOptions = [
    { label: "Low", multiplier: 0.9, color: "#9e9e9e" },
    { label: "Medium", multiplier: 1.0, color: "#2196f3" },
    { label: "High", multiplier: 1.3, color: "#9c27b0" },
  ];

  const workmanshipMonthsOptions = [
    { label: "No Warranty", months: 0, multiplier: 0.95, color: "#9e9e9e" },
    { label: "1 Month", months: 1, multiplier: 1.0, color: "#607d8b" },
    { label: "2 Months", months: 2, multiplier: 1.02, color: "#2196f3" },
    { label: "3 Months", months: 3, multiplier: 1.05, color: "#03a9f4" },
    { label: "5 Months", months: 5, multiplier: 1.08, color: "#00bcd4" },
    { label: "8 Months", months: 8, multiplier: 1.12, color: "#009688" },
    { label: "12 Months", months: 12, multiplier: 1.15, color: "#4caf50" },
  ];

  // Calculate adjusted cost based on all factors
  const calculateAdjustedCost = (currentExpectations: ProjectExpectations) => {
    const materialMultiplier =
      materialQualityOptions[currentExpectations.materialQuality].multiplier;
    const velocityMultiplier =
      velocityOptions[currentExpectations.velocity].multiplier;
    const detailMultiplier =
      projectDetailOptions[currentExpectations.projectDetails].multiplier;
    const warrantyMultiplier =
      workmanshipMonthsOptions[currentExpectations.workmanshipMonths]
        .multiplier;

    return (
      baseCost *
      materialMultiplier *
      velocityMultiplier *
      detailMultiplier *
      warrantyMultiplier
    );
  };

  // Check if adjusted cost is within budget range
  const isWithinBudget = (cost: number) => {
    const [minBudget, maxBudget] = expectations.budgetRange;
    return cost >= minBudget && cost <= maxBudget;
  };

  // Update cost whenever expectations change
  useEffect(() => {
    const adjustedCost = calculateAdjustedCost(expectations);
    onCostChange(adjustedCost, expectations);
  }, [expectations, baseCost, onCostChange]);

  const handleSliderChange = (
    field: keyof ProjectExpectations,
    value: number | number[]
  ) => {
    if (field === "budgetRange") {
      setExpectations((prev) => ({
        ...prev,
        [field]: value as number[],
      }));
    } else {
      const newValue = Array.isArray(value) ? value[0] : value;
      setExpectations((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    }
  };

  const adjustedCost = calculateAdjustedCost(expectations);
  const costDifference = adjustedCost - baseCost;
  const percentageChange = (costDifference / baseCost) * 100;
  const withinBudget = isWithinBudget(adjustedCost);

  // Budget slider marks for key values
  const budgetMarks = [
    { value: 0, label: "$0" },
    { value: 5000, label: "$5K" },
    { value: 10000, label: "$10K" },
    { value: 15000, label: "$15K" },
    { value: 20000, label: "$20K" },
    { value: 25000, label: "$25K" },
    { value: 30000, label: "$30K" },
  ];

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TrendingUp fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h6">Cost Adjustments</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Budget Range Slider */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccountBalance sx={{ mr: 1, fontSize: 20, color: "info.dark" }} />
            <Typography variant="subtitle1" gutterBottom>
              Project Budget Range
              <InfoTooltip message="Ask the customers for the minimum and maximum budget for your project." />
            </Typography>
            <Chip
              label={`$${expectations.budgetRange[0].toLocaleString()} - $${expectations.budgetRange[1].toLocaleString()}`}
              size="small"
              sx={{
                ml: 2,
                bgcolor: "info.dark",
                color: "white",
              }}
            />
          </Box>
          <Slider
            value={expectations.budgetRange}
            onChange={(_, value) => handleSliderChange("budgetRange", value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$${value.toLocaleString()}`}
            min={0}
            max={30000}
            step={100}
            marks={budgetMarks}
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Set your minimum and maximum budget range for this project
          </Typography>
        </Box>

        {/* Cost Summary */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 5,
            borderColor: "grey.300",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Base Cost
              </Typography>
              <Typography variant="h6">${baseCost.toLocaleString()}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Adjustment
              </Typography>
              <Typography
                variant="h6"
                color={costDifference >= 0 ? "error.main" : "success.main"}
              >
                {costDifference >= 0 ? "+" : ""}$
                {Math.abs(costDifference).toLocaleString()}
                <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                  ({percentageChange >= 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%)
                </Typography>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Final Cost
              </Typography>
              <Typography
                variant="h6"
                color={withinBudget ? "primary.main" : "error.main"}
              >
                ${adjustedCost.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Budget Status
              </Typography>
              <Chip
                label={withinBudget ? "Within Budget" : "Out of Budget"}
                size="small"
                color={withinBudget ? "success" : "error"}
                variant={withinBudget ? "filled" : "outlined"}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={15} mx={3}>
          {/* Material Quality */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Build sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Material Quality
                  <InfoTooltip message="Select the quality of materials for the project." />
                </Typography>
                <Chip
                  label={
                    materialQualityOptions[expectations.materialQuality].label
                  }
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor:
                      materialQualityOptions[expectations.materialQuality]
                        .color,
                    color: "white",
                  }}
                />
              </Box>
              <Slider
                value={expectations.materialQuality}
                onChange={(_, value) =>
                  handleSliderChange("materialQuality", value)
                }
                min={0}
                max={2}
                step={1}
                marks={materialQualityOptions.map((option, index) => ({
                  value: index,
                  label: option.label,
                }))}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                Cost impact:{" "}
                {(
                  (materialQualityOptions[expectations.materialQuality]
                    .multiplier -
                    1) *
                  100
                ).toFixed(0)}
                %
              </Typography>
            </Box>
          </Grid>

          {/* Project Velocity */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Speed sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Project Velocity
                  <InfoTooltip message="Select the desired speed of project completion." />
                </Typography>
                <Chip
                  label={velocityOptions[expectations.velocity].label}
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: velocityOptions[expectations.velocity].color,
                    color: "white",
                  }}
                />
              </Box>
              <Slider
                value={expectations.velocity}
                onChange={(_, value) => handleSliderChange("velocity", value)}
                min={0}
                max={2}
                step={1}
                marks={velocityOptions.map((option, index) => ({
                  value: index,
                  label: option.label,
                }))}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                Cost impact: +
                {(
                  (velocityOptions[expectations.velocity].multiplier - 1) *
                  100
                ).toFixed(0)}
                %
              </Typography>
            </Box>
          </Grid>

          {/* Project Details */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoney sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Project Details
                  <InfoTooltip message="Select the desired level of detail for project specifications." />
                </Typography>
                <Chip
                  label={
                    projectDetailOptions[expectations.projectDetails].label
                  }
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor:
                      projectDetailOptions[expectations.projectDetails].color,
                    color: "white",
                  }}
                />
              </Box>
              <Slider
                value={expectations.projectDetails}
                onChange={(_, value) =>
                  handleSliderChange("projectDetails", value)
                }
                min={0}
                max={2}
                step={1}
                marks={projectDetailOptions.map((option, index) => ({
                  value: index,
                  label: option.label,
                }))}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                Cost impact:{" "}
                {(
                  (projectDetailOptions[expectations.projectDetails]
                    .multiplier -
                    1) *
                  100
                ).toFixed(0)}
                %
              </Typography>
            </Box>
          </Grid>

          {/* Workmanship Warranty */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Security sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Workmanship Warranty
                  <InfoTooltip message="Select the duration of the workmanship warranty for the project." />
                </Typography>
                <Chip
                  label={
                    workmanshipMonthsOptions[expectations.workmanshipMonths]
                      .label
                  }
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor:
                      workmanshipMonthsOptions[expectations.workmanshipMonths]
                        .color,
                    color: "white",
                  }}
                />
              </Box>
              <Slider
                value={expectations.workmanshipMonths}
                onChange={(_, value) =>
                  handleSliderChange("workmanshipMonths", value)
                }
                min={0}
                max={6}
                step={1}
                marks={workmanshipMonthsOptions.map((option, index) => ({
                  value: index,
                  label: `${option.months}mo`,
                }))}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                Cost impact: +
                {(
                  (workmanshipMonthsOptions[expectations.workmanshipMonths]
                    .multiplier -
                    1) *
                  100
                ).toFixed(1)}
                %
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Box
          sx={{
            p: 2,
            bgcolor: withinBudget ? "primary.50" : "error.50",
            borderRadius: 1,
            border: withinBudget ? "none" : "1px solid",
            borderColor: withinBudget ? "transparent" : "error.main",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Project Configuration Summary:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {materialQualityOptions[expectations.materialQuality].label}{" "}
            materials •{" "}
            {velocityOptions[expectations.velocity].label.toLowerCase()}{" "}
            delivery timeline •{" "}
            {projectDetailOptions[
              expectations.projectDetails
            ].label.toLowerCase()}{" "}
            level of detail •{" "}
            {workmanshipMonthsOptions[expectations.workmanshipMonths].label}{" "}
            workmanship warranty
          </Typography>
          {!withinBudget && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              ⚠️ Current configuration exceeds your budget range. Consider
              adjusting your expectations to stay within budget.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerExpectations;
