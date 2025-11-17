"use client";

import React, { useState } from "react";
import {
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Button,
  Box,
  Chip,
  Divider,
  Avatar,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Straighten as StraightenIcon,
  FormatPaint as FormatPaintIcon,
  Architecture as ArchitectureIcon,
  Calculate as CalculateIcon,
  AutoFixHigh as AutoFixHighIcon,
  Height as HeightIcon,
  SquareFoot as SquareFootIcon,
  Brush as BrushIcon,
  ViewInAr as ViewInArIcon,
  Speed as SpeedIcon,
  VerticalAlignTop as CrownMoldingIcon,
  Rectangle as WainscotingIcon,
  Chair as ChairIcon,
} from "@mui/icons-material";
import {
  MeasurementUnit,
  RoomData,
  RoomDimensionsOverview,
} from "@/interfaces/laborTypes";
import { calculateArea, calculatePerimeter } from "../laborCalc";
import GallonsCalc from "./GallonsCalc";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Props {
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
  setEditData: React.Dispatch<React.SetStateAction<RoomDimensionsOverview>>;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  roomId: string;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  fields: string[];
  defaultExpanded?: boolean;
}

interface PresetConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  values: Partial<RoomDimensionsOverview & RoomData>;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const PAINT_COAT_OPTIONS = [
  { value: 1, label: "1 Coat" },
  { value: 2, label: "2 Coats (Standard)" },
  { value: 3, label: "3 Coats (Premium)" },
  { value: 4, label: "4+ Coats (High Coverage)" },
];

