"use client";

import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AddBox,
  Calculate,
  FormatPaint,
  Work,
  LocalOffer,
  Edit,
  Check,
  Close,
} from "@mui/icons-material";
import { theme } from "@/app/theme";
import { useGallons } from "@/context/useGallons";
import { useBuilding } from "@/context";
import { calculatePaintGallons, convertToFeet } from "@/tools";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DiscountConfig {
  type: "percentage" | "amount";
  value: number;
  isEditing: boolean;
}

// ============================================================================
// COMPONENT DEFINITIONS
// ============================================================================

const GallonsBasePaintType = ({ roomFeature }: { roomFeature?: string }) => {
  const { totalGallonsByBasePaint, measurementUnit } = useGallons();
  if (
    !roomFeature ||
    !totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ] ||
    totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ].reduce((acc, curr) => acc + curr.totalPerimeter, 0) === 0
  ) {
    return null;
  }
  return (
    <Typography variant="body2">
      {totalGallonsByBasePaint[
        roomFeature as keyof typeof totalGallonsByBasePaint
      ]?.map(({ paintBase, totalPerimeter }, index) => {
        const isSquared = roomFeature === "ceiling" || roomFeature === "floor";
        const gallons = calculatePaintGallons(
          totalPerimeter,
          1,
          measurementUnit,
          1,
          isSquared
        );
        const feet = convertToFeet(
          totalPerimeter,
          measurementUnit,
          isSquared
        ).toFixed(2);

        return (
          <span key={index}>
            {paintBase}: {gallons}g. ({feet}ft.)
            {index < Object.entries(totalGallonsByBasePaint).length - 1 && ", "}
          </span>
        );
      })}
    </Typography>
  );
};

// ============================================================================
// CONSTANTS
// ============================================================================

const businessOperationFees = {
  insurance: 25.0,
  paymentSystemFeeFixed: 2.0,
  phoneFee: 4.0,
  promotionFee: 50.0,
  hostWebsiteFee: 5.0,
  domainFee: 5.0,
  thirdPartySoftwareFee: 15.0,
  companyRegistrationFee: 10.0,
  estimateFee: 60.0,
};

