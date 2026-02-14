"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface ProductionRate {
  id: string;
  task: string;
  unit: string;
  ratePerHour: number;
  category: "painting" | "prep" | "finishing";
  editable?: boolean;
}

const defaultRates: ProductionRate[] = [
  // Painting
  {
    id: "1",
    task: "Roll walls (interior)",
    unit: "ft²",
    ratePerHour: 150,
    category: "painting",
  },
  {
    id: "2",
    task: "Roll ceiling",
    unit: "ft²",
    ratePerHour: 120,
    category: "painting",
  },
  {
    id: "3",
    task: "Spray walls",
    unit: "ft²",
    ratePerHour: 300,
    category: "painting",
  },
  {
    id: "4",
    task: "Spray doors (both sides)",
    unit: "doors",
    ratePerHour: 8,
    category: "painting",
  },
  {
    id: "5",
    task: "Brush & roll trim",
    unit: "linear ft",
    ratePerHour: 25,
    category: "painting",
  },
  {
    id: "6",
    task: "Spray cabinets",
    unit: "doors",
    ratePerHour: 12,
    category: "painting",
  },

  // Prep Work
  {
    id: "7",
    task: "Mask & protect (room)",
    unit: "rooms",
    ratePerHour: 3,
    category: "prep",
  },
  {
    id: "8",
    task: "Sand walls (light)",
    unit: "ft²",
    ratePerHour: 200,
    category: "prep",
  },
  {
    id: "9",
    task: "Patch small (nail holes)",
    unit: "patches",
    ratePerHour: 30,
    category: "prep",
  },
  {
    id: "10",
    task: "Patch medium (fist size)",
    unit: "patches",
    ratePerHour: 10,
    category: "prep",
  },
  {
    id: "11",
    task: "Patch large (>6 inches)",
    unit: "patches",
    ratePerHour: 3,
    category: "prep",
  },
  {
    id: "12",
    task: "Prime spot patches",
    unit: "ft²",
    ratePerHour: 180,
    category: "prep",
  },
  {
    id: "13",
    task: "Caulk trim joints",
    unit: "linear ft",
    ratePerHour: 40,
    category: "prep",
  },

  // Finishing
  {
    id: "14",
    task: "Remove masking",
    unit: "rooms",
    ratePerHour: 4,
    category: "finishing",
  },
  {
    id: "15",
    task: "Cleanup & touch-up",
    unit: "rooms",
    ratePerHour: 2,
    category: "finishing",
  },
  {
    id: "16",
    task: "Reinstall hardware",
    unit: "pieces",
    ratePerHour: 20,
    category: "finishing",
  },
];

const BeginnerRates: React.FC = () => {
  const [rates, setRates] = useState<ProductionRate[]>(defaultRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);

  const handleEdit = (id: string, currentRate: number) => {
    setEditingId(id);
    setTempValue(currentRate);
  };

  const handleSave = (id: string) => {
    setRates(
      rates.map((rate) =>
        rate.id === id ? { ...rate, ratePerHour: tempValue } : rate,
      ),
    );
    setEditingId(null);
  };

  const handleReset = () => {
    setRates(defaultRates);
    setEditingId(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "painting":
        return "primary.main";
      case "prep":
        return "warning.main";
      case "finishing":
        return "success.main";
      default:
        return "text.primary";
    }
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          What is a Production Rate?
        </Typography>
        <Typography variant="body2">
          It answers:{" "}
          <strong>
            How much output do we produce in one labor hour under normal
            conditions?
          </strong>
          <br />
          These are beginner rates based on industry averages. Modify them as
          you gather real data from your jobs.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Production Rates Library
                </Typography>
                <Button
                  startIcon={<RestartAltIcon />}
                  onClick={handleReset}
                  variant="outlined"
                  size="small"
                >
                  Reset to Defaults
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Task</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Rate/Hour</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Unit</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rates.map((rate) => (
                      <TableRow key={rate.id} hover>
                        <TableCell>{rate.task}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getCategoryColor(rate.category),
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {rate.category}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {editingId === rate.id ? (
                            <TextField
                              type="number"
                              value={tempValue}
                              onChange={(e) =>
                                setTempValue(Number(e.target.value))
                              }
                              size="small"
                              sx={{ width: 100 }}
                              autoFocus
                            />
                          ) : (
                            <Typography variant="body2" fontWeight={600}>
                              {rate.ratePerHour}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {rate.unit}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {editingId === rate.id ? (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleSave(rate.id)}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEdit(rate.id, rate.ratePerHour)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                💡 Pro Tip
              </Typography>
              <Typography variant="body2">
                Start with these rates, then track 20-40 real jobs. Your actual
                rates will emerge from the data.
                <br />
                <br />
                <strong>
                  If the rate is wrong → every estimate will be wrong.
                </strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                ⚠️ Remember
              </Typography>
              <Typography variant="body2">
                These rates assume:
                <br />• Empty rooms
                <br />• Standard 8-9 ft ceilings
                <br />• Good surface condition
                <br />• Experienced crew
                <br />
                <br />
                Use modifiers for different conditions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                ✅ Next Steps
              </Typography>
              <Typography variant="body2">
                1. Use these rates as your starting point
                <br />
                2. Track real job data (tab 3)
                <br />
                3. Calculate your actual rates (tab 4)
                <br />
                4. Set up difficulty modifiers (tab 5)
                <br />
                5. Start estimating accurately (tab 6)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BeginnerRates;