const DEFAULT_SECTION_STATE = {
  basics: true,
  trim: false,
  coats: false,
  calculated: false,
  features: false,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createPresets = (measurementUnit: MeasurementUnit): PresetConfig[] => [
  {
    name: "Standard Room",
    icon: <HomeIcon />,
    description: "8ft ceiling, standard trim",
    values: {
      roomHeight: measurementUnit === "ft" ? 8 : 2.44,
      baseboardHeight: measurementUnit === "ft" ? 0.29 : 0.089, // 3.5 inches
      crownMoldingHeight: measurementUnit === "ft" ? 0.29 : 0.089, // 3.5 inches
      chairRailHeight: measurementUnit === "ft" ? 0.25 : 0.076,
      wallPaintCoats: 2,
      baseboardPaintCoats: 2,
      crownMoldingPaintCoats: 2,
      chairRailPaintCoats: 2,
    },
  },
  {
    name: "High Ceiling",
    icon: <ViewInArIcon />,
    description: "10ft ceiling, taller trim",
    values: {
      roomHeight: measurementUnit === "ft" ? 10 : 3.05,
      baseboardHeight: measurementUnit === "ft" ? 0.42 : 0.13, // 5 inches
      crownMoldingHeight: measurementUnit === "ft" ? 0.42 : 0.13, // 5 inches
      chairRailHeight: measurementUnit === "ft" ? 0.29 : 0.089,
      wallPaintCoats: 2,
      baseboardPaintCoats: 2,
      crownMoldingPaintCoats: 2,
      chairRailPaintCoats: 2,
    },
  },
  {
    name: "Luxury Finish",
    icon: <SpeedIcon />,
    description: "Premium trim, 3 coats",
    values: {
      roomHeight: measurementUnit === "ft" ? 9 : 2.74,
      baseboardHeight: measurementUnit === "ft" ? 0.58 : 0.18, // 7 inches
      crownMoldingHeight: measurementUnit === "ft" ? 0.58 : 0.18, // 7 inches
      chairRailHeight: measurementUnit === "ft" ? 0.33 : 0.1,
      wallPaintCoats: 3,
      baseboardPaintCoats: 3,
      crownMoldingPaintCoats: 3,
      chairRailPaintCoats: 3,
    },
  },
];

const createSections = (): SectionConfig[] => [
  {
    id: "basics",
    title: "Room Basics",
    icon: <HomeIcon />,
    description: "Essential room dimensions",
    color: "primary",
    fields: ["wallPerimeter", "roomHeight"],
    defaultExpanded: true,
  },
  {
    id: "baseboard",
    title: "Baseboard",
    icon: <ArchitectureIcon />,
    description:
      "A narrow wooden board running along the base of an interior wall.",
    color: "secondary",
    fields: ["baseboardPerimeter", "baseboardHeight"],
  },
  {
    id: "crownMolding",
    title: "Crown Molding",
    icon: <CrownMoldingIcon />,
    description:
      "A decorative trim installed where an interior wall meets the ceiling",
    color: "secondary",
    fields: ["crownMoldingPerimeter", "crownMoldingHeight"],
  },
  {
    id: "wainscoting",
    title: "Wainscoting",
    icon: <WainscotingIcon />,
    description:
      "Wooden paneling that lines the lower part of the walls of a room.",
    color: "secondary",
    fields: ["wainscotingPerimeter", "wainscotingHeight"],
  },
  {
    id: "chairRail",
    title: "Chair Rail",
    icon: <ChairIcon />,
    description:
      "A horizontal trim installed typically between 32 and 36 inches from the floor",
    color: "secondary",
    fields: ["chairRailPerimeter", "chairRailHeight"],
  },
  {
    id: "coats",
    title: "Paint Coats",
    icon: <FormatPaintIcon />,
    description: "Number of paint coats for each surface",
    color: "info",
    fields: [
      "wallPaintCoats",
      "baseboardPaintCoats",
      "crownMoldingPaintCoats",
      "chairRailPaintCoats",
      "wainscotingPaintCoats",
    ],
  },
  {
    id: "calculated",
    title: "Calculated Areas",
    icon: <CalculateIcon />,
    description: "Auto-calculated measurements",
    color: "success",
    fields: ["ceilingArea", "floorArea"],
  },
];

const getFieldIcon = (field: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    wallPerimeter: <StraightenIcon sx={{ color: "action.active" }} />,
    roomHeight: <HeightIcon sx={{ color: "action.active" }} />,
    baseboardPerimeter: "🏠",
    baseboardHeight: "🏠",
    crownMoldingPerimeter: "👑",
    crownMoldingHeight: "👑",
    chairRailPerimeter: "🪑",
    chairRailHeight: "🪑",
    wainscotingPerimeter: "📏",
    wainscotingHeight: "📏",
  };

  return iconMap[field] || <BrushIcon sx={{ color: "action.active" }} />;
};

const getFieldDisplayName = (fieldKey: string): string => {
  const nameMap: Record<string, string> = {
    baseboardPerimeter: "Baseboard",
    baseboardHeight: "Baseboard",
    crownMoldingPerimeter: "Crown Molding",
    crownMoldingHeight: "Crown Molding",
    chairRailPerimeter: "Chair Rail",
    chairRailHeight: "Chair Rail",
    wainscotingPerimeter: "Wainscoting",
    wainscotingHeight: "Wainscoting",
  };

  return nameMap[fieldKey] || fieldKey;
};

const getStandardHeight = (fieldKey: string): string => {
  if (fieldKey.includes("baseboard") || fieldKey.includes("crown"))
    return '3.5"';
  if (fieldKey.includes("chair")) return '3"';
  return "";
};

// ============================================================================
// FIELD RENDERERS
// ============================================================================

const renderWallPerimeterField = (
  currentValue: any,
  measurementUnit: MeasurementUnit,
  handleInputChange: (fieldKey: string) => any
) => (
  <TextField
    fullWidth
    label={`Wall Perimeter (${measurementUnit})`}
    value={currentValue}
    onChange={handleInputChange("wallPerimeter")}
    placeholder="12x15 or 12 15 12 15"
    helperText="Enter room dimensions (e.g., 12x15)"
    size="small"
    InputProps={{
      startAdornment: getFieldIcon("wallPerimeter"),
    }}
    sx={{ mb: 2 }}
  />
);

