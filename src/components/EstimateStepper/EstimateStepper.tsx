"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Slider,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormLabel,
} from "@mui/material";
import Image from "next/image";

const EstimateStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [disabledNextBtn] = useState(false);
  const defaultSquareFootage = 3000;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    copyEstimate: false,
    projectType: "",
    squareFootage: "1500",
    paintType: "",
    extras: [] as string[],
    location: "",
    crewSize: "2", // Default to 2 painters
  });

  const [estimateResult, setEstimateResult] = useState<{
    days: number;
    priceLow: number;
    priceHigh: number;
  } | null>(null);

  // Steps dynamically adjust based on projectType
  const isInterior = formData.projectType === "interior";
  const isExterior = formData.projectType === "exterior";

  const steps = [
    "Basic Information",
    "Type of Project",
    "Square Footage",
    "Material Choices",
    "Project Details",
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
    const { squareFootage, paintType, extras, crewSize } = formData;
    const sqft = parseInt(squareFootage) || defaultSquareFootage;
    const crew = parseInt(crewSize) || 2;

    let baseProductivity = 1500; // default interior rate
    if (isExterior) {
      baseProductivity = 1000; // exterior is slower due to prep and weather
    }

    const estimatedDays = Math.ceil(sqft / (baseProductivity * crew));

    // Base rate per sq ft
    let baseRate = 1.5;
    if (paintType === "eco") baseRate += 0.25;
    if (paintType === "premium") baseRate += 0.5;

    let extrasCost = 0;

    // Extras for INTERIOR
    if (isInterior) {
      if (extras.includes("Ceiling painting")) extrasCost += 300;
      if (extras.includes("Painting trim and baseboards")) extrasCost += 400;
      if (extras.includes("Doors and windows")) extrasCost += 200;
      if (extras.includes("Wallpaper removal")) extrasCost += 500;
    }

    // Extras for EXTERIOR
    if (isExterior) {
      if (extras.includes("Fascia painting")) extrasCost += 250;
      if (extras.includes("Soffit painting")) extrasCost += 250;
      if (extras.includes("Trim painting")) extrasCost += 300;
      if (extras.includes("Doors painting")) extrasCost += 200;
    }

    const estimatedPriceLow = sqft * baseRate + extrasCost;
    const estimatedPriceHigh = estimatedPriceLow * 1.2;

    setEstimateResult({
      days: estimatedDays,
      priceLow: Math.round(estimatedPriceLow),
      priceHigh: Math.round(estimatedPriceHigh),
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormLabel>
              What type of painting project are you interested in?
            </FormLabel>
            <RadioGroup
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              row
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <FormControlLabel
                value="interior"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 100,
                    }}
                  >
                    <Box
                      sx={{
                        width: 200,
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/paintStepper/interiorPainting.jpg"
                        alt="Interior Painting"
                        width={200}
                        height={200}
                        style={{
                          borderRadius: "62px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    Interior Painting
                  </Box>
                }
                sx={{ marginRight: 4 }}
              />
              <FormControlLabel
                value="exterior"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 100,
                    }}
                  >
                    <Box
                      sx={{
                        width: 200,
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/paintStepper/exteriorPainting.jpg"
                        alt="Exterior Painting"
                        width={200}
                        height={200}
                        style={{
                          borderRadius: "62px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    Exterior Painting
                  </Box>
                }
              />
            </RadioGroup>
          </>
        );
      case 1:
        return (
          <>
            <Typography>Approximate square footage</Typography>
            <Image
              src="/paintStepper/houseArea.jpg"
              alt="Exterior Painting"
              width={200}
              height={200}
              style={{
                borderRadius: "62px",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Slider
              value={Number(formData.squareFootage) || defaultSquareFootage}
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  squareFootage: Array.isArray(value)
                    ? String(value[0])
                    : String(value),
                }))
              }
              step={100}
              min={500}
              max={5000}
              valueLabelDisplay="auto"
              disabled={formData.squareFootage === "unknown"}
            />
            <Typography>
              {formData.squareFootage === "unknown"
                ? "Unknown"
                : `${formData.squareFootage} sq ft`}
            </Typography>

            <Button
              variant="text"
              onClick={() => {
                handleNext();
                setFormData((prev) => ({
                  ...prev,
                  squareFootage: "unknown",
                }));
              }}
              sx={{ mb: 2 }}
            >
              I don&apos;t know the square footage
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <FormLabel>What type of paint would you like?</FormLabel>
            <RadioGroup
              name="paintType"
              value={formData.paintType}
              onChange={handleChange}
              row
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 140,
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/paintStepper/standardPaint.avif"
                        alt="Standard Paint"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: "24px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography fontWeight="bold">Standard Paint</Typography>
                    <Typography variant="caption" align="center">
                      Reliable, cost-effective paint for most homes. Good
                      durability and coverage.
                    </Typography>
                  </Box>
                }
                sx={{ marginRight: 4 }}
              />
              <FormControlLabel
                value="eco"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 140,
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/paintStepper/ecoFriendly.webp"
                        alt="Eco-Friendly Paint"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: "24px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography fontWeight="bold">
                      Eco-Friendly Paint
                    </Typography>
                    <Typography variant="caption" align="center">
                      Low-VOC, environmentally friendly paint. Safer for
                      children, pets, and the planet.
                    </Typography>
                  </Box>
                }
                sx={{ marginRight: 4 }}
              />
              <FormControlLabel
                value="premium"
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 140,
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/paintStepper/ultraPremium.jpeg"
                        alt="Premium Paint"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: "24px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Typography fontWeight="bold">Premium Paint</Typography>
                    <Typography variant="caption" align="center">
                      Top-tier paint with superior finish, longevity, and stain
                      resistance.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </>
        );
      case 3:
        return (
          <>
            <FormLabel>Additional Services</FormLabel>
            <FormGroup>
              {isInterior &&
                [
                  "Painting trim and baseboards",
                  "Ceiling painting",
                  "Doors and windows",
                  "Wallpaper removal",
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
              {isExterior &&
                [
                  "Fascia painting",
                  "Soffit painting",
                  "Trim painting",
                  "Doors painting",
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
      case 4:
        return (
          <>
            <TextField
              label="Name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              required
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
      case 5:
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
            <Typography>Paint Type: {formData.paintType}</Typography>
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
                  📅 Estimated Time to Complete:
                </Typography>
                <Typography>{estimateResult.days} day(s)</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  💵 Estimated Price Range:
                </Typography>
                <Typography>
                  ${estimateResult.priceLow.toLocaleString()} – $
                  {estimateResult.priceHigh.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This includes all labor, paint, and the requested extras.
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
      {/* Progress Bar */}
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
          <Button
            disabled={disabledNextBtn}
            variant="contained"
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EstimateStepper;
