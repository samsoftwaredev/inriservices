"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormLabel,
} from "@mui/material";

const CleaningEstimateStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    copyEstimate: false,
    projectType: "residential",
    squareFootage: "",
    cleaningType: "",
    extras: [] as string[],
    location: "",
    crewSize: "2", // Default to 2 cleaners
  });

  const [estimateResult, setEstimateResult] = useState<{
    hours: number;
    priceLow: number;
    priceHigh: number;
  } | null>(null);

  const steps = [
    "Basic Information",
    "Type of Cleaning",
    "Square Footage",
    "Cleaning Package",
    "Extras",
    "Review & Estimate",
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name!]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name!]: value,
      });
    }
  };

  const handleExtrasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newExtras = checked
        ? [...prev.extras, value]
        : prev.extras.filter((item) => item !== value);
      return { ...prev, extras: newExtras };
    });
  };

  const calculateEstimate = () => {
    const { squareFootage, cleaningType, extras, crewSize } = formData;
    const sqft = parseInt(squareFootage) || 0;
    const crew = parseInt(crewSize) || 1;

    const productivityRate = 1000; // sqft per hour per cleaner
    // if (isCommercial) {
    //   productivityRate = 1500; // usually faster in commercial settings
    // }

    const estimatedHours = Math.ceil(sqft / (productivityRate * crew));

    // Base rate per square foot
    let baseRate = 0.2;
    if (cleaningType === "deep") baseRate += 0.1;
    if (cleaningType === "green") baseRate += 0.15;

    let extrasCost = 0;

    // Extras for both types
    if (extras.includes("Window Cleaning")) extrasCost += 100;
    if (extras.includes("Carpet Shampoo")) extrasCost += 150;
    if (extras.includes("Appliance Cleaning")) extrasCost += 75;
    if (extras.includes("Deep Sanitization")) extrasCost += 200;
    if (extras.includes("Garage Cleaning")) extrasCost += 120;

    const estimatedPriceLow = sqft * baseRate + extrasCost;
    const estimatedPriceHigh = estimatedPriceLow * 1.2;

    setEstimateResult({
      hours: estimatedHours,
      priceLow: Math.round(estimatedPriceLow),
      priceHigh: Math.round(estimatedPriceHigh),
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Square Footage"
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
              fullWidth
              margin="normal"
              helperText="Please provide an approximate size for accurate estimate."
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Crew Size"
              name="crewSize"
              value={formData.crewSize}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </>
        );
      case 1:
        return (
          <>
            <FormLabel>Cleaning Package</FormLabel>
            <RadioGroup
              name="cleaningType"
              value={formData.cleaningType}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label="Standard Cleaning"
              />
              <FormControlLabel
                value="deep"
                control={<Radio />}
                label="Deep Cleaning"
              />
              <FormControlLabel
                value="green"
                control={<Radio />}
                label="Eco-Friendly (Green) Cleaning"
              />
            </RadioGroup>
          </>
        );
      case 2:
        return (
          <>
            <FormLabel>Additional Services</FormLabel>
            <FormGroup>
              {[
                "Window Cleaning",
                "Carpet Shampoo",
                "Appliance Cleaning",
                "Deep Sanitization",
                "Garage Cleaning",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={formData.extras.includes(option)}
                      onChange={handleExtrasChange}
                      value={option}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </>
        );
      case 3:
        return (
          <>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.copyEstimate}
                  onChange={handleChange}
                  name="copyEstimate"
                />
              }
              label="Send me a copy of my estimate"
            />
          </>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6">Review Summary</Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Phone: {formData.phone}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Project Type: {formData.projectType}</Typography>
            <Typography>Square Footage: {formData.squareFootage}</Typography>
            <Typography>Location: {formData.location}</Typography>
            <Typography>Crew Size: {formData.crewSize}</Typography>
            <Typography>Cleaning Package: {formData.cleaningType}</Typography>
            <Typography>Extras: {formData.extras.join(", ")}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={calculateEstimate}
            >
              Get Your Final Estimate
            </Button>
            {estimateResult && (
              <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <Typography variant="h6">
                  ⏱️ Estimated Time to Complete:
                </Typography>
                <Typography>{estimateResult.hours} hour(s)</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  💵 Estimated Price Range:
                </Typography>
                <Typography>
                  ${estimateResult.priceLow.toLocaleString()} – $
                  {estimateResult.priceHigh.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This includes all labor, cleaning supplies, and the requested
                  extras.
                </Typography>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Box
        sx={{
          height: 8,
          backgroundColor: "#eee",
          borderRadius: 4,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${((activeStep + 1) / steps.length) * 100}%`,
            backgroundColor: "#1976d2",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
      </Typography>

      <Box sx={{ mb: 2 }}>{renderStepContent(activeStep)}</Box>

      {activeStep < steps.length - 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CleaningEstimateStepper;
