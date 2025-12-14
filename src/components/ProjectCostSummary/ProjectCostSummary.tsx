"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useProjectCost } from "@/context/ProjectCostContext";

interface Props {
  title?: string;
  showBreakdown?: boolean;
  showByRoom?: boolean;
}

const ProjectCostSummary: React.FC<Props> = ({
  title = "Project Cost Summary",
  showBreakdown = true,
  showByRoom = false,
}) => {
  const {
    totalProjectCost,
    totalProjectLaborCost,
    totalProjectMaterialCost,
    projectTaskBreakdown,
  } = useProjectCost();

  // Group tasks by room if requested
  const roomBreakdowns = React.useMemo(() => {
    if (!showByRoom) return {};

    const rooms: { [roomId: string]: any[] } = {};
    // projectTaskBreakdown.forEach((task) => {
    //   const roomId = task.roomId || "unassigned";
    //   if (!rooms[roomId]) {
    //     rooms[roomId] = [];
    //   }
    //   rooms[roomId].push(task);
    // });

    return rooms;
  }, [projectTaskBreakdown, showByRoom]);

  // const registeredIds = getAllRegisteredIds();

  // if (registeredIds.length === 0) {
  //   return (
  //     <Card>
  //       <CardContent>
  //         <Typography variant="h6" gutterBottom>
  //           {title}
  //         </Typography>
  //         <Typography variant="body2" color="text.secondary">
  //           No cost data available. Add some labor tasks to see project costs.
  //         </Typography>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          {/* Summary Cards */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary.main">
                    ${totalProjectCost.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Project Cost
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    ${totalProjectLaborCost.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Labor Cost
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    ${totalProjectMaterialCost.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Material Cost
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Active Cost Sources */}
          {/* <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Cost Sources ({registeredIds.length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {registeredIds.map((id) => (
                <Chip key={id} label={id} size="small" variant="outlined" />
              ))}
            </Box>
          </Box> */}

          {/* Task Breakdown
          {showBreakdown && projectTaskBreakdown.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Task Breakdown ({projectTaskBreakdown.length} tasks)
              </Typography>

              {showByRoom && Object.keys(roomBreakdowns).length > 0 ? (
                // Group by room
                Object.entries(roomBreakdowns).map(([roomId, tasks]) => (
                  <Box key={roomId} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {roomId === "unassigned"
                        ? "Unassigned Tasks"
                        : `Room: ${roomId}`}
                    </Typography>
                    <TaskBreakdownTable tasks={tasks} />
                  </Box>
                ))
              ) : (
                // Show all tasks together
                <TaskBreakdownTable tasks={projectTaskBreakdown} />
              )}
            </Box>
          )} */}
        </CardContent>
      </Card>
    </Box>
  );
};

// Helper component for task breakdown table
interface TaskBreakdownTableProps {
  tasks: any[];
}

const TaskBreakdownTable: React.FC<TaskBreakdownTableProps> = ({ tasks }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align="right">Hours</TableCell>
            <TableCell align="right">Labor Cost</TableCell>
            <TableCell align="right">Material Cost</TableCell>
            <TableCell align="right">Total Cost</TableCell>
            <TableCell>Feature</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={`${task.name}-${index}`}>
              <TableCell>{task.name}</TableCell>
              <TableCell align="right">{task.hours.toFixed(1)}</TableCell>
              <TableCell align="right">
                ${task.laborCost.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                ${task.materialCost.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                ${task.totalCost.toLocaleString()}
              </TableCell>
              <TableCell>
                {task.featureType && (
                  <Chip
                    label={`${task.featureType}${
                      task.featureId ? ` (${task.featureId})` : ""
                    }`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          {/* Summary Row */}
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {tasks.reduce((sum, task) => sum + task.hours, 0).toFixed(1)}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              $
              {tasks
                .reduce((sum, task) => sum + task.laborCost, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              $
              {tasks
                .reduce((sum, task) => sum + task.materialCost, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              $
              {tasks
                .reduce((sum, task) => sum + task.totalCost, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectCostSummary;
