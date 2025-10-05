"use client";

import React from "react";
import { Box, Typography, Chip, Divider, Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface TaskBreakdown {
  name: string;
  hours: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
}

interface Props {
  selectedLaborTasks: string[];
  totalLaborCost: number;
  totalMaterialCost: number;
  totalCost: number;
  taskBreakdown: (TaskBreakdown | null)[];
  includeMaterialCosts: boolean;
}

const CostSummaryPanel = ({
  selectedLaborTasks,
  totalLaborCost,
  totalMaterialCost,
  totalCost,
  taskBreakdown,
  includeMaterialCosts,
}: Props) => {
  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          p: 2,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AttachMoneyIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Cost Summary</Typography>
        </Box>

        {selectedLaborTasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No labor tasks selected
          </Typography>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Tasks ({selectedLaborTasks.length}):
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mb: 2,
                }}
              >
                {selectedLaborTasks.map((taskName) => (
                  <Chip
                    key={taskName}
                    label={taskName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Cost Breakdown Summary */}
            <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Labor Cost:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${totalLaborCost.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Material Cost:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{
                      textDecoration: !includeMaterialCosts
                        ? "line-through"
                        : "none",
                      color: !includeMaterialCosts
                        ? "text.disabled"
                        : "inherit",
                    }}
                  >
                    $
                    {includeMaterialCosts
                      ? totalMaterialCost.toLocaleString()
                      : "0"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cost Breakdown:
              </Typography>
              {taskBreakdown.map((task) => (
                <Box key={task?.name} sx={{ mb: 1, fontSize: "0.875rem" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">
                      {task?.name} ({task?.hours}h)
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ${task?.totalCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      ml: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Labor: ${task?.laborCost.toFixed(2)}
                      {(task?.materialCost || 0) > 0 &&
                        includeMaterialCosts &&
                        ` + Materials: $${task?.materialCost?.toFixed(2)}`}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" color="primary.main">
                Total {includeMaterialCosts ? "Project" : "Labor"} Cost
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                ${totalCost.toLocaleString()}
              </Typography>
              {!includeMaterialCosts && (
                <Typography variant="caption" color="text.secondary">
                  Materials not included
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Grid>
  );
};

export default CostSummaryPanel;
