import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  useTheme,
  CardActionArea,
} from "@mui/material";

type Package = {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
};

const packages: Package[] = [
  {
    id: "basic",
    title: "🟢 Basic Curb Appeal Package",
    subtitle: "Fast & Affordable Refresh",
    details: [
      "Standard-grade paint",
      "Up to 2 colors (siding, trim)",
      "Light power wash prep",
      "Minor caulking & sealing",
      "2-months workmanship warranty",
    ],
  },
  {
    id: "premium",
    title: "🟡 Premium Protection Package",
    subtitle: "Long-Lasting Quality + Style",
    details: [
      "Premium weather-resistant paint",
      "Up to 4 colors (siding, trim, doors, fascia)",
      "Surface repairs + full prep (sanding, scraping, caulking & sealing)",
      "6-months workmanship warranty",
    ],
  },
  {
    id: "whiteglove",
    title: "🔴 White Glove Restoration Package",
    subtitle: "Luxury-Level Finish & Durability",
    details: [
      "Top-tier paint (Sherwin-Williams, Benjamin Moore)",
      "Up to 6 colors (siding, trim, doors, fascia, shutters, railings)",
      "Carpentry + rot repairs",
      "Shutters, windows, railings, gutters included",
      "Free touch-ups for 1 year",
      "Full surface prep (sanding, scraping, caulking & sealing)",
      "Full power wash prep",
      "1-year workmanship warranty",
    ],
  },
];

type FormData = {
  package: string;
};

type PackageSelectorProps = {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
};

const PackageSelector = ({ formData, handleChange }: PackageSelectorProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose a Package
      </Typography>
      <RadioGroup
        value={formData.package}
        onChange={(e) => handleChange("package", e.target.value)}
      >
        <Grid container spacing={2}>
          {packages.map((pkg) => (
            <Grid size={{ md: 4, xs: 12 }} key={pkg.id}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    formData.package === pkg.id
                      ? theme.palette.primary.main
                      : "divider",
                  boxShadow:
                    formData.package === pkg.id
                      ? "0 0 10px rgba(0,0,0,0.1)"
                      : "none",
                  transition: "0.3s",
                  height: "100%",
                }}
              >
                <CardActionArea onClick={() => handleChange("package", pkg.id)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Radio
                        checked={formData.package === pkg.id}
                        value={pkg.id}
                        size="small"
                      />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {pkg.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, mb: 1 }}
                    >
                      {pkg.subtitle}
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                      {pkg.details.map((line, index) => (
                        <li key={index}>
                          <Typography variant="body2">{line}</Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
};

export default PackageSelector;
