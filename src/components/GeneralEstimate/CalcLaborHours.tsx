"use client";

import React, { useState, useEffect } from "react";
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

  // Calculate totals
  const totalHours = workers.reduce((sum, worker) => sum + worker.hours, 0);
  const totalCost = workers.reduce(
    (sum, worker) => sum + worker.hours * worker.hourlyRate,
    0
  );

  // Notify parent of changes
  useEffect(() => {
    onLaborChange({ totalHours, totalCost });
  }, [totalHours, totalCost, onLaborChange]);

  const addWorker = () => {
    const newWorker: Worker = {
      id: Date.now().toString(),
      name: `Worker ${workers.length + 1}`,
      hours: 0,
      hourlyRate: 25,
    };
    setWorkers([...workers, newWorker]);
  };

  const removeWorker = (workerId: string) => {
    if (workers.length > 1) {
      setWorkers(workers.filter((worker) => worker.id !== workerId));
    }
  };

  const updateWorker = (
    workerId: string,
    field: keyof Worker,
    value: string | number
  ) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === workerId ? { ...worker, [field]: value } : worker
      )
    );
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
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <PersonIcon sx={{ mr: 1 }} />
          Labor Hours Calculator
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addWorker}
          size="small"
        >
          Add Worker
        </Button>
      </Box>

      <Stack spacing={2}>
        {workers.map((worker, index) => (
          <Card key={worker.id} variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Worker Name"
                    value={worker.name}
                    onChange={(e) =>
                      updateWorker(worker.id, "name", e.target.value)
                    }
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

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Hours"
                    type="number"
                    value={worker.hours}
                    onChange={(e) =>
                      updateWorker(
                        worker.id,
                        "hours",
                        parseFloat(e.target.value) || 0
                      )
                    }
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

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    value={worker.hourlyRate}
                    onChange={(e) =>
                      updateWorker(
                        worker.id,
                        "hourlyRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
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

                <Grid size={{ xs: 12, sm: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Worker Total
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(worker.hours * worker.hourlyRate)}
                    </Typography>
                    {workers.length > 1 && (
                      <IconButton
                        onClick={() => removeWorker(worker.id)}
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
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
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {workers.length} worker{workers.length !== 1 ? "s" : ""} • Average
          hourly rate:{" "}
          {formatCurrency(
            workers.reduce((sum, w) => sum + w.hourlyRate, 0) / workers.length
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default CalcLaborHours;
