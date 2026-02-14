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
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Task {
  id: string;
  name: string;
  category: "prep" | "paint" | "finish";
  isGood: boolean;
}

const goodTasks: Task[] = [
  { id: "1", name: "Protect area", category: "prep", isGood: true },
  { id: "2", name: "Mask trim", category: "prep", isGood: true },
  { id: "3", name: "Sand walls", category: "prep", isGood: true },
  { id: "4", name: "Patch small (nail holes)", category: "prep", isGood: true },
  { id: "5", name: "Patch medium (fist size)", category: "prep", isGood: true },
  { id: "6", name: "Prime spot patches", category: "prep", isGood: true },
  { id: "7", name: "Roll walls", category: "paint", isGood: true },
  { id: "8", name: "Spray door", category: "paint", isGood: true },
  { id: "9", name: "Brush trim", category: "paint", isGood: true },
  { id: "10", name: "Reinstall hardware", category: "finish", isGood: true },
  { id: "11", name: "Remove masking", category: "finish", isGood: true },
  { id: "12", name: "Final cleanup", category: "finish", isGood: true },
];

const badTasks: Task[] = [
  { id: "b1", name: "Bedroom repaint", category: "paint", isGood: false },
  { id: "b2", name: "Hallway refresh", category: "paint", isGood: false },
  { id: "b3", name: "Kitchen job", category: "paint", isGood: false },
  { id: "b4", name: "Fix everything", category: "prep", isGood: false },
];

const TaskDefinitionManager: React.FC = () => {
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<
    "prep" | "paint" | "finish"
  >("prep");

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        category: newTaskCategory,
        isGood: true,
      };
      setCustomTasks([...customTasks, newTask]);
      setNewTaskName("");
    }
  };

  const handleDeleteTask = (id: string) => {
    setCustomTasks(customTasks.filter((task) => task.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prep":
        return "warning";
      case "paint":
        return "primary";
      case "finish":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Step 1: Define Repeatable Tasks (Not Rooms)
        </Typography>
        <Typography variant="body2">
          You want <strong>LEGO blocks</strong>, not entire houses. Break work
          into specific, measurable tasks that you can track and improve over
          time.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Good vs Bad Examples */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CancelIcon color="error" />
                <Typography variant="h6" fontWeight={700} color="error">
                  Bad Task Definitions
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Too vague - impossible to track accurately
              </Typography>
              <List dense>
                {badTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      bgcolor: "error.light",
                      borderRadius: 1,
                      mb: 1,
                      opacity: 0.7,
                    }}
                  >
                    <ListItemText
                      primary={task.name}
                      secondary="❌ Too broad to measure"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CheckCircleIcon color="success" />
                <Typography variant="h6" fontWeight={700} color="success.main">
                  Good Task Definitions
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Specific, measurable, repeatable
              </Typography>
              <List dense>
                {goodTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      bgcolor: "success.light",
                      borderRadius: 1,
                      mb: 1,
                      opacity: 0.9,
                    }}
                  >
                    <ListItemText
                      primary={task.name}
                      secondary={
                        <Chip
                          label={task.category.toUpperCase()}
                          size="small"
                          color={getCategoryColor(task.category) as any}
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Add Custom Tasks */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Define Your Custom Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add specific tasks that are unique to your workflow. Keep them
                small and measurable.
              </Typography>

              <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Task Name"
                      placeholder="e.g., Caulk window frames"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {(["prep", "paint", "finish"] as const).map((cat) => (
                        <Chip
                          key={cat}
                          label={cat}
                          onClick={() => setNewTaskCategory(cat)}
                          color={
                            newTaskCategory === cat
                              ? (getCategoryColor(cat) as any)
                              : "default"
                          }
                          sx={{ textTransform: "capitalize" }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                      disabled={!newTaskName.trim()}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {customTasks.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Your Custom Tasks ({customTasks.length})
                  </Typography>
                  <List>
                    {customTasks.map((task) => (
                      <ListItem
                        key={task.id}
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={task.name}
                          secondary={
                            <Chip
                              label={task.category.toUpperCase()}
                              size="small"
                              color={getCategoryColor(task.category) as any}
                              sx={{ mt: 0.5 }}
                            />
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteTask(task.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Key Principles */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                📌 Key Principles for Task Definition
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    ✓ Specific
                  </Typography>
                  <Typography variant="body2">
                    "Roll walls" not "paint room"
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    ✓ Measurable
                  </Typography>
                  <Typography variant="body2">
                    Can track time and output
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    ✓ Repeatable
                  </Typography>
                  <Typography variant="body2">
                    Same task across projects
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    ✓ Isolated
                  </Typography>
                  <Typography variant="body2">
                    One task, one measurement
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDefinitionManager;