const renderRoomHeightField = (
  currentValue: any,
  measurementUnit: MeasurementUnit,
  handleInputChange: (fieldKey: string) => any
) => (
  <TextField
    fullWidth
    label={`Room Height (${measurementUnit})`}
    type="number"
    value={currentValue}
    onChange={handleInputChange("roomHeight")}
    placeholder={measurementUnit === "ft" ? "8" : "2.44"}
    helperText="Standard: 8-10 ft"
    size="small"
    InputProps={{
      startAdornment: getFieldIcon("roomHeight"),
    }}
    sx={{ mb: 2 }}
  />
);

const renderPerimeterField = (
  fieldKey: string,
  currentValue: any,
  measurementUnit: MeasurementUnit,
  handleInputChange: (fieldKey: string) => any
) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" sx={{ fontSize: "1.2rem", mr: 1 }}>
        {getFieldIcon(fieldKey)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {getFieldDisplayName(fieldKey)} Perimeter
      </Typography>
    </Box>
    <TextField
      fullWidth
      label={`${getFieldDisplayName(fieldKey)} Perimeter (${measurementUnit})`}
      value={currentValue}
      onChange={handleInputChange(fieldKey)}
      placeholder="Usually same as wall perimeter"
      helperText="Enter perimeter or use auto-calculate"
      size="small"
    />
  </Box>
);

const renderHeightField = (
  fieldKey: string,
  currentValue: any,
  measurementUnit: MeasurementUnit,
  handleInputChange: (fieldKey: string) => any
) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" sx={{ fontSize: "1.2rem", mr: 1 }}>
        {getFieldIcon(fieldKey)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {getFieldDisplayName(fieldKey)} Height
      </Typography>
    </Box>
    <TextField
      fullWidth
      label={`Height (${measurementUnit})`}
      type="number"
      value={currentValue}
      onChange={handleInputChange(fieldKey)}
      placeholder={measurementUnit === "ft" ? "0.29" : "0.089"}
      helperText={`Standard: ${getStandardHeight(fieldKey)}`}
      size="small"
    />
  </Box>
);

