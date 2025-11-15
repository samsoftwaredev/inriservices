"use client";

import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";

import TaskDetails from "../TaskDetails";
import { LaborMaterial, LaborTask } from "../../../interfaces/laborTypes";

interface Props {
  task: LaborTask;
  currentHours: number;
  isSelected: boolean;
  onToggle: (taskName: string) => void;
  onHoursChange: (taskName: string, hours: number) => void;
  includeMaterialCosts: boolean;
  onMaterialSelectionChange?: (
    taskName: string,
    selectedMaterials: LaborMaterial[]
  ) => void;
}

const TaskItem = ({
  task,
  currentHours,
  isSelected,
  onToggle,
  onHoursChange,
  includeMaterialCosts,
  onMaterialSelectionChange,
}: Props) => {
  const handleToggle = () => {
    onToggle(task.name);
  };

  const calculateTaskCost = () => {
    const laborCost = currentHours * task.rate;
    const materialCost = includeMaterialCosts
      ? task.laborMaterials?.reduce(
          (total, material) => total + material.quantity * material.price,
          0
        ) || 0
      : 0;
    return laborCost + materialCost;
  };

  const totalCost = calculateTaskCost();

  return (
    <ListItem
      dense
      component="div"
      sx={{
        flexDirection: "column",
        alignItems: "stretch",
        border: isSelected ? "1px solid" : "1px solid transparent",
        borderColor: isSelected ? "primary.main" : "transparent",
        borderRadius: 1,
        mb: 1,
        bgcolor: isSelected ? "primary.50" : "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        <ListItemIcon sx={{ minWidth: 42 }}>
          <Checkbox
            edge="start"
            checked={isSelected}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          primary={task.name}
          secondary={
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          }
          sx={{ flex: 1 }}
        />
      </Box>

      {isSelected && (
        <TaskDetails
          task={task}
          currentHours={currentHours}
          totalCost={totalCost}
          onHoursChange={onHoursChange}
          includeMaterialCosts={includeMaterialCosts}
          onMaterialSelectionChange={onMaterialSelectionChange}
        />
      )}
    </ListItem>
  );
};

export default TaskItem;
