"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Divider,
  Card,
  CardContent,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";

interface Worker {
  id: string;
  name: string;
  hours: number;
  hourlyRate: number;
}

interface WorkerErrors {
  [workerId: string]: {
    name?: string;
    hours?: string;
    hourlyRate?: string;
  };
}

interface LaborSummary {
  totalHours: number;
  totalCost: number;
}

interface Props {
  onLaborChange: (summary: LaborSummary) => void;
}

const CalcLaborHours = ({ onLaborChange }: Props) => {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "1",
      name: "Worker 1",
      hours: 0,
      hourlyRate: 25,
    },
  ]);
  const [errors, setErrors] = useState<WorkerErrors>({});

  // Calculate totals directly
  const calculateTotals = (workersList: Worker[]) => {
    const totalHours = workersList.reduce(
      (sum, worker) => sum + worker.hours,
      0,
    );
    const totalCost = workersList.reduce(
      (sum, worker) => sum + worker.hours * worker.hourlyRate,
      0,
    );
    return { totalHours, totalCost };
  };

  // Notify parent immediately
  const notifyParent = (workersList: Worker[]) => {
    const totals = calculateTotals(workersList);
    onLaborChange(totals);
  };

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Worker name is required";
    }
    return undefined;
  };

  const validateHours = (hours: number): string | undefined => {
    if (isNaN(hours)) {
      return "Must be a valid number";
    }
    if (hours < 0) {
      return "Hours must be at least 0";
    }
    return undefined;
  };

  const validateHourlyRate = (rate: number): string | undefined => {
    if (isNaN(rate)) {
      return "Must be a valid number";
    }
    if (rate < 0) {
      return "Hourly rate must be at least 0";
    }
    return undefined;
  };

  const addWorker = () => {
    const newWorker: Worker = {
      id: Date.now().toString(),
      name: `Worker ${workers.length + 1}`,
      hours: 0,
      hourlyRate: 25,
    };
    const updatedWorkers = [...workers, newWorker];
    setWorkers(updatedWorkers);
    notifyParent(updatedWorkers);
  };

  const removeWorker = (workerId: string) => {
    if (workers.length > 1) {
      const updatedWorkers = workers.filter((worker) => worker.id !== workerId);
      setWorkers(updatedWorkers);
      // Remove errors for this worker
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[workerId];
        return newErrors;
      });
      notifyParent(updatedWorkers);
    }
  };

  const handleNameChange = (workerId: string, value: string) => {
    const error = validateName(value);
    setErrors((prev) => ({
      ...prev,
      [workerId]: { ...prev[workerId], name: error },
    }));

    const updatedWorkers = workers.map((worker) =>
      worker.id === workerId ? { ...worker, name: value } : worker,
    );
    setWorkers(updatedWorkers);
    if (!error) {
      notifyParent(updatedWorkers);
    }
  };

  const handleHoursChange = (workerId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateHours(numValue);
    setErrors((prev) => ({
      ...prev,
      [workerId]: { ...prev[workerId], hours: error },
    }));

    const updatedWorkers = workers.map((worker) =>
      worker.id === workerId ? { ...worker, hours: numValue } : worker,
    );
    setWorkers(updatedWorkers);
    if (!error) {
      notifyParent(updatedWorkers);
    }
  };

  const handleHourlyRateChange = (workerId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateHourlyRate(numValue);
    setErrors((prev) => ({
      ...prev,
      [workerId]: { ...prev[workerId], hourlyRate: error },
    }));

    const updatedWorkers = workers.map((worker) =>
      worker.id === workerId ? { ...worker, hourlyRate: numValue } : worker,
    );
    setWorkers(updatedWorkers);
    if (!error) {
      notifyParent(updatedWorkers);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 0 },
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            textAlign: { xs: "center", sm: "left" },
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <PersonIcon sx={{ mr: 1 }} />
          Labor Hours Calculator
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addWorker}
          size="small"
          sx={{
            minWidth: { sm: "auto" },
            maxWidth: { xs: "300px", sm: "none" },
            mx: { xs: "auto", sm: 0 },
          }}
        >
          Add Worker
        </Button>
      </Box>

      <Stack spacing={{ xs: 2, sm: 2, md: 3 }}>
        {workers.map((worker, index) => (
          <Card key={worker.id} variant="outlined">
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid
                container
                spacing={{ xs: 2, sm: 2, md: 3 }}
                alignItems="center"
              >
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Worker Name"
                    value={worker.name}
                    onChange={(e) =>
                      handleNameChange(worker.id, e.target.value)
                    }
                    error={!!errors[worker.id]?.name}
                    helperText={errors[worker.id]?.name}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Hours"
                    type="number"
                    value={worker.hours}
                    onChange={(e) =>
                      handleHoursChange(worker.id, e.target.value)
                    }
                    error={!!errors[worker.id]?.hours}
                    helperText={errors[worker.id]?.hours}
                    size="small"
                    inputProps={{
                      min: 0,
                      step: 0.5,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    value={worker.hourlyRate}
                    onChange={(e) =>
                      handleHourlyRateChange(worker.id, e.target.value)
                    }
                    error={!!errors[worker.id]?.hourlyRate}
                    helperText={errors[worker.id]?.hourlyRate}
                    size="small"
                    inputProps={{
                      min: 0,
                      step: 0.25,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                  <Box
                    sx={{
                      textAlign: { xs: "left", md: "center" },
                      display: "flex",
                      flexDirection: { xs: "row", md: "column" },
                      alignItems: { xs: "center", md: "center" },
                      justifyContent: { xs: "space-between", md: "center" },
                      gap: { xs: 0, md: 1 },
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Box sx={{ flex: { xs: 1, md: "none" } }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: { xs: 0, md: 0.5 } }}
                      >
                        Worker Total
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        {formatCurrency(worker.hours * worker.hourlyRate)}
                      </Typography>
                    </Box>
                    {workers.length > 1 && (
                      <IconButton
                        onClick={() => removeWorker(worker.id)}
                        size="small"
                        color="error"
                        sx={{
                          mt: { xs: 0, md: 1 },
                          ml: { xs: 1, md: 0 },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* Workers Summary */}
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            px: { xs: 1, sm: 0 },
          }}
        >
          {workers.length} worker{workers.length !== 1 ? "s" : ""} • Average
          hourly rate:{" "}
          {formatCurrency(
            workers.reduce((sum, w) => sum + w.hourlyRate, 0) / workers.length,
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default CalcLaborHours;
