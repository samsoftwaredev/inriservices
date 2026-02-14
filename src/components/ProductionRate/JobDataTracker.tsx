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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface JobData {
  id: string;
  jobName: string;
  date: string;
  totalHours: number;
  crewSize: number;
  tasksPerformed: TaskTime[];
  obstacles: string;
  materialsUsed: string;
}

interface TaskTime {
  task: string;
  hours: number;
}

const JobDataTracker: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  // Form state
  const [jobName, setJobName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [crewSize, setCrewSize] = useState<number>(1);
  const [obstacles, setObstacles] = useState("");
  const [materialsUsed, setMaterialsUsed] = useState("");
  const [tasks, setTasks] = useState<TaskTime[]>([{ task: "", hours: 0 }]);

  const handleAddTask = () => {
    setTasks([...tasks, { task: "", hours: 0 }]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (
    index: number,
    field: keyof TaskTime,
    value: string | number,
  ) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleSaveJob = () => {
    const newJob: JobData = {
      id: Date.now().toString(),
      jobName,
      date,
      totalHours,
      crewSize,
      tasksPerformed: tasks.filter((t) => t.task && t.hours > 0),
      obstacles,
      materialsUsed,
    };

    setJobs([newJob, ...jobs]);

    // Reset form
    setJobName("");
    setDate(new Date().toISOString().split("T")[0]);
    setTotalHours(0);
    setCrewSize(1);
    setObstacles("");
    setMaterialsUsed("");
    setTasks([{ task: "", hours: 0 }]);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleViewJob = (job: JobData) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const totalTaskHours = tasks.reduce(
    (sum, task) => sum + Number(task.hours || 0),
    0,
  );
  const hoursDiscrepancy = totalHours - totalTaskHours;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Step 2: Capture Real Job Data
        </Typography>
        <Typography variant="body2">
          After each job, record the facts:{" "}
          <strong>
            total hours, tasks performed, obstacles, materials, and crew size.
          </strong>
          <br />
          No theory. Only facts. Track 20-40 projects and patterns will appear
          fast.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Add New Job Form */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Record New Job
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Job Name/Address"
                  placeholder="123 Main St - Interior Repaint"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  size="small"
                  fullWidth
                  required
                />

                <TextField
                  label="Date Completed"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Total Hours"
                      type="number"
                      value={totalHours || ""}
                      onChange={(e) => setTotalHours(Number(e.target.value))}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Crew Size"
                      type="number"
                      value={crewSize || ""}
                      onChange={(e) => setCrewSize(Number(e.target.value))}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Task Breakdown
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                    >
                      Add Task
                    </Button>
                  </Box>

                  {tasks.map((task, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        placeholder="Task name"
                        value={task.task}
                        onChange={(e) =>
                          handleTaskChange(index, "task", e.target.value)
                        }
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        placeholder="Hours"
                        type="number"
                        value={task.hours || ""}
                        onChange={(e) =>
                          handleTaskChange(
                            index,
                            "hours",
                            Number(e.target.value),
                          )
                        }
                        size="small"
                        sx={{ width: 100 }}
                      />
                      {tasks.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveTask(index)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}

                  {hoursDiscrepancy !== 0 && totalHours > 0 && (
                    <Alert
                      severity={
                        Math.abs(hoursDiscrepancy) > 1 ? "warning" : "info"
                      }
                      sx={{ mt: 2 }}
                    >
                      <Typography variant="caption">
                        Task hours ({totalTaskHours}h) vs Total hours (
                        {totalHours}h):
                        <strong>
                          {" "}
                          {hoursDiscrepancy > 0 ? "+" : ""}
                          {hoursDiscrepancy.toFixed(1)}h unaccounted
                        </strong>
                      </Typography>
                    </Alert>
                  )}
                </Paper>

                <TextField
                  label="Obstacles/Challenges"
                  placeholder="Furniture moving, high ceilings, texture matching..."
                  value={obstacles}
                  onChange={(e) => setObstacles(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />

                <TextField
                  label="Materials Used"
                  placeholder="3 gal SW ProClassic, 2 rolls tape..."
                  value={materialsUsed}
                  onChange={(e) => setMaterialsUsed(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSaveJob}
                  disabled={!jobName || totalHours === 0}
                  sx={{ mt: 1 }}
                >
                  Save Job Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Job History */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Job History ({jobs.length} recorded)
              </Typography>

              {jobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No jobs recorded yet. Start tracking your work above!
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Job</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Hours</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Crew</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Tasks</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id} hover>
                          <TableCell>{job.jobName}</TableCell>
                          <TableCell>
                            {new Date(job.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${job.totalHours}h`}
                              size="small"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="center">{job.crewSize}</TableCell>
                          <TableCell align="center">
                            {job.tasksPerformed.length}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewJob(job)}
                              color="primary"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteJob(job.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {jobs.length >= 5 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Great progress! You have {jobs.length} jobs tracked.
                {jobs.length >= 20 &&
                  " You have enough data to start calculating accurate production rates!"}
              </Typography>
            </Alert>
          )}
        </Grid>
      </Grid>

      {/* Job Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {selectedJob?.jobName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(selectedJob.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedJob.totalHours}h
                  </Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Crew Size
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedJob.crewSize}
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Task Breakdown
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Task</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Hours</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>%</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedJob.tasksPerformed.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell>{task.task}</TableCell>
                          <TableCell align="right">{task.hours}h</TableCell>
                          <TableCell align="right">
                            {(
                              (task.hours / selectedJob.totalHours) *
                              100
                            ).toFixed(0)}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {selectedJob.obstacles && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Obstacles/Challenges
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2">
                      {selectedJob.obstacles}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedJob.materialsUsed && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Materials Used
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2">
                      {selectedJob.materialsUsed}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDataTracker;