const hoursRate = 35;
const costGallons = 65;
const profitMargin = 0.2;
const taxAmount = 0.0825;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EstimateSummary = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const {
    totalGallonsBySection,
    totalGallons,
    mappingNames,
    totalHours,
    totalDays,
  } = useGallons();
  const { buildingData } = useBuilding();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [discount, setDiscount] = useState<DiscountConfig>({
    type: "percentage",
    value: 0,
    isEditing: false,
  });

  const totalRooms = buildingData.sections.length;

  const estimateWorkItems = [
    {
      label: "Paint Cost",
      cost: totalGallons * costGallons,
      icon: <FormatPaint />,
    },
    { label: "Labor Cost", cost: totalHours * hoursRate, icon: <Work /> },
    { label: "Materials", cost: 0, icon: <AddBox /> },
  ];

  const totalGallonsBySectionEntries = Object.entries(
    totalGallonsBySection
  ).filter(([, value]) => value > 0);

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const subtotal = estimateWorkItems.reduce((acc, item) => acc + item.cost, 0);

  // Calculate discount amount
  const discountAmount =
    discount.type === "percentage"
      ? (subtotal * discount.value) / 100
      : discount.value;

  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

  const companyFeesTotal = Object.values(businessOperationFees).reduce(
    (acc, fee) => acc + fee,
    0
  );

  const profitAmount = totalAfterDiscount * profitMargin;
  const totalWithProfit = totalAfterDiscount + profitAmount;
  const taxesToPay = totalWithProfit * taxAmount;
  const paymentSystemFee = totalWithProfit * 0.03 + 2;
  const totalWithTaxes =
    companyFeesTotal + paymentSystemFee + totalWithProfit + taxesToPay;

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleDiscountEdit = () => {
    setDiscount((prev) => ({ ...prev, isEditing: true }));
  };

  const handleDiscountSave = () => {
    setDiscount((prev) => ({ ...prev, isEditing: false }));
  };

  const handleDiscountCancel = () => {
    setDiscount((prev) => ({ ...prev, isEditing: false, value: 0 }));
  };

  const handleDiscountTypeChange = (type: "percentage" | "amount") => {
    setDiscount((prev) => ({ ...prev, type, value: 0 }));
  };

  const handleDiscountValueChange = (value: number) => {
    // Validate percentage (0-100) or amount (non-negative)
    const maxValue = discount.type === "percentage" ? 100 : subtotal;
    const validValue = Math.max(0, Math.min(value, maxValue));
    setDiscount((prev) => ({ ...prev, value: validValue }));
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderDiscountSection = () => (
    <Grid
      size={12}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        px: { xs: 1, sm: 2 },
        py: 1.5,
        borderRadius: 2,
        bgcolor: discountAmount > 0 ? "success.light" : "grey.100",
        opacity: 0.95,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LocalOffer
          sx={{
            color: discountAmount > 0 ? "success.main" : "text.secondary",
            fontSize: { xs: 20, sm: 24 },
          }}
        />
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{ color: discountAmount > 0 ? "success.main" : "text.primary" }}
        >
          Discount
        </Typography>
        {discountAmount > 0 && !discount.isEditing && (
          <Chip
            label={
              discount.type === "percentage"
                ? `${discount.value}%`
                : `$${discount.value.toLocaleString()}`
            }
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {discount.isEditing ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: { xs: 80, sm: 100 } }}>
            <Select
              value={discount.type}
              onChange={(e) =>
                handleDiscountTypeChange(
                  e.target.value as "percentage" | "amount"
                )
              }
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <MenuItem value="percentage">%</MenuItem>
              <MenuItem value="amount">$</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="number"
            value={discount.value}
            onChange={(e) => handleDiscountValueChange(Number(e.target.value))}
            inputProps={{
              min: 0,
              max: discount.type === "percentage" ? 100 : subtotal,
              step: discount.type === "percentage" ? 1 : 50,
            }}
            sx={{
              width: { xs: 80, sm: 120 },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              },
            }}
            InputProps={{
              startAdornment:
                discount.type === "amount" ? (
                  <InputAdornment position="start">$</InputAdornment>
                ) : undefined,
              endAdornment:
                discount.type === "percentage" ? (
                  <InputAdornment position="end">%</InputAdornment>
                ) : undefined,
            }}
          />

          <IconButton size="small" onClick={handleDiscountSave} color="success">
            <Check fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDiscountCancel} color="error">
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color={discountAmount > 0 ? "success.main" : "text.secondary"}
          >
            -${discountAmount.toLocaleString()}
          </Typography>
          <IconButton size="small" onClick={handleDiscountEdit}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Grid>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1.5, sm: 2 },
        background: theme.palette.gradient.colorful,
        color: theme.palette.common.white,
        mb: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        mb={1}
        gap={1}
        flexDirection={{ xs: "column", sm: "row" }}
        textAlign={{ xs: "center", sm: "left" }}
      >
        <Calculate sx={{ fontSize: { xs: 24, sm: 28 } }} />
        <Typography variant={isMobile ? "h6" : "h5"}>
          Estimate Summary
        </Typography>
      </Box>

      <Divider sx={{ my: 1, bgcolor: "white" }} />

      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Cost Items */}
        {estimateWorkItems.map((item, index) => (
          <Grid
            key={index}
            size={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: { xs: 1, sm: 2 }, borderRadius: 4, opacity: 0.9 }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {item.icon}
              </Box>
              {item.label}
            </Typography>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              ${item.cost.toLocaleString()}
            </Typography>
          </Grid>
        ))}

        {/* Subtotal */}
        <Grid
          size={12}
          display="flex"
          justifyContent="space-between"
          sx={{ px: { xs: 1, sm: 2 }, py: 1, opacity: 0.8 }}
        >
          <Typography variant={isMobile ? "body1" : "h6"} fontWeight="300">
            Subtotal
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} fontWeight="300">
            ${subtotal.toLocaleString()}
          </Typography>
        </Grid>

        {/* Discount Section */}
        {renderDiscountSection()}

        <Divider sx={{ my: 1, bgcolor: "white", width: "100%" }} />

        {/* Total Estimate */}
        <Grid
          size={12}
          display="flex"
          bgcolor="primary.light"
          justifyContent="space-between"
          sx={{
            px: { xs: 1, sm: 2 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            opacity: 0.9,
          }}
        >
          <Stack>
            <Typography variant={isMobile ? "h6" : "h4"}>
              Total Estimate
            </Typography>
            {discountAmount > 0 && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                After{" "}
                {discount.type === "percentage"
                  ? `${discount.value}%`
                  : `$${discount.value}`}{" "}
                discount
              </Typography>
            )}
          </Stack>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant={isMobile ? "h5" : "h2"}>
              $
              {totalWithTaxes.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>
              Profit $
              {profitAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>
              Taxes $
              {taxesToPay.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>
              Payment system fee $
              {paymentSystemFee.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>
              Company fees $
              {companyFeesTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Stack>
        </Grid>

        {/* Project Details */}
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            Approximately Total
          </Typography>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {totalHours} | {totalDays} day{totalDays !== 1 ? "s" : ""}
          </Typography>
        </Grid>

        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant={isMobile ? "subtitle1" : "h6"}>Rooms</Typography>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {totalRooms}
          </Typography>
        </Grid>

        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            Paint Gallons
          </Typography>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {totalGallons}
          </Typography>
        </Grid>

        {/* Paint Breakdown */}
        <Grid
          size={12}
          display="flex"
          justifyContent="flex-end"
          flexDirection="column"
          textAlign="right"
        >
          {totalGallonsBySectionEntries.map(([key, value], index) => (
            <Box my={1} key={index}>
              <Typography
                fontWeight="900"
                variant={isMobile ? "body2" : "body1"}
              >
                {mappingNames[key]}: {value} gallons
              </Typography>
              <GallonsBasePaintType roomFeature={key} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EstimateSummary;
