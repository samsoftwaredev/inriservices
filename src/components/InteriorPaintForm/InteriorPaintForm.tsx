"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Typography,
  MenuItem,
} from "@mui/material";
import PackageSelector from "./steps/PackageSelector";

const steps = [
  "Contact Info",
  "Project Areas",
  "Size & Ceilings",
  "Paint Details",
  "Prep Work",
  "Timing & Budget",
  "Extras",
  "Choose a Package",
];

const roomOptions = [
  "Bedrooms",
  "Living Room",
  "Kitchen",
  "Bathroom(s)",
  "Hallways",
  "Ceilings",
  "Trim/Baseboards",
  "Doors & Frames",
  "Cabinets",
  "Accent Walls",
  "Garage",
];

const finishOptions = ["Matte", "Eggshell", "Satin", "Semi-gloss", "Gloss"];

const InteriorPaintForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    selectedRooms: [] as string[],
    numRooms: 1,
    squareFootage: 300,
    ceilingHeight: "Standard",
    paintFinish: "",
    paintBrand: "",
    ecoFriendly: false,
    wallsPainted: false,
    repairsNeeded: [] as string[],
    furnitureHelp: "",
    date: "",
    budget: "",
    isRemodel: "",
    notes: "",
    emailEstimate: false,
    package: "",
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (field: string) => (e: any) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      // @ts-expect-error: TypeScript doesn't know formData[field] is an array
      [field]: formData[field].includes(value)
        ? // @ts-expect-error: TypeScript doesn't know formData[field] is an array
          formData[field].filter((item) => item !== value)
        : // @ts-expect-error: TypeScript doesn't know formData[field] is an array
          [...formData[field], value],
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={formData.name}
              onChange={handleChange("name")}
            />
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              value={formData.phone}
              onChange={handleChange("phone")}
            />
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              value={formData.email}
              onChange={handleChange("email")}
            />
            <TextField
              fullWidth
              label="Service Address"
              margin="normal"
              value={formData.address}
              onChange={handleChange("address")}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <FormGroup>
              {roomOptions.map((room) => (
                <FormControlLabel
                  key={room}
                  control={
                    <Checkbox
                      checked={formData.selectedRooms.includes(room)}
                      onChange={() => handleMultiChange("selectedRooms", room)}
                    />
                  }
                  label={room}
                />
              ))}
            </FormGroup>
            <TextField
              fullWidth
              label="Number of Rooms"
              type="number"
              margin="normal"
              value={formData.numRooms}
              onChange={handleChange("numRooms")}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography gutterBottom>
              Square Footage: {formData.squareFootage} sq ft
            </Typography>
            <Slider
              value={formData.squareFootage}
              min={100}
              max={5000}
              step={50}
              onChange={(e, val) =>
                setFormData({ ...formData, squareFootage: val })
              }
            />
            <FormLabel>Ceiling Height</FormLabel>
            <RadioGroup
              row
              value={formData.ceilingHeight}
              onChange={handleChange("ceilingHeight")}
            >
              <FormControlLabel
                value="Standard"
                control={<Radio />}
                label="8 ft"
              />
              <FormControlLabel
                value="Tall"
                control={<Radio />}
                label="9–10 ft"
              />
              <FormControlLabel
                value="Vaulted"
                control={<Radio />}
                label=">10 ft"
              />
            </RadioGroup>
          </Box>
        );
      case 3:
        return (
          <Box>
            <TextField
              select
              fullWidth
              label="Paint Finish"
              value={formData.paintFinish}
              onChange={handleChange("paintFinish")}
              margin="normal"
            >
              {finishOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Preferred Brand or Color (optional)"
              margin="normal"
              value={formData.paintBrand}
              onChange={handleChange("paintBrand")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.ecoFriendly}
                  onChange={handleChange("ecoFriendly")}
                />
              }
              label="Use Eco-Friendly or Low-VOC Paint"
            />
          </Box>
        );
      case 4:
        return (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.wallsPainted}
                  onChange={handleChange("wallsPainted")}
                />
              }
              label="Walls are currently painted"
            />
            <FormLabel>Repairs Needed</FormLabel>
            <FormGroup>
              {[
                "Small holes",
                "Cracks",
                "Drywall repair",
                "Nail pops",
                "Water stains",
              ].map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={formData.repairsNeeded.includes(item)}
                      onChange={() => handleMultiChange("repairsNeeded", item)}
                    />
                  }
                  label={item}
                />
              ))}
            </FormGroup>
            <FormLabel>Furniture Help</FormLabel>
            <RadioGroup
              value={formData.furnitureHelp}
              onChange={handleChange("furnitureHelp")}
            >
              <FormControlLabel
                value="handle"
                control={<Radio />}
                label="I’ll handle it"
              />
              <FormControlLabel
                value="need_help"
                control={<Radio />}
                label="I’ll need help"
              />
            </RadioGroup>
          </Box>
        );
      case 5:
        return (
          <Box>
            <TextField
              fullWidth
              label="Preferred Completion Date"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange("date")}
            />
            <TextField
              fullWidth
              label="Budget Range"
              select
              margin="normal"
              value={formData.budget}
              onChange={handleChange("budget")}
            >
              {[
                "Under $1,000",
                "$1,000–$3,000",
                "$3,000–$5,000",
                "$5,000+",
              ].map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </TextField>
            <FormLabel>Project Type</FormLabel>
            <RadioGroup
              row
              value={formData.isRemodel}
              onChange={handleChange("isRemodel")}
            >
              <FormControlLabel
                value="remodel"
                control={<Radio />}
                label="Remodel"
              />
              <FormControlLabel
                value="sale"
                control={<Radio />}
                label="Real Estate Prep"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </Box>
        );
      case 6:
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Notes"
              margin="normal"
              value={formData.notes}
              onChange={handleChange("notes")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.emailEstimate}
                  onChange={handleChange("emailEstimate")}
                />
              }
              label="Email me the estimate"
            />
          </Box>
        );
      case 7:
        return (
          <PackageSelector
            formData={formData}
            handleMultiChange={handleMultiChange}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box my={4}>{renderStepContent(activeStep)}</Box>

      <Box display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => console.log("Submit", formData)}
          >
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InteriorPaintForm;
