"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  Deck as DeckIcon,
  Brush as BrushIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CustomerHeader from "../CustomerHeader";

type EstimationType = "interior" | "exterior" | "general" | null;

const EstimatesPage = () => {
  const router = useRouter();

  const handleContinue = (id: EstimationType) => {
    if (id === "interior") {
      router.push("/interior-estimate");
    } else if (id === "exterior") {
      router.push("/exterior-estimate");
    } else if (id === "general") {
      router.push("/general-estimate");
    }
  };

  const estimationTypes = [
    {
      id: "general" as const,
      title: "General Estimate",
      description:
        "General paint estimation for indoor/outdoor space. Best for smaller projects",
      icon: <BrushIcon sx={{ fontSize: 48, color: "warning.main" }} />,
      features: [
        "Picture-based area selection",
        "Minimal input required",
        "Quick estimates",
        "Basic material breakdown",
        "Minimum labor cost overview",
        "Ideal for small projects",
      ],
      color: "warning.main",
      bgColor: "warning.50",
    },
    {
      id: "interior" as const,
      title: "Interior Estimate",
      description:
        "Paint estimation for indoor spaces including rooms, walls, ceilings, and trim work",
      icon: <HomeIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      features: [
        "Room-by-room calculations",
        "Wall, ceiling, and trim areas",
        "Material cost breakdown",
        "Labor time estimation",
        "Primer and paint coverage",
        "Surface preparation work",
      ],
      color: "primary.main",
      bgColor: "primary.50",
    },
    {
      id: "exterior" as const,
      title: "Exterior Estimate",
      description:
        "Paint estimation for outdoor surfaces including siding, trim, doors, and windows",
      icon: <DeckIcon sx={{ fontSize: 48, color: "success.main" }} />,
      features: [
        "Siding area calculations",
        "Window and door measurements",
        "Weather-resistant materials",
        "Surface preparation needs",
        "Multiple coat requirements",
        "Seasonal considerations",
      ],
      color: "success.main",
      bgColor: "success.50",
    },
  ];

  return (
    <Box>
      <CustomerHeader
        headerName="New Estimate"
        headerDescription="Choose the type of paint estimation you need to create for your
          project."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {estimationTypes.map((type) => (
          <Grid size={{ xs: 12, md: 6 }} key={type.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: type.color,
                  bgcolor: type.bgColor,
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
              onClick={() => handleContinue(type.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {type.icon}
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {type.title}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {type.description}
                </Typography>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                  Features included:
                </Typography>
                <List dense sx={{ pt: 0 }}>
                  {type.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <CheckIcon sx={{ fontSize: 16, color: type.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: "caption",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Help Section */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
        <Typography variant="subtitle2" color="info.dark" gutterBottom>
          Need help choosing?
        </Typography>
        <Typography variant="body2" color="info.dark">
          • Choose <strong>Interior</strong> for painting inside buildings
          (rooms, walls, ceilings)
          <br />• Choose <strong>Exterior</strong> for painting outside surfaces
          (siding, trim, outdoor structures)
        </Typography>
      </Box>
    </Box>
  );
};

export default EstimatesPage;
