"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TaskItem from "../TaskItem";
import { LaborMaterial, LaborTask, TaskHours } from "@/interfaces/laborTypes";
import { availableLaborTasks } from "../../../constants/laborData";

interface Props {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  filteredLaborTasks: LaborTask[];
  taskHours: TaskHours;
  selectedLaborTasks: string[];
  onLaborTaskToggle: (taskName: string) => void;
  onHoursChange: (taskName: string, hours: number) => void;
  includeMaterialCosts: boolean;
  setSelectedLaborTasks: React.Dispatch<React.SetStateAction<string[]>>;
}

const TaskSelectionPanel = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filteredLaborTasks,
  taskHours,
  selectedLaborTasks,
  onLaborTaskToggle,
  onHoursChange,
  includeMaterialCosts,
  setSelectedLaborTasks,
}: Props) => {
  const onMaterialSelectionChange = (
    taskName: string,
    selectedMaterials: LaborMaterial[]
  ) => {
    console.log(`Selected materials for ${taskName}:`, selectedMaterials);
  };

  return (
    <Grid size={{ xs: 12, md: 7 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6">Available Labor Tasks</Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredLaborTasks.length} of {availableLaborTasks.length} tasks
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search tasks by name, description, or materials..."
        value={searchTerm}
        onChange={onSearchChange}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search Results Info */}
      {searchTerm && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredLaborTasks.length === 0 ? (
              <>No tasks found for "{searchTerm}"</>
            ) : (
              <>
                Found {filteredLaborTasks.length} task
                {filteredLaborTasks.length !== 1 ? "s" : ""} matching "
                {searchTerm}"
              </>
            )}
          </Typography>
        </Box>
      )}

      {/* Task List */}
      <List>
        {filteredLaborTasks.length === 0 && searchTerm ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No labor tasks match your search criteria.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try different keywords or clear the search to see all tasks.
            </Typography>
          </Box>
        ) : (
          filteredLaborTasks.map((task) => (
            <TaskItem
              key={task.name}
              task={task}
              currentHours={taskHours[task.name] || task.hours}
              isSelected={selectedLaborTasks.includes(task.name)}
              onToggle={onLaborTaskToggle}
              onHoursChange={onHoursChange}
              includeMaterialCosts={includeMaterialCosts}
              onMaterialSelectionChange={onMaterialSelectionChange}
            />
          ))
        )}
      </List>
    </Grid>
  );
};

export default TaskSelectionPanel;
