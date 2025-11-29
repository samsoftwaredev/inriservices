"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
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
import { useGallons } from "@/context/useGallons";
import { useProjectPrice } from "@/context";
import { PRICING_CONFIG } from "@/constants";
import { DiscountConfig } from "@/interfaces/laborTypes";
import { calculateCosts, validateDiscountValue } from "@/tools/costTools";

const DEFAULT_DISCOUNT: DiscountConfig = {
  type: "percentage",
  value: 0,
  isEditing: false,
};

const DiscountSection = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { totalProjectPrice, totalProjectLaborCost } = useProjectPrice();
  const [discount, setDiscount] = useState<DiscountConfig>(DEFAULT_DISCOUNT);

  const { totalGallons, totalHours } = useGallons();

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

  const costs = calculateCosts(estimateWorkItems, discount);

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

  return (
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
};

export default DiscountSection;