const renderPaintCoatsField = (
  fieldKey: string,
  currentValue: any,
  handleInputChange: (fieldKey: string) => any
) => (
  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
    <InputLabel>
      {fieldKey
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}
    </InputLabel>
    <Select
      value={currentValue || 2}
      label={fieldKey
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}
      onChange={handleInputChange(fieldKey)}
    >
      {PAINT_COAT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const renderAreaField = (
  fieldKey: string,
  roomData: RoomData,
  measurementUnit: MeasurementUnit
) => (
  <Paper
    sx={{
      p: 2,
      bgcolor: "success.50",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "success.200",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <SquareFootIcon sx={{ color: "success.main", mr: 1 }} />
      <Typography variant="subtitle2" color="success.main">
        {fieldKey === "ceilingArea" ? "Ceiling Area" : "Floor Area"}
      </Typography>
    </Box>
    <Typography variant="h5" fontWeight="bold" color="success.main">
      {roomData.areaCalculated?.toFixed(1) || 0} {measurementUnit}²
    </Typography>
  </Paper>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RoomDimensionsEdit = ({
  measurementUnit,
  roomData,
  editData,
  setEditData,
  setRoomData,
  roomId,
}: Props) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(DEFAULT_SECTION_STATE);

  const presets = createPresets(measurementUnit);
  const sections = createSections();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handlePresetApply = (preset: PresetConfig) => {
    setEditData((prev) => ({ ...prev, ...preset.values }));
    setRoomData((prev) => ({ ...prev, ...preset.values }));

    // Auto-expand relevant sections
    setExpandedSections((prev) => ({
      ...prev,
      basics: true,
      trim: true,
      coats: true,
    }));
  };

  const handleAutoCalculate = () => {
    if (!editData.wallPerimeter) return;

    const trimUpdates = {
      baseboardPerimeter: editData.wallPerimeter,
      crownMoldingPerimeter: editData.wallPerimeter,
      chairRailPerimeter: editData.wallPerimeter,
    };

    setEditData((prev) => ({ ...prev, ...trimUpdates }));

    // Calculate all perimeters
    const calculations = {
      area: calculateArea(editData.wallPerimeter),
      wallPerimeter: calculatePerimeter(
        editData.wallPerimeter,
        editData.roomHeight || roomData.roomHeight || 8
      ),
      baseboardPerimeter: calculatePerimeter(
        editData.wallPerimeter,
        editData.baseboardHeight || roomData.baseboardHeight || 0.29
      ),
      crownMoldingPerimeter: calculatePerimeter(
        editData.wallPerimeter,
        editData.crownMoldingHeight || roomData.crownMoldingHeight || 0.29
      ),
      chairRailPerimeter: calculatePerimeter(
        editData.wallPerimeter,
        editData.chairRailHeight || roomData.chairRailHeight || 0.25
      ),
    };

    setRoomData((prev) => ({
      ...prev,
      areaCalculated: calculations.area,
      wallPerimeterCalculated: calculations.wallPerimeter,
      baseboardPerimeterCalculated: calculations.baseboardPerimeter,
      crownMoldingPerimeterCalculated: calculations.crownMoldingPerimeter,
      chairRailPerimeterCalculated: calculations.chairRailPerimeter,
    }));
  };

  const handleInputChange =
    (fieldKey: string) =>
    (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<any>) => {
      const value = event.target.value;
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;

      setEditData((prev) => ({ ...prev, [fieldKey]: value }));

      // Handle auto-calculations
      switch (fieldKey) {
        case "wallPerimeter":
          const area = calculateArea(value);
          const wallPerimeter = calculatePerimeter(
            value,
            editData.roomHeight || roomData.roomHeight || 8
          );
          setRoomData((prev) => ({
            ...prev,
            wallPerimeterCalculated: wallPerimeter,
            areaCalculated: area,
          }));
          break;

        case "roomHeight":
          const wallPerim = calculatePerimeter(
            editData.wallPerimeter,
            numValue
          );
          setRoomData((prev) => ({
            ...prev,
            wallPerimeterCalculated: wallPerim,
            roomHeight: numValue,
          }));
          break;

        case "baseboardHeight":
          const baseboardPerim = calculatePerimeter(
            editData.baseboardPerimeter,
            numValue
          );
          setRoomData((prev) => ({
            ...prev,
            baseboardPerimeterCalculated: baseboardPerim,
          }));
          break;

        case "crownMoldingHeight":
          const crownMoldingPerim = calculatePerimeter(
            editData.crownMoldingPerimeter,
            numValue
          );
          setRoomData((prev) => ({
            ...prev,
            crownMoldingPerimeterCalculated: crownMoldingPerim,
          }));
          break;

        case "chairRailHeight":
          const chairRailPerim = calculatePerimeter(
            editData.chairRailPerimeter,
            numValue
          );
          setRoomData((prev) => ({
            ...prev,
            chairRailPerimeterCalculated: chairRailPerim,
          }));
          break;

        default:
          setRoomData((prev) => ({ ...prev, [fieldKey]: numValue }));
      }
    };

  // ============================================================================
  // FIELD RENDERER
  // ============================================================================

  const renderField = (fieldKey: string) => {
    const currentValue =
      editData[fieldKey as keyof RoomDimensionsOverview] ||
      roomData[fieldKey as keyof RoomData] ||
      "";

    const fieldMap: Record<string, () => React.ReactNode> = {
      wallPerimeter: () =>
        renderWallPerimeterField(
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      roomHeight: () =>
        renderRoomHeightField(currentValue, measurementUnit, handleInputChange),
      baseboardPerimeter: () =>
        renderPerimeterField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      crownMoldingPerimeter: () =>
        renderPerimeterField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      chairRailPerimeter: () =>
        renderPerimeterField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      baseboardHeight: () =>
        renderHeightField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      crownMoldingHeight: () =>
        renderHeightField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      chairRailHeight: () =>
        renderHeightField(
          fieldKey,
          currentValue,
          measurementUnit,
          handleInputChange
        ),
      wallPaintCoats: () =>
        renderPaintCoatsField(fieldKey, currentValue, handleInputChange),
      baseboardPaintCoats: () =>
        renderPaintCoatsField(fieldKey, currentValue, handleInputChange),
      crownMoldingPaintCoats: () =>
        renderPaintCoatsField(fieldKey, currentValue, handleInputChange),
      chairRailPaintCoats: () =>
        renderPaintCoatsField(fieldKey, currentValue, handleInputChange),
      ceilingArea: () => renderAreaField(fieldKey, roomData, measurementUnit),
      floorArea: () => renderAreaField(fieldKey, roomData, measurementUnit),
    };

    return fieldMap[fieldKey]?.() || null;
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getSectionFieldCount = (sectionFields: string[]) => {
    return sectionFields.filter(
      (field) =>
        editData[field as keyof RoomDimensionsOverview] ||
        roomData[field as keyof RoomData]
    ).length;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Room Estimation Calculator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your room dimensions and get instant paint calculations
        </Typography>
      </Box>

      {/* Quick Setup Presets */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
              <AutoFixHighIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6" color="inherit" fontWeight="bold">
              Quick Setup Presets
            </Typography>
          }
          subheader={
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Apply common room configurations in one click
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            {presets.map((preset) => (
              <Grid size={{ xs: 12, md: 4 }} key={preset.name}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handlePresetApply(preset)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    p: 2,
                    textAlign: "left",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                  startIcon={preset.icon}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {preset.name}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {preset.description}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />

          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={handleAutoCalculate}
            disabled={!editData.wallPerimeter}
            sx={{
              borderColor: "rgba(255,255,255,0.5)",
              color: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Auto-Calculate All Trim Perimeters
          </Button>
        </CardContent>
      </Card>

      {/* Collapsible Sections */}
      <Grid container spacing={3}>
        {sections.map((section) => {
          const fieldCount = getSectionFieldCount(section.fields);
          const hasData = fieldCount > 0;

          return (
            <Grid size={{ md: 6, xs: 12, lg: 6 }} key={section.id}>
              <Card
                sx={{
                  height: "fit-content",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: hasData ? `${section.color}.200` : "grey.200",
                  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.12)" },
                  transition: "all 0.3s ease",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: expandedSections[section.id]
                          ? `${section.color}.main`
                          : "grey.400",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {section.icon}
                    </Avatar>
                  }
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {section.title}
                      </Typography>
                      {hasData && (
                        <Chip
                          label={`${fieldCount} filled`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  subheader={section.description}
                  action={
                    <Tooltip
                      title={
                        expandedSections[section.id] ? "Collapse" : "Expand"
                      }
                    >
                      <IconButton
                        onClick={() => handleSectionToggle(section.id)}
                        sx={{
                          transform: expandedSections[section.id]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ pb: 1 }}
                />
                <Collapse in={expandedSections[section.id]} timeout={300}>
                  <CardContent sx={{ pt: 0 }}>
                    {section.fields.map((field) => (
                      <Box key={field}>{renderField(field)}</Box>
                    ))}
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Paint Calculation Results */}
      <Box sx={{ mt: 4 }}>
        <GallonsCalc
          roomId={roomId}
          roomData={roomData}
          editData={editData}
          measurementUnit={measurementUnit}
        />
      </Box>
    </Box>
  );
};

export default RoomDimensionsEdit;
