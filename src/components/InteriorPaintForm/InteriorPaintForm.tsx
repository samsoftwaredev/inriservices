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
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
} from "@mui/material";
import PackageSelector from "./Stepper/PackageSelector";
import ReviewInformation from "./Stepper/ReviewInformation";

const steps = [
  "Contact Info",
  "Project Areas",
  "Size & Ceilings",
  "Paint Details",
  "Prep Work",
  "Timing & Budget",
  "Extras",
  "Choose a Package",
  "Review & Submit",
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Grid container spacing={2}>
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
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <FormGroup>
              <FormLabel>Project Areas:</FormLabel>
              <Grid container spacing={1}>
                {roomOptions.map((room) => (
                  <Grid size={{ sm: 12, md: 4 }} key={room}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.selectedRooms.includes(room)}
                          onChange={() =>
                            handleMultiChange("selectedRooms", room)
                          }
                        />
                      }
                      label={room}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            <TextField
              fullWidth
              label="Number of Rooms"
              type="number"
              margin="normal"
              value={formData.numRooms}
              onChange={handleChange("numRooms")}
            />
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2} display={"flex"} flexDirection="column">
            <FormLabel>Size & Ceilings:</FormLabel>
            <Typography gutterBottom>
              Total Square Footage of Wall and Ceiling:{" "}
              <b>{formData.squareFootage} sq ft</b>
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
            <FormLabel>Ceiling Height:</FormLabel>
            <RadioGroup
              row={!isMobile}
              value={formData.ceilingHeight}
              onChange={handleChange("ceilingHeight")}
            >
              <FormControlLabel value="8 ft" control={<Radio />} label="8 ft" />
              <FormControlLabel
                value="9–10 ft"
                control={<Radio />}
                label="9–10 ft"
              />
              <FormControlLabel
                value=">10 ft"
                control={<Radio />}
                label="&gt;10 ft"
              />
            </RadioGroup>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
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
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2} display={"flex"} flexDirection="column">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.wallsPainted}
                  onChange={handleChange("wallsPainted")}
                />
              }
              label="Walls are currently painted"
            />
            <FormLabel sx={{ display: "block" }}>Repairs Needed</FormLabel>
            <FormGroup>
              <Grid container spacing={1}>
                {[
                  "Small holes",
                  "Cracks",
                  "Drywall repair",
                  "Nail pops",
                  "Water stains",
                ].map((item) => (
                  <Grid size={{ md: 6, sm: 12 }} key={item}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.repairsNeeded.includes(item)}
                          onChange={() =>
                            handleMultiChange("repairsNeeded", item)
                          }
                        />
                      }
                      label={item}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            <FormLabel>Furniture Help</FormLabel>
            <RadioGroup
              value={formData.furnitureHelp}
              onChange={handleChange("furnitureHelp")}
              row={!isMobile}
            >
              <FormControlLabel
                value="handle"
                control={<Radio />}
                label="The Client can handle it"
              />
              <FormControlLabel
                value="need_help"
                control={<Radio />}
                label="The Client will need need help ($100 - $300 fee)"
              />
            </RadioGroup>
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={2} display={"flex"} flexDirection="column">
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
              row={!isMobile}
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
          </Grid>
        );
      case 6:
        return (
          <Grid container spacing={2} display={"flex"} flexDirection="column">
            <TextField
              fullWidth
              multiline
              rows={5}
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
          </Grid>
        );
      case 7:
        return (
          <PackageSelector
            formData={formData}
            handleMultiChange={handleMultiChange}
          />
        );
      case 8:
        return <ReviewInformation formData={formData} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 2,
        maxWidth: 600,
        mx: "auto",
        width: "100%",
      }}
    >
      <Paper elevation={isMobile ? 0 : 2} sx={{ p: isMobile ? 1 : 3 }}>
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

        <Box my={isMobile ? 2 : 4}>{renderStepContent(activeStep)}</Box>

        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          gap={2}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            fullWidth={isMobile}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              fullWidth={isMobile}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => console.log("Submit", formData)}
              fullWidth={isMobile}
            >
              Submit
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default InteriorPaintForm;
