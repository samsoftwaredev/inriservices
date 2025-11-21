"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Chip,
  Box,
  Collapse,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material";
import {
  MeasurementUnit,
  PaintBaseType,
  RoomData,
  RoomDimensionsOverview,
} from "@/interfaces/laborTypes";
import { useGallons } from "@/context/useGallons";
import {
  calculatePaintGallons,
  calculatePaintGallonsForArea,
} from "@/tools/estimatePaintingHours";

interface Props {
  roomId: string;
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
  includeCeiling: boolean;
  includeFloor: boolean;
}

interface PaintCalculation {
  name: string;
  perimeter: number;
  gallons: number;
  coats: number;
  hasData: boolean;
}

const GallonsCalc = ({
  roomData,
  editData,
  measurementUnit,
  roomId,
  includeCeiling = false,
  includeFloor = false,
}: Props) => {
  const [showCalculation, setShowCalculation] = useState(false);
  const {
    walls,
    setWalls,
    crownMolding,
    setCrownMolding,
    chairRail,
    setChairRail,
    baseboard,
    setBaseboard,
    wainscoting,
    setWainscoting,
    ceiling,
    setCeiling,
    floor,
    setFloor,
    setMeasurementUnit,
  } = useGallons();

  const paintCalculations: PaintCalculation[] = [
    {
      name: "Walls",
      perimeter: roomData.wallPerimeterCalculated || 0,
      coats: editData.wallPaintCoats || 1,
      gallons: calculatePaintGallons(
        roomData.wallPerimeterCalculated,
        editData.wallPaintCoats,
        measurementUnit
      ),
      hasData: !!(
        roomData.wallPerimeterCalculated && roomData.wallPerimeterCalculated > 0
      ),
    },
    {
      name: "Crown Molding",
      perimeter: roomData.crownMoldingPerimeterCalculated || 0,
      coats: editData.crownMoldingPaintCoats || 1,
      gallons: calculatePaintGallons(
        roomData.crownMoldingPerimeterCalculated,
        editData.crownMoldingPaintCoats,
        measurementUnit
      ),
      hasData: !!(
        roomData.crownMoldingPerimeterCalculated &&
        roomData.crownMoldingPerimeterCalculated > 0
      ),
    },
    {
      name: "Chair Rail",
      perimeter: roomData.chairRailPerimeterCalculated || 0,
      coats: editData.chairRailPaintCoats || 1,
      gallons: calculatePaintGallons(
        roomData.chairRailPerimeterCalculated,
        editData.chairRailPaintCoats,
        measurementUnit
      ),
      hasData: !!(
        roomData.chairRailPerimeterCalculated &&
        roomData.chairRailPerimeterCalculated > 0
      ),
    },
    {
      name: "Baseboard",
      perimeter: roomData.baseboardPerimeterCalculated || 0,
      coats: editData.baseboardPaintCoats || 1,
      gallons: calculatePaintGallons(
        roomData.baseboardPerimeterCalculated,
        editData.baseboardPaintCoats,
        measurementUnit
      ),
      hasData: !!(
        roomData.baseboardPerimeterCalculated &&
        roomData.baseboardPerimeterCalculated > 0
      ),
    },
    {
      name: "Wainscoting",
      perimeter: roomData.wainscotingPerimeterCalculated || 0,
      coats: editData.wainscotingPaintCoats || 1,
      gallons: calculatePaintGallons(
        roomData.wainscotingPerimeterCalculated,
        editData.wainscotingPaintCoats,
        measurementUnit
      ),
      hasData: !!(
        roomData.wainscotingPerimeterCalculated &&
        roomData.wainscotingPerimeterCalculated > 0
      ),
    },
    {
      name: "Ceiling",
      perimeter: roomData.areaCalculated || 0,
      coats: editData.ceilingPaintCoats || 1,
      gallons: calculatePaintGallonsForArea(
        roomData.areaCalculated,
        editData.ceilingPaintCoats,
        measurementUnit
      ),
      hasData: includeCeiling,
    },
    {
      name: "Floor",
      perimeter: roomData.areaCalculated || 0,
      coats: editData.floorPaintCoats || 1,
      gallons: calculatePaintGallonsForArea(
        roomData.areaCalculated,
        editData.floorPaintCoats,
        measurementUnit
      ),
      hasData: includeFloor,
    },
  ].filter((calc) => calc.hasData); // Only show items with data

  const totalPaintGallons = paintCalculations.reduce(
    (acc, calc) => acc + calc.gallons,
    0
  );

  const handleToggleCalculation = () => {
    setShowCalculation(!showCalculation);
  };

  useEffect(() => {
    setWalls({
      ...walls,
      [roomId]: {
        perimeter: roomData.wallPerimeterCalculated || 0,
        coats: editData.wallPaintCoats || 1,
        paintBase: editData.wallPaintBase || PaintBaseType.Latex,
      },
    });
    setCrownMolding({
      ...crownMolding,
      [roomId]: {
        perimeter: roomData.crownMoldingPerimeterCalculated || 0,
        coats: editData.crownMoldingPaintCoats || 1,
        paintBase: editData.crownMoldingPaintBase || PaintBaseType.Latex,
      },
    });
    setChairRail({
      ...chairRail,
      [roomId]: {
        perimeter: roomData.chairRailPerimeterCalculated || 0,
        coats: editData.chairRailPaintCoats || 1,
        paintBase: editData.chairRailPaintBase || PaintBaseType.Latex,
      },
    });
    setBaseboard({
      ...baseboard,
      [roomId]: {
        perimeter: roomData.baseboardPerimeterCalculated || 0,
        coats: editData.baseboardPaintCoats || 1,
        paintBase: editData.baseboardPaintBase || PaintBaseType.Latex,
      },
    });
    setWainscoting({
      ...wainscoting,
      [roomId]: {
        perimeter: roomData.wainscotingPerimeterCalculated || 0,
        coats: editData.wainscotingPaintCoats || 1,
        paintBase: editData.wainscotingPaintBase || PaintBaseType.Latex,
      },
    });
    if (includeCeiling) {
      setCeiling({
        ...ceiling,
        [roomId]: {
          perimeter: roomData.areaCalculated || 0,
          coats: editData.ceilingPaintCoats || 1,
          paintBase: editData.ceilingPaintBase || PaintBaseType.Latex,
        },
      });
    }
    if (includeFloor) {
      setFloor({
        ...floor,
        [roomId]: {
          perimeter: roomData.areaCalculated || 0,
          coats: editData.floorPaintCoats || 1,
          paintBase: editData.floorPaintBase || PaintBaseType.Latex,
        },
      });
    }
    setMeasurementUnit(measurementUnit);
  }, [roomData, editData, includeCeiling, includeFloor, measurementUnit]);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: totalPaintGallons > 0 ? "success.50" : "grey.50",
            border: "1px solid",
            borderColor: totalPaintGallons > 0 ? "success.200" : "grey.200",
          }}
        >
          {/* Main Paint Result */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalculateIcon
                sx={{
                  color:
                    totalPaintGallons > 0 ? "success.main" : "text.disabled",
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                Paint Needed:
              </Typography>
              <Chip
                label={`${totalPaintGallons.toFixed(1)} gallons`}
                color={totalPaintGallons > 0 ? "success" : "default"}
                variant="filled"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            {/* Expand/Collapse Button */}
            {totalPaintGallons > 0 && paintCalculations.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {showCalculation ? "Hide" : "Show"} calculation
                </Typography>
                <IconButton
                  onClick={handleToggleCalculation}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {showCalculation ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Collapsible Calculation Details */}
          <Collapse in={showCalculation} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Calculation Breakdown:</strong>
              </Typography>

              {/* Individual Calculations */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {paintCalculations.map((calc, index) => (
                  <Box
                    key={calc.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                      p: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="medium"
                      sx={{ minWidth: 80 }}
                    >
                      {calc.name}:
                    </Typography>

                    <Chip
                      label={`${calc.gallons.toFixed(1)}g`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />

                    <Typography variant="caption" color="text.secondary">
                      =
                    </Typography>

                    <Chip
                      label={`${(calc.gallons / calc.coats).toFixed(1)}g`}
                      size="small"
                      variant="outlined"
                    />

                    <Typography variant="caption" color="text.secondary">
                      ×
                    </Typography>

                    <Chip
                      label={`${calc.coats} coats`}
                      size="small"
                      variant="outlined"
                    />

                    <Typography variant="caption" color="text.secondary">
                      ({calc.perimeter.toFixed(1)} {measurementUnit} perimeter)
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Total Formula */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Total:
                  </Typography>
                  <Chip
                    label={`${totalPaintGallons.toFixed(1)} gallons`}
                    color="success"
                    variant="filled"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    =
                  </Typography>
                  {paintCalculations.map((calc, index) => (
                    <React.Fragment key={calc.name}>
                      <Chip
                        label={`${calc.gallons.toFixed(1)}g`}
                        size="small"
                        variant="outlined"
                      />
                      {index < paintCalculations.length - 1 && (
                        <Typography variant="caption" color="text.secondary">
                          +
                        </Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>

          {/* No Data State */}
          {totalPaintGallons === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              Enter room dimensions to calculate paint requirements
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GallonsCalc;
