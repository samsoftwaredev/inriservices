"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  AddCircleOutline,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Pending as PendingIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CustomerHeader from "../CustomerHeader";

interface WorkHistoryItem {
  id: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  totalCost: number;
  numberOfRooms: number;
  date: string;
  status: "document_sent" | "in_progress" | "pending_signature" | "completed";
  projectType: "interior" | "exterior";
}

interface DashboardStats {
  jobsCompleted: number;
  amountEarned: number;
  numberOfCustomers: number;
  pendingWork: number;
}

const DashboardPage = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  // Sample dashboard statistics
  const stats: DashboardStats = {
    jobsCompleted: 24,
    amountEarned: 87650,
    numberOfCustomers: 18,
    pendingWork: 6,
  };

  // Sample work history data
  const workHistory: WorkHistoryItem[] = [
    {
      id: "1",
      customerName: "John Doe",
      address: "123 Main St",
      city: "Garland",
      state: "TX",
      totalCost: 3200,
      numberOfRooms: 4,
      date: "2024-10-01",
      status: "completed",
      projectType: "interior",
    },
    {
      id: "2",
      customerName: "Alice Johnson",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "TX",
      totalCost: 5800,
      numberOfRooms: 6,
      date: "2024-10-05",
      status: "pending_signature",
      projectType: "interior",
    },
    {
      id: "3",
      customerName: "Michael Brown",
      address: "789 Pine Street",
      city: "Riverside",
      state: "FL",
      totalCost: 2900,
      numberOfRooms: 3,
      date: "2024-10-08",
      status: "in_progress",
      projectType: "exterior",
    },
    {
      id: "4",
      customerName: "Sarah Wilson",
      address: "321 Elm Drive",
      city: "Austin",
      state: "TX",
      totalCost: 4500,
      numberOfRooms: 5,
      date: "2024-10-10",
      status: "document_sent",
      projectType: "interior",
    },
    {
      id: "5",
      customerName: "David Martinez",
      address: "654 Cedar Lane",
      city: "Houston",
      state: "TX",
      totalCost: 6200,
      numberOfRooms: 7,
      date: "2024-10-12",
      status: "in_progress",
      projectType: "interior",
    },
  ];

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    workId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkId(workId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkId(null);
  };

  const handleNewEstimate = () => {
    router.push("/estimates");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending_signature":
        return "warning";
      case "document_sent":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending_signature":
        return "Pending Signature";
      case "document_sent":
        return "Document Sent";
      default:
        return status;
    }
  };

  const summaryCards = [
    {
      title: "Jobs Completed",
      value: stats.jobsCompleted,
      icon: <WorkIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success.main",
      bgColor: "success.50",
      format: (value: number) => value.toString(),
    },
    {
      title: "Amount Earned",
      value: stats.amountEarned,
      icon: <MoneyIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary.main",
      bgColor: "primary.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Number of Customers",
      value: stats.numberOfCustomers,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info.main",
      bgColor: "info.50",
      format: (value: number) => value.toString(),
    },
    {
      title: "Pending Work",
      value: stats.pendingWork,
      icon: <PendingIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning.main",
      bgColor: "warning.50",
      format: (value: number) => value.toString(),
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <CustomerHeader
        headerName="Estimates Dashboard"
        headerDescription="Manage your painting projects and quotes"
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={handleNewEstimate}
        >
          New Estimate
        </Button>
      </CustomerHeader>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${card.bgColor} 0%, white 100%)`,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={card.color}
                    >
                      {card.format(card.value)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                {card.title === "Amount Earned" && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon
                      sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                    />
                    <Typography variant="caption" color="success.main">
                      +12% from last month
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Work History Section */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Work History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent projects and their current status
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>Customer</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Rooms</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workHistory.map((work) => (
                  <TableRow
                    key={work.id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {work.customerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{work.address}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {work.city}, {work.state}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={work.numberOfRooms}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={work.projectType}
                        size="small"
                        color={
                          work.projectType === "interior"
                            ? "primary"
                            : "success"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${work.totalCost.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {new Date(work.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(work.status)}
                        size="small"
                        color={getStatusColor(work.status) as any}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, work.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Progress Bar for Current Month */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Monthly Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.jobsCompleted} / 30 jobs
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(stats.jobsCompleted / 30) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Estimate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <SendIcon sx={{ mr: 1, fontSize: 18 }} />
          Send Document
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardPage;
