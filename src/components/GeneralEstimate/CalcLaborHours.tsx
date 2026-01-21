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
    0,
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
    value: string | number,
  ) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === workerId ? { ...worker, [field]: value } : worker,
      ),
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

                <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Hours"
                    type="number"
                    value={worker.hours}
                    onChange={(e) =>
                      updateWorker(
                        worker.id,
                        "hours",
                        parseFloat(e.target.value) || 0,
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

                <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    value={worker.hourlyRate}
                    onChange={(e) =>
                      updateWorker(
                        worker.id,
                        "hourlyRate",
                        parseFloat(e.target.value) || 0,
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
