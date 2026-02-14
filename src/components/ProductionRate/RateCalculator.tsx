"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface RateCalculation {
  id: string;
  task: string;
  totalHours: number;
  totalOutput: number;
  unit: string;
  ratePerHour: number;
  sampleSize: number;
}

const RateCalculator: React.FC = () => {
  const [calculations, setCalculations] = useState<RateCalculation[]>([]);

  // Form state
  const [task, setTask] = useState("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalOutput, setTotalOutput] = useState<number>(0);
  const [unit, setUnit] = useState("ft²");
  const [sampleSize, setSampleSize] = useState<number>(1);

  const calculatedRate = totalHours > 0 ? totalOutput / totalHours : 0;

  const handleCalculate = () => {
    if (task && totalHours > 0 && totalOutput > 0) {
      const newCalculation: RateCalculation = {
        id: Date.now().toString(),
        task,
        totalHours,
        totalOutput,
        unit,
        ratePerHour: calculatedRate,
        sampleSize,
      };

      setCalculations([newCalculation, ...calculations]);

      // Reset form
      setTask("");
      setTotalHours(0);
      setTotalOutput(0);
      setSampleSize(1);
    }
  };

  const handleDeleteCalculation = (id: string) => {
    setCalculations(calculations.filter((calc) => calc.id !== id));
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Step 3 & 4: Isolate Time Per Task & Convert Into Rates
        </Typography>
        <Typography variant="body2">
          Take your job data and calculate:{" "}
          <strong>output ÷ hours = production rate</strong>
          <br />
          Example: 1,200 ft² painted in 8 hours = 150 ft²/hour
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Calculator */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Calculate Production Rate
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 2,
                }}
              >
                <TextField
                  label="Task Name"
                  placeholder="e.g., Roll interior walls"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  size="small"
                  fullWidth
                />

                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    INPUT DATA
                  </Typography>
                </Paper>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Total Hours"
                      type="number"
                      value={totalHours || ""}
                      onChange={(e) => setTotalHours(Number(e.target.value))}
                      size="small"
                      fullWidth
                      helperText="Combined crew time"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Sample Size"
                      type="number"
                      value={sampleSize || ""}
                      onChange={(e) => setSampleSize(Number(e.target.value))}
                      size="small"
                      fullWidth
                      helperText="# of jobs tracked"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 7 }}>
                    <TextField
                      label="Total Output"
                      type="number"
                      value={totalOutput || ""}
                      onChange={(e) => setTotalOutput(Number(e.target.value))}
                      size="small"
                      fullWidth
                      helperText="Amount completed"
                    />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <TextField
                      label="Unit"
                      select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      size="small"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="ft²">ft²</option>
                      <option value="doors">doors</option>
                      <option value="rooms">rooms</option>
                      <option value="linear ft">linear ft</option>
                      <option value="patches">patches</option>
                      <option value="gallons">gallons</option>
                    </TextField>
                  </Grid>
                </Grid>

                <Divider />

                <Paper sx={{ p: 2, bgcolor: "success.light" }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="success.dark"
                  >
                    CALCULATED RATE
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color="success.dark"
                    >
                      {calculatedRate.toFixed(1)}
                    </Typography>
                    <Typography variant="h6" color="success.dark">
                      {unit}/hour
                    </Typography>
                  </Box>
                  {totalHours > 0 && totalOutput > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {totalOutput} {unit} ÷ {totalHours} hours ={" "}
                      {calculatedRate.toFixed(1)} {unit}/hr
                    </Typography>
                  )}
                </Paper>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CalculateIcon />}
                  onClick={handleCalculate}
                  disabled={!task || totalHours === 0 || totalOutput === 0}
                  size="large"
                >
                  Save This Rate
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Example */}
          <Card sx={{ mt: 2, bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                💡 Example Calculation
              </Typography>
              <Typography variant="body2">
                Job: 1,200 ft² walls painted
                <br />
                Time: 8 hours
                <br />
                Calculation: 1,200 ÷ 8 = <strong>150 ft²/hour</strong>
                <br />
                <br />
                That&apos;s your production rate! Track multiple jobs to get a
                reliable average.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Rates */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justify: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Your Calculated Rates ({calculations.length})
                </Typography>
                <TrendingUpIcon color="primary" />
              </Box>

              {calculations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No rates calculated yet. Use the calculator on the left to
                    convert your job data into production rates.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Task</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Output</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Hours</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Rate/Hour</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Sample</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Delete</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculations.map((calc) => (
                        <TableRow key={calc.id} hover>
                          <TableCell>{calc.task}</TableCell>
                          <TableCell align="right">
                            {calc.totalOutput} {calc.unit}
                          </TableCell>
                          <TableCell align="right">
                            {calc.totalHours}h
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${calc.ratePerHour.toFixed(1)} ${calc.unit}/hr`}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${calc.sampleSize} job${calc.sampleSize > 1 ? "s" : ""}`}
                              size="small"
                              variant="outlined"
                              color={
                                calc.sampleSize >= 5 ? "success" : "warning"
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCalculation(calc.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {calculations.length > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>
                      Track multiple jobs for the same task to get more accurate
                      rates!
                    </strong>
                    <br />
                    Sample size of 5+ jobs = reliable data
                    <br />
                    Sample size of 10+ jobs = very reliable data
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                📊 Where Time Really Goes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Most people are shocked when they break down the numbers:
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: "warning.light" }}>
                    <Typography variant="caption" fontWeight={600}>
                      TYPICAL BREAKDOWN
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      • Prep: 25-35%
                      <br />• Painting: 40-50%
                      <br />• Cleanup: 15-20%
                      <br />• Travel/Breaks: 10-15%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: "error.light" }}>
                    <Typography variant="caption" fontWeight={600}>
                      COMMON MISTAKES
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      • Underestimating prep
                      <br />• Ignoring cleanup time
                      <br />• Forgetting setup/breakdown
                      <br />• Not tracking breaks
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RateCalculator;
