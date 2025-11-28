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
import { BUSINESS_OPERATION_FEES, PRICING_CONFIG } from "@/constants";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DiscountConfig {
  type: "percentage" | "amount";
  value: number;
  isEditing: boolean;
}

interface CostCalculation {
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  profitAmount: number;
  totalWithProfit: number;
  taxesToPay: number;
  paymentSystemFee: number;
  companyFeesTotal: number;
  totalWithTaxes: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_DISCOUNT: DiscountConfig = {
  type: "percentage",
  value: 0,
  isEditing: false,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateTotalCompanyFees = (): number => {
  return Object.values(BUSINESS_OPERATION_FEES).reduce(
    (acc, fee) => acc + fee,
    0
  );
};

const calculateDiscount = (
  subtotal: number,
  discount: DiscountConfig
): number => {
  if (discount.type === "percentage") {
    return (subtotal * discount.value) / 100;
  }
  return discount.value;
};

const calculateCosts = (
  estimateItems: Array<{ cost: number }>,
  discount: DiscountConfig
): CostCalculation => {
  const subtotal = estimateItems.reduce((acc, item) => acc + item.cost, 0);
  const discountAmount = calculateDiscount(subtotal, discount);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const companyFeesTotal = calculateTotalCompanyFees();
  const profitAmount = totalAfterDiscount * PRICING_CONFIG.profitMargin;
  const totalWithProfit = totalAfterDiscount + profitAmount;
  const taxesToPay = totalWithProfit * PRICING_CONFIG.taxAmount;
  const paymentSystemFee =
    totalWithProfit * PRICING_CONFIG.paymentFeeRate +
    PRICING_CONFIG.paymentFeeFixed;
  const totalWithTaxes =
    companyFeesTotal + paymentSystemFee + totalWithProfit + taxesToPay;

  return {
    subtotal,
    discountAmount,
    totalAfterDiscount,
    profitAmount,
    totalWithProfit,
    taxesToPay,
    paymentSystemFee,
    companyFeesTotal,
    totalWithTaxes,
  };
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const validateDiscountValue = (
  value: number,
  type: DiscountConfig["type"],
  maxAmount: number
): number => {
  const maxValue = type === "percentage" ? 100 : maxAmount;
  return Math.max(0, Math.min(value, maxValue));
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const GallonsBasePaintType = ({ roomFeature }: { roomFeature?: string }) => {
  const { totalGallonsByBasePaint, measurementUnit } = useGallons();

  const paintData =
    totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ];

  if (
    !roomFeature ||
    !paintData ||
    paintData.reduce((acc, curr) => acc + curr.totalPerimeter, 0) === 0
  ) {
    return null;
  }

  return (
    <Typography variant="body2">
      {paintData.map(({ paintBase, totalPerimeter }, index) => {
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
            {index < paintData.length - 1 && ", "}
          </span>
        );
      })}
    </Typography>
  );
};

const CostItem = ({
  item,
  isMobile,
}: {
  item: { label: string; cost: number; icon: React.ReactNode };
  isMobile: boolean;
}) => (
  <Grid
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
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        {item.icon}
      </Box>
      {item.label}
    </Typography>
    <Typography variant={isMobile ? "subtitle1" : "h6"}>
      ${item.cost.toLocaleString()}
    </Typography>
  </Grid>
);

const SubtotalRow = ({
  subtotal,
  isMobile,
}: {
  subtotal: number;
  isMobile: boolean;
}) => (
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
);

const TotalEstimateCard = ({
  costs,
  discount,
  isMobile,
}: {
  costs: CostCalculation;
  discount: DiscountConfig;
  isMobile: boolean;
}) => (
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
      <Typography variant={isMobile ? "h6" : "h4"}>Total Estimate</Typography>
      {costs.discountAmount > 0 && (
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
        ${formatCurrency(costs.totalWithTaxes)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Profit ${formatCurrency(costs.profitAmount)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Taxes ${formatCurrency(costs.taxesToPay)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Payment system fee ${formatCurrency(costs.paymentSystemFee)}
      </Typography>
      <Typography variant={isMobile ? "caption" : "body2"}>
        Company fees ${formatCurrency(costs.companyFeesTotal)}
      </Typography>
    </Stack>
  </Grid>
);

const ProjectDetailsSection = ({
  totalHours,
  totalDays,
  totalRooms,
  totalGallons,
  isMobile,
}: {
  totalHours: number;
  totalDays: number;
  totalRooms: number;
  totalGallons: number;
  isMobile: boolean;
}) => (
  <>
    <Grid size={12} display="flex" justifyContent="space-between">
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        Approximately Total
      </Typography>
      <Typography variant={isMobile ? "subtitle1" : "h6"}>
        {totalHours} hrs | {totalDays} day{totalDays !== 1 ? "s" : ""}
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
  </>
);

const PaintBreakdownSection = ({
  totalGallonsBySectionEntries,
  mappingNames,
  isMobile,
}: {
  totalGallonsBySectionEntries: Array<[string, number]>;
  mappingNames: Record<string, string>;
  isMobile: boolean;
}) => (
  <Grid
    size={12}
    display="flex"
    justifyContent="flex-end"
    flexDirection="column"
    textAlign="right"
  >
    {totalGallonsBySectionEntries.map(([key, value], index) => (
      <Box my={1} key={index}>
        <Typography fontWeight="900" variant={isMobile ? "body2" : "body1"}>
          {mappingNames[key]}: {value} gallons
        </Typography>
        <GallonsBasePaintType roomFeature={key} />
      </Box>
    ))}
  </Grid>
);

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

  const [discount, setDiscount] = useState<DiscountConfig>(DEFAULT_DISCOUNT);

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const totalRooms = buildingData.sections.length;

  const estimateWorkItems = [
    {
      label: "Paint Cost",
      cost: totalGallons * PRICING_CONFIG.costGallons,
      icon: <FormatPaint />,
    },
    {
      label: "Labor Cost",
      cost: totalHours * PRICING_CONFIG.hoursRate,
      icon: <Work />,
    },
    {
      label: "Materials",
      cost: 0,
      icon: <AddBox />,
    },
  ];

  const totalGallonsBySectionEntries = Object.entries(
    totalGallonsBySection
  ).filter(([, value]) => value > 0);

  const costs = calculateCosts(estimateWorkItems, discount);

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
    setDiscount(DEFAULT_DISCOUNT);
  };

  const handleDiscountTypeChange = (type: "percentage" | "amount") => {
    setDiscount((prev) => ({ ...prev, type, value: 0 }));
  };

  const handleDiscountValueChange = (value: number) => {
    const validValue = validateDiscountValue(
      value,
      discount.type,
      costs.subtotal
    );
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
        bgcolor: costs.discountAmount > 0 ? "success.dark" : "grey.100",
        opacity: 0.95,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LocalOffer
          sx={{
            color:
              costs.discountAmount > 0 ? "success.light" : "text.secondary",
            fontSize: { xs: 20, sm: 24 },
          }}
        />
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{
            color: costs.discountAmount > 0 ? "success.light" : "text.primary",
          }}
        >
          Discount
        </Typography>
        {costs.discountAmount > 0 && !discount.isEditing && (
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
              max: discount.type === "percentage" ? 100 : costs.subtotal,
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
            color={
              costs.discountAmount > 0 ? "success.light" : "text.secondary"
            }
          >
            -${costs.discountAmount.toLocaleString()}
          </Typography>
          <IconButton size="small" onClick={handleDiscountEdit}>
            <Edit
              fontSize="small"
              sx={{
                color:
                  costs.discountAmount > 0 ? "success.light" : "text.secondary",
              }}
            />
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
      {/* Header */}
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
          <CostItem key={index} item={item} isMobile={isMobile} />
        ))}

        {/* Subtotal */}
        <SubtotalRow subtotal={costs.subtotal} isMobile={isMobile} />

        {/* Discount Section */}
        {renderDiscountSection()}

        <Divider sx={{ my: 1, bgcolor: "white", width: "100%" }} />

        {/* Total Estimate */}
        <TotalEstimateCard
          costs={costs}
          discount={discount}
          isMobile={isMobile}
        />

        {/* Project Details */}
        <ProjectDetailsSection
          totalHours={totalHours}
          totalDays={totalDays}
          totalRooms={totalRooms}
          totalGallons={totalGallons}
          isMobile={isMobile}
        />

        {/* Paint Breakdown */}
        <PaintBreakdownSection
          totalGallonsBySectionEntries={totalGallonsBySectionEntries}
          mappingNames={mappingNames}
          isMobile={isMobile}
        />
      </Grid>
    </Paper>
  );
};

export default EstimateSummary;
