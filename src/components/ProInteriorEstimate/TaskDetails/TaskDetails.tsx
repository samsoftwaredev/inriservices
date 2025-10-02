"use client";

import React from "react";
import { Box, TextField, Grid, Typography } from "@mui/material";
import { LaborTask } from "../laborTypes";

interface Props {
  task: LaborTask;
  currentHours?: number;
  totalCost?: number;
  onHoursChange: (taskName: string, hours: number) => void;
}

const TaskDetails = ({
  task,
  currentHours = 0,
  totalCost = 0,
  onHoursChange,
}: Props) => {
  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseFloat(event.target.value) || 0;
    onHoursChange(task.name, hours);
  };

  const getMaterialCost = () => {
    return (
      task.laborMaterials?.reduce(
        (total, material) => total + material.quantity * material.price,
        0
      ) || 0
    );
  };

  const materialCost = getMaterialCost();
  const laborCost = currentHours * task.rate;

  return (
    <Box sx={{ mt: 2, pl: 6 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Hours"
            type="number"
            value={currentHours}
            onChange={handleHoursChange}
            inputProps={{
              min: 0,
              step: 0.5,
            }}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Rate: ${task.rate}/hr
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            Labor: ${laborCost.toFixed(2)}
            {materialCost > 0 && (
              <span>
                {" + Materials: $"}
                {materialCost.toFixed(2)}
              </span>
            )}
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight="bold">
            Total: ${totalCost.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDetails;
