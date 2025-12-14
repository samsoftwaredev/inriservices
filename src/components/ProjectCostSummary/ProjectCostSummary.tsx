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
  return null; // Implementation goes here
};

export default ProjectCostSummary;
