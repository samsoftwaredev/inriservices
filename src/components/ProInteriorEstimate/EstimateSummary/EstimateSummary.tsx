"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddBox, Calculate, FormatPaint, Work } from "@mui/icons-material";
import { theme } from "@/app/theme";
import { useGallons } from "@/context/GallonsContext";
import { useBuilding, useProjectCost } from "@/context";
import { PRICING_CONFIG } from "@/constants";
import { CostItem } from "./CostItem";
import { SubtotalRow } from "./SubtotalRow";
import { ProjectDetailsSection } from "./ProjectDetailsSection";
import { PaintBreakdownSection } from "./PaintBreakdownSection";
import { TotalEstimateCard } from "./TotalEstimateCard";
import DiscountSection from "./DiscountSectiont";
import { DiscountConfig } from "@/interfaces/laborTypes";
import { calculateCosts } from "@/tools/costTools";

const DEFAULT_DISCOUNT: DiscountConfig = {
  type: "percentage",
  value: 0,
  isEditing: false,
};

const EstimateSummary = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [discount, setDiscount] = useState<DiscountConfig>(DEFAULT_DISCOUNT);
  const { totalProjectLaborCost, totalProjectMaterialCost } = useProjectCost();
  const {
    totalGallonsBySection,
    totalGallons,
    mappingNames,
    totalHours,
    totalDays,
  } = useGallons();
  const { propertyData } = useBuilding();

  const totalRooms = propertyData?.rooms.length || 0;

  const estimateWorkItems = useMemo(
    () => [
      {
        label: "Paint Cost",
        cost: totalGallons * PRICING_CONFIG.costGallons,
        icon: <FormatPaint />,
      },
      {
        label: "Labor Cost",
        cost: totalHours * PRICING_CONFIG.hoursRate + totalProjectLaborCost,
        icon: <Work />,
      },
      {
        label: "Materials",
        cost: totalProjectMaterialCost,
        icon: <AddBox />,
      },
    ],
    [totalGallons, totalHours, totalProjectLaborCost, totalProjectMaterialCost]
  );

  const totalGallonsBySectionEntries = Object.entries(
    totalGallonsBySection
  ).filter(([, value]) => value > 0);

  const costs = calculateCosts(estimateWorkItems, discount);

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
        <DiscountSection />

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
