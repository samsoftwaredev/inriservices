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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalculateIcon from "@mui/icons-material/Calculate";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Task {
  id: string;
  name: string;
  measurement: number;
  unit: string;
  productionRate: number; // e.g., 150 ft²/hour
  appliedModifiers: string[];
  modifierPercent: number;
  calculatedHours: number;
}

interface Estimate {
  tasks: Task[];
  laborRate: number; // $/hour
  totalLaborHours: number;
  laborCost: number;
  materialsEstimate: number;
  overhead: number; // percentage
  profit: number; // percentage
  subtotal: number;
  total: number;
}

const ProductionEstimator: React.FC = () => {
  // Task Builder
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [unit, setUnit] = useState("ft²");
  const [productionRate, setProductionRate] = useState("");
  const [modifierPercent, setModifierPercent] = useState(0);

  // Pricing
  const [laborRate, setLaborRate] = useState(45); // $/hour
  const [materialsEstimate, setMaterialsEstimate] = useState(0);
  const [overhead, setOverhead] = useState(15); // %
  const [profit, setProfit] = useState(50); // %

  const handleAddTask = () => {
    if (taskName && measurement && productionRate) {
      const measurementNum = parseFloat(measurement);
      const rateNum = parseFloat(productionRate);

      // Calculate base hours
      const baseHours = measurementNum / rateNum;

      // Apply modifiers
      const modifiedHours = baseHours * (1 + modifierPercent / 100);

      const newTask: Task = {
        id: Date.now().toString(),
        name: taskName,
        measurement: measurementNum,
        unit: unit,
        productionRate: rateNum,
        appliedModifiers: [],
        modifierPercent: modifierPercent,
        calculatedHours: modifiedHours,
      };

      setTasks([...tasks, newTask]);

      // Reset form
      setTaskName("");
      setMeasurement("");
      setProductionRate("");
      setModifierPercent(0);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Calculate Estimate
  const totalLaborHours = tasks.reduce(
    (sum, task) => sum + task.calculatedHours,
    0,
  );
  const laborCost = totalLaborHours * laborRate;
  const subtotal = laborCost + materialsEstimate;
  const overheadAmount = subtotal * (overhead / 100);
  const profitAmount = (subtotal + overheadAmount) * (profit / 100);
  const total = subtotal + overheadAmount + profitAmount;

  const handleCopyEstimate = () => {
    const estimateText = `
PRODUCTION RATE ESTIMATE
========================

TASKS:
${tasks
  .map(
    (t) => `
  ${t.name}
  - Measurement: ${t.measurement} ${t.unit}
  - Rate: ${t.productionRate} ${t.unit}/hr
  - Modifiers: +${t.modifierPercent}%
  - Hours: ${t.calculatedHours.toFixed(2)}h
`,
  )
  .join("\n")}

PRICING:
--------
Total Labor Hours: ${totalLaborHours.toFixed(2)}h
Labor Rate: $${laborRate}/hr
Labor Cost: $${laborCost.toFixed(2)}

Materials: $${materialsEstimate.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}

Overhead (${overhead}%): $${overheadAmount.toFixed(2)}
Profit (${profit}%): $${profitAmount.toFixed(2)}

TOTAL: $${total.toFixed(2)}
========================
    `;

    navigator.clipboard.writeText(estimateText);
  };

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Step 6: Build Real Estimates — No Magic, Just Multiplication
        </Typography>
        <Typography variant="body2">
          You have rates. You have modifiers. Now multiply by measurements.
          <br />
          <strong>
            Labor separated from materials. Transparent. Defensible.
          </strong>
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Task Builder */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Add Task to Estimate
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Task Name"
                  placeholder="e.g., Paint walls - living room"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  size="small"
                  fullWidth
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 7 }}>
                    <TextField
                      label="Measurement"
                      type="number"
                      placeholder="800"
                      value={measurement}
                      onChange={(e) => setMeasurement(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        label="Unit"
                      >
                        <MenuItem value="ft²">ft²</MenuItem>
                        <MenuItem value="lin ft">lin ft</MenuItem>
                        <MenuItem value="doors">doors</MenuItem>
                        <MenuItem value="rooms">rooms</MenuItem>
                        <MenuItem value="walls">walls</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  label="Production Rate"
                  type="number"
                  placeholder="150"
                  value={productionRate}
                  onChange={(e) => setProductionRate(e.target.value)}
                  size="small"
                  fullWidth
                  helperText={`${unit}/hour (from your rate library)`}
                />

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Difficulty Modifiers: +{modifierPercent}%
                  </Typography>
                  <Grid container spacing={1}>
                    {[0, 10, 15, 25, 35, 50].map((percent) => (
                      <Grid size={{ xs: 4 }} key={percent}>
                        <Button
                          variant={
                            modifierPercent === percent
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          onClick={() => setModifierPercent(percent)}
                          fullWidth
                        >
                          +{percent}%
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {measurement && productionRate && (
                  <Paper sx={{ p: 2, bgcolor: "primary.light" }}>
                    <Typography variant="body2" color="primary.dark">
                      📊 Calculated:{" "}
                      <strong>
                        {(
                          (parseFloat(measurement) /
                            parseFloat(productionRate)) *
                          (1 + modifierPercent / 100)
                        ).toFixed(2)}
                      </strong>{" "}
                      hours
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {measurement} {unit} ÷ {productionRate} {unit}/hr × (1 +{" "}
                      {modifierPercent}%)
                    </Typography>
                  </Paper>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTask}
                  disabled={!taskName || !measurement || !productionRate}
                  fullWidth
                  size="large"
                >
                  Add Task
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Pricing Controls */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Pricing Settings
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Labor Rate ($/hour)"
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(Number(e.target.value))}
                  size="small"
                  fullWidth
                />

                <TextField
                  label="Materials Estimate ($)"
                  type="number"
                  value={materialsEstimate}
                  onChange={(e) => setMaterialsEstimate(Number(e.target.value))}
                  size="small"
                  fullWidth
                  helperText="Paint, primer, tape, drop cloths, etc."
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Overhead (%)"
                      type="number"
                      value={overhead}
                      onChange={(e) => setOverhead(Number(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Profit (%)"
                      type="number"
                      value={profit}
                      onChange={(e) => setProfit(Number(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Estimate Result */}
        <Grid size={{ xs: 12, lg: 7 }}>
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
                  Estimate Breakdown
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyEstimate}
                  disabled={tasks.length === 0}
                  variant="outlined"
                  size="small"
                >
                  Copy
                </Button>
              </Box>

              {tasks.length === 0 ? (
                <Alert severity="info">Add tasks to generate an estimate</Alert>
              ) : (
                <>
                  {/* Tasks Table */}
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                          <TableCell>
                            <strong>Task</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Measurement</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Rate</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Modifier</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Hours</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Action</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell>{task.name}</TableCell>
                            <TableCell align="right">
                              {task.measurement} {task.unit}
                            </TableCell>
                            <TableCell align="right">
                              {task.productionRate} {task.unit}/hr
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={`+${task.modifierPercent}%`}
                                size="small"
                                color="warning"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <strong>
                                {task.calculatedHours.toFixed(2)}h
                              </strong>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTask(task.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: "primary.light" }}>
                          <TableCell colSpan={4} align="right">
                            <strong>Total Labor Hours:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight={700}>
                              {totalLaborHours.toFixed(2)}h
                            </Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pricing Breakdown */}
                  <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          💰 Pricing Breakdown
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="body1">Labor Cost</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {totalLaborHours.toFixed(2)}h × ${laborRate}/hr
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography
                          variant="body1"
                          align="right"
                          fontWeight={600}
                        >
                          ${laborCost.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="body1">Materials</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography
                          variant="body1"
                          align="right"
                          fontWeight={600}
                        >
                          ${materialsEstimate.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Divider />
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body1" align="right">
                          ${subtotal.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          Overhead ({overhead}%)
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body1" align="right">
                          ${overheadAmount.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          Profit Margin ({profit}%)
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body1" align="right">
                          ${profitAmount.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Divider
                          sx={{ borderWidth: 2, borderColor: "primary.main" }}
                        />
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="primary"
                        >
                          Total Price
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          align="right"
                          color="primary"
                        >
                          ${total.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Key Insights */}
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      ✅ Estimate Complete
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Labor:</strong> {totalLaborHours.toFixed(1)}h @
                      ${laborRate}/hr = ${laborCost.toFixed(2)}
                      <br />• <strong>Materials:</strong> $
                      {materialsEstimate.toFixed(2)} (tracked separately)
                      <br />• <strong>Markup:</strong> {overhead + profit}%
                      total ({overhead}% overhead + {profit}% profit)
                      <br />• <strong>Final Price:</strong> ${total.toFixed(2)}{" "}
                      — fully transparent calculation
                    </Typography>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductionEstimator;
