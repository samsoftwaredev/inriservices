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
import { numberOfPaintGallons } from "../laborCalc";
import {
  MeasurementUnit,
  RoomData,
  RoomDimensionsOverview,
} from "@/interfaces/laborTypes";
import { convertMeasurement } from "@/tools/convertMeasurement";
import { useGallons } from "@/context/useGallons";

interface Props {
  roomId: string;
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
  includeCeiling?: boolean;
  includeFloor?: boolean;
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
  includeCeiling,
  includeFloor,
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
  } = useGallons();

  const calculatePaintGallons = (
    perimeter: number | string,
    coatsFromRoomData: number | undefined,
    coatsFromEditData: number | undefined,
    defaultCoats: number = 2
  ) => {
    const numPerimeter =
      typeof perimeter === "string" ? parseFloat(perimeter) : perimeter;
    if (!numPerimeter || numPerimeter <= 0) {
      return { gallons: 0, coats: 0 };
    }

    const convertedPerimeter = convertMeasurement(
      numPerimeter,
      measurementUnit,
      "ft"
    );
    const baseGallons = numberOfPaintGallons(convertedPerimeter);
    const coats = coatsFromRoomData || coatsFromEditData || defaultCoats;
    return { gallons: baseGallons * coats, coats };
  };

  const paintCalculations: PaintCalculation[] = [
    {
      name: "Walls",
      perimeter: roomData.wallPerimeterCalculated || 0,
      ...calculatePaintGallons(
        roomData.wallPerimeterCalculated,
        roomData.wallPaintCoats,
        editData.wallPaintCoats
      ),
      hasData: !!(
        roomData.wallPerimeterCalculated && roomData.wallPerimeterCalculated > 0
      ),
    },
    {
      name: "Crown Molding",
      perimeter: roomData.crownMoldingPerimeterCalculated || 0,
      ...calculatePaintGallons(
        roomData.crownMoldingPerimeterCalculated,
        roomData.crownMoldingPaintCoats,
        editData.crownMoldingPaintCoats
      ),
      hasData: !!(
        roomData.crownMoldingPerimeterCalculated &&
        roomData.crownMoldingPerimeterCalculated > 0
      ),
    },
    {
      name: "Chair Rail",
      perimeter: roomData.chairRailPerimeterCalculated || 0,
      ...calculatePaintGallons(
        roomData.chairRailPerimeterCalculated,
        roomData.chairRailPaintCoats,
        editData.chairRailPaintCoats
      ),
      hasData: !!(
        roomData.chairRailPerimeterCalculated &&
        roomData.chairRailPerimeterCalculated > 0
      ),
    },
    {
      name: "Baseboard",
      perimeter: roomData.baseboardPerimeterCalculated || 0,
      ...calculatePaintGallons(
        roomData.baseboardPerimeterCalculated,
        roomData.baseboardPaintCoats,
        editData.baseboardPaintCoats
      ),
      hasData: !!(
        roomData.baseboardPerimeterCalculated &&
        roomData.baseboardPerimeterCalculated > 0
      ),
    },
    {
      name: "Wainscoting",
      perimeter: roomData.wainscotingPerimeterCalculated || 0,
      ...calculatePaintGallons(
        roomData.wainscotingPerimeterCalculated,
        roomData.wainscotingPaintCoats,
        editData.wainscotingPaintCoats
      ),
      hasData: !!(
        roomData.wainscotingPerimeterCalculated &&
        roomData.wainscotingPerimeterCalculated > 0
      ),
    },
    {
      name: "Ceiling",
      perimeter: roomData.areaCalculated || 0,
      ...calculatePaintGallons(
        roomData.areaCalculated,
        roomData.wainscotingPaintCoats,
        editData.wainscotingPaintCoats
      ),
      hasData: !!includeCeiling,
    },
    {
      name: "Floor",
      perimeter: roomData.areaCalculated || 0,
      ...calculatePaintGallons(
        roomData.areaCalculated,
        roomData.wainscotingPaintCoats,
        editData.wainscotingPaintCoats
      ),
      hasData: !!includeFloor,
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
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.wallPerimeterCalculated,
          roomData.wallPaintCoats,
          editData.wallPaintCoats
        ),
      },
    });
    setCrownMolding({
      ...crownMolding,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.crownMoldingPerimeterCalculated,
          roomData.crownMoldingPaintCoats,
          editData.crownMoldingPaintCoats
        ),
      },
    });
    setChairRail({
      ...chairRail,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.chairRailPerimeterCalculated,
          roomData.chairRailPaintCoats,
          editData.chairRailPaintCoats
        ),
      },
    });
    setBaseboard({
      ...baseboard,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.baseboardPerimeterCalculated,
          roomData.baseboardPaintCoats,
          editData.baseboardPaintCoats
        ),
      },
    });
    setWainscoting({
      ...wainscoting,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.wainscotingPerimeterCalculated,
          roomData.wainscotingPaintCoats,
          editData.wainscotingPaintCoats
        ),
      },
    });
    setCeiling({
      ...ceiling,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.areaCalculated,
          roomData.ceilingPaintCoats,
          editData.ceilingPaintCoats
        ),
      },
    });
    setFloor({
      ...floor,
      [roomId]: {
        height: editData.roomHeight || roomData.roomHeight || null,
        ...calculatePaintGallons(
          roomData.areaCalculated,
          roomData.floorPaintCoats,
          editData.floorPaintCoats
        ),
      },
    });
  }, [roomData, editData, includeCeiling, includeFloor]);

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
