"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Slider,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PackageSelector from "./Stepper/PackageSelector";
import ReviewInformation from "./Stepper/ReviewInformation";

const steps = [
  "Customer Info",
  "Property Details",
  "Areas to Paint",
  "Preparation Needs",
  "Paint Preferences",
  "Timeline & Access",
  "Additional Services",
  "Select Package",
  "Review & Submit",
];

export default function ExteriorPaintForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);

  type FormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    squareFootage: number;
    stories: string;
    material: string;
    lastPainted: string;
    areas: string[];
    issues: string[];
    paintType: string;
    colorsSelected: boolean;
    startDate: string;
    accessInfo: string;
    extras: string[];
    package: string;
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    squareFootage: 2000,
    stories: "1",
    material: "wood",
    lastPainted: "",
    areas: [],
    issues: [],
    paintType: "standard",
    colorsSelected: false,
    startDate: "",
    accessInfo: "",
    extras: [],
    package: "basic",
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleMultiChange = (
    field: string,
    value: string | number | boolean
  ) => {
    // @ts-expect-error
    const current = formData[field];
    setFormData({
      ...formData,
      [field]: current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value],
    });
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Project Address"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography gutterBottom fontSize={isMobile ? 16 : 20}>
              Approx. Square Footage
            </Typography>
            <Slider
              min={500}
              max={5000}
              step={100}
              value={formData.squareFootage}
              onChange={(e, val) => handleChange("squareFootage", val)}
              valueLabelDisplay="on"
              sx={{ mx: isMobile ? 1 : 3 }}
            />
            <Typography fontSize={isMobile ? 16 : 20}>Stories</Typography>
            <RadioGroup
              row={!isMobile}
              value={formData.stories}
              onChange={(e) => handleChange("stories", e.target.value)}
            >
              {["1", "2", "3"].map((val) => (
                <FormControlLabel
                  key={val}
                  value={val}
                  control={<Radio size={isMobile ? "small" : "medium"} />}
                  label={val}
                />
              ))}
            </RadioGroup>
            <Typography fontSize={isMobile ? 16 : 20}>
              Exterior Material
            </Typography>
            <RadioGroup
              row={!isMobile}
              value={formData.material}
              onChange={(e) => handleChange("material", e.target.value)}
            >
              {["wood", "stucco", "brick", "vinyl siding"].map((mat) => (
                <FormControlLabel
                  key={mat}
                  value={mat}
                  control={<Radio size={isMobile ? "small" : "medium"} />}
                  label={mat}
                />
              ))}
            </RadioGroup>
            <TextField
              label="When was it last painted? (year)"
              fullWidth
              margin="normal"
              value={formData.lastPainted}
              onChange={(e) => handleChange("lastPainted", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        );
      case 2:
        return (
          <FormGroup sx={{ flexDirection: isMobile ? "column" : "row" }}>
            {["Walls", "Trim", "Fascia", "Soffit", "Doors", "Garage Door"].map(
              (area) => (
                <FormControlLabel
                  key={area}
                  control={
                    <Checkbox
                      checked={formData.areas.includes(area)}
                      onChange={() => handleMultiChange("areas", area)}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label={area}
                  sx={{ minWidth: isMobile ? "unset" : 150 }}
                />
              )
            )}
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup sx={{ flexDirection: isMobile ? "column" : "row" }}>
            {[
              "Peeling Paint",
              "Cracks/Holes",
              "Mold or Mildew",
              "Needs Pressure Washing",
            ].map((issue) => (
              <FormControlLabel
                key={issue}
                control={
                  <Checkbox
                    checked={formData.issues.includes(issue)}
                    onChange={() => handleMultiChange("issues", issue)}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={issue}
                sx={{ minWidth: isMobile ? "unset" : 200 }}
              />
            ))}
          </FormGroup>
        );
      case 4:
        return (
          <Box>
            <Typography fontSize={isMobile ? 16 : 20}>Paint Quality</Typography>
            <RadioGroup
              row={!isMobile}
              value={formData.paintType}
              onChange={(e) => handleChange("paintType", e.target.value)}
            >
              {["standard", "premium", "eco-friendly"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio size={isMobile ? "small" : "medium"} />}
                  label={type}
                />
              ))}
            </RadioGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.colorsSelected}
                  onChange={(e) =>
                    handleChange("colorsSelected", e.target.checked)
                  }
                  size={isMobile ? "small" : "medium"}
                />
              }
              label="I have selected my paint colors."
            />
          </Box>
        );
      case 5:
        return (
          <Box>
            <TextField
              label="Preferred Start Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Access Instructions"
              fullWidth
              margin="normal"
              multiline
              rows={isMobile ? 2 : 3}
              value={formData.accessInfo}
              onChange={(e) => handleChange("accessInfo", e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        );
      case 6:
        return (
          <FormGroup sx={{ flexDirection: isMobile ? "column" : "row" }}>
            {[
              "Caulking",
              "Minor Repairs",
              "Deck Cleaning",
              "Fence Painting",
            ].map((extra) => (
              <FormControlLabel
                key={extra}
                control={
                  <Checkbox
                    checked={formData.extras.includes(extra)}
                    onChange={() => handleMultiChange("extras", extra)}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={extra}
                sx={{ minWidth: isMobile ? "unset" : 180 }}
              />
            ))}
          </FormGroup>
        );
      case 7:
        return (
          <PackageSelector formData={formData} handleChange={handleChange} />
        );
      case 8:
        return <ReviewInformation formData={formData} />;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: isMobile ? "100%" : 1000,
        mx: "auto",
        p: isMobile ? 1 : 2,
        width: "100%",
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          "& .MuiStepLabel-label": {
            fontSize: isMobile ? 12 : 16,
            wordBreak: "break-word",
          },
          "& .MuiStepConnector-root": {
            minHeight: isMobile ? 16 : 24,
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={isMobile ? 2 : 3}>{renderStep()}</Box>

      <Box
        mt={isMobile ? 1 : 2}
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        gap={isMobile ? 1 : 0}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
            sx={isMobile ? { mt: 1 } : {}}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
