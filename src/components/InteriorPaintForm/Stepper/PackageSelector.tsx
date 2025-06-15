"use client";
import {
  Box,
  Checkbox,
  Typography,
  Card,
  Grid,
  CardActionArea,
  Stack,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const packages = [
  {
    id: "basic",
    title: "Basic Refresh Package",
    subtitle: "Essential touch-up and paint",
    details: [
      "Standard paint (Behr or similar)",
      "One main color",
      "Includes light prep (patch & sand)",
      "No ceilings or walls textured included",
      "No movement of furniture included",
      "Best for renters or quick turnarounds",
      "2-months workmanship warranty",
    ],
  },
  {
    id: "recommended",
    title: "Premium Finish Package",
    subtitle: "Popular choice for homeowners",
    details: [
      "Premium paint (Benjamin Moore/Sherwin-Williams)",
      "Up to 3 colors (walls, trim, accent)",
      "Includes trim & door painting",
      "Ceiling and Wall Textured if applicable",
      "Includes wall prep (patch, sand, prime)",
      "Surface prep included",
      "Furniture movement assistance",
      "6-months workmanship warranty",
    ],
  },
  {
    id: "deluxe",
    title: "White Glove Interior Package",
    subtitle: "Luxury look with maximum protection",
    details: [
      "Includes everything in Premium",
      "Detailed masking, caulking, sanding",
      "Up to 50 touch-ups for 1-year",
      "1-year workmanship warranty",
    ],
  },
];

interface Props {
  formData: {
    package: string;
  };
  handleMultiChange: (field: string, value: string) => void;
}

const PackageSelector = ({ formData, handleMultiChange }: Props) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose Your Interior Package(s)
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => {
          const isChecked = formData.package.includes(pkg.id);

          return (
            <Grid size={{ xs: 12 }} key={pkg.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderColor: isChecked
                    ? theme.palette.primary.main
                    : "divider",
                  boxShadow: isChecked ? 6 : 1,
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "0.3s ease",
                }}
              >
                <CardActionArea
                  sx={{ height: "100%", p: 2 }}
                  onClick={() => handleMultiChange("package", pkg.id)}
                >
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()} // Prevent double toggle
                        onChange={() => handleMultiChange("package", pkg.id)}
                        color="primary"
                      />
                      <Box>
                        <Typography fontWeight="bold">{pkg.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pkg.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    <Box component="ul" pl={2} m={0}>
                      {pkg.details.map((detail, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">{detail}</Typography>
                        </li>
                      ))}
                    </Box>
                  </Stack>
                </CardActionArea>

                {isChecked && (
                  <CheckCircleIcon
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: 28,
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PackageSelector;
