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

const steps = [
  "Customer Info",
  "Property Details",
  "Areas to Paint",
  "Preparation Needs",
  "Paint Preferences",
  "Timeline & Access",
  "Additional Services",
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
    // @ts-expect-error: TypeScript doesn't know formData[field] is an array
    const current = formData[field];
    setFormData({
      ...formData,
      [field]: current.includes(value)
        ? // @ts-expect-error: TypeScript doesn't know formData[field] is an array
          current.filter((v) => v !== value)
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
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              label="Project Address"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography gutterBottom>Approx. Square Footage</Typography>
            <Slider
              min={500}
              max={5000}
              step={100}
              value={formData.squareFootage}
              onChange={(e, val) => handleChange("squareFootage", val)}
              valueLabelDisplay="on"
            />
            <Typography>Stories</Typography>
            <RadioGroup
              row
              value={formData.stories}
              onChange={(e) => handleChange("stories", e.target.value)}
            >
              {["1", "2", "3"].map((val) => (
                <FormControlLabel
                  key={val}
                  value={val}
                  control={<Radio />}
                  label={val}
                />
              ))}
            </RadioGroup>
            <Typography>Exterior Material</Typography>
            <RadioGroup
              value={formData.material}
              onChange={(e) => handleChange("material", e.target.value)}
            >
              {["wood", "stucco", "brick", "vinyl siding"].map((mat) => (
                <FormControlLabel
                  key={mat}
                  value={mat}
                  control={<Radio />}
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
            />
          </Box>
        );
      case 2:
        return (
          <FormGroup>
            {["Walls", "Trim", "Fascia", "Soffit", "Doors", "Garage Door"].map(
              (area) => (
                <FormControlLabel
                  key={area}
                  control={
                    <Checkbox
                      checked={formData.areas.includes(area)}
                      onChange={() => handleMultiChange("areas", area)}
                    />
                  }
                  label={area}
                />
              )
            )}
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup>
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
                  />
                }
                label={issue}
              />
            ))}
          </FormGroup>
        );
      case 4:
        return (
          <Box>
            <Typography>Paint Quality</Typography>
            <RadioGroup
              value={formData.paintType}
              onChange={(e) => handleChange("paintType", e.target.value)}
            >
              {["standard", "premium", "eco-friendly"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
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
            />
            <TextField
              label="Access Instructions"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={formData.accessInfo}
              onChange={(e) => handleChange("accessInfo", e.target.value)}
            />
          </Box>
        );
      case 6:
        return (
          <FormGroup>
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
                  />
                }
                label={extra}
              />
            ))}
          </FormGroup>
        );
      case 7:
        return (
          <Box>
            <Typography variant="h6">Review Your Info</Typography>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
            <Button
              variant="contained"
              color="success"
              onClick={() => alert("Submitted! (Connect to DB here)")}
            >
              Submit
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={3}>{renderStep()}</Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
