"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  AddCircleOutline,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CustomerHeader from "../CustomerHeader";
import { projectApi } from "@/services";
import { toast } from "react-toastify";
import {
  DateFilter,
  DateFilterType,
  MetricCard,
  SummaryCard,
  WorkHistoryItem,
} from "@/types";
import ProjectProgress from "./ProjectProgress";
import ProjectTable from "./ProjectTable";
import MetricCards from "./MetricCards";

const initialStats: SummaryCard = {
  jobsCompleted: 0,
  amountEarnedCents: 0,
  numberOfCustomers: 0,
  pendingWork: 0,
  laborCostCents: 0,
  taxesCents: 0,
  averageAmountSpentByClientCents: 0,
  profitCents: 0,
};

const DashboardPage = () => {
  const goalProjectCompleted = 4;
  const router = useRouter();
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
  const [allProjects, setAllProjects] = useState<WorkHistoryItem[]>([]);
  const [stats, setStats] = useState<SummaryCard>(initialStats);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    type: "current-year",
    year: new Date().getFullYear(),
  });

  const getDateRangeFromFilter = useCallback((filter: DateFilter) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (filter.type) {
      case "current-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case "current-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "last-3-months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "last-6-months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case "custom-year":
        if (!filter.year) return { startDate: now, endDate: now };
        startDate = new Date(filter.year, 0, 1);
        endDate = new Date(filter.year, 11, 31);
        break;
      case "custom-month":
        if (!filter.year || filter.month === undefined)
          return { startDate: now, endDate: now };
        startDate = new Date(filter.year, filter.month, 1);
        endDate = new Date(filter.year, filter.month + 1, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
    }

    return { startDate, endDate };
  }, []);

  const filterProjectsByDate = useCallback(
    (projects: WorkHistoryItem[], filter: DateFilter) => {
      const { startDate, endDate } = getDateRangeFromFilter(filter);
      return projects.filter((project) => {
        const projectDate = new Date(project.date);
        return projectDate >= startDate && projectDate <= endDate;
      });
    },
    [getDateRangeFromFilter]
  );

  const calculateStatsFromProjects = useCallback(
    (projects: WorkHistoryItem[]) => {
      const completedProjects = projects.filter(
        (p) => p.status === "completed"
      );
      const pendingProjects = projects.filter((p) => p.status !== "completed");
      const uniqueCustomers = new Set(projects.map((p) => p.customerName)).size;

      const totalEarned = completedProjects.reduce(
        (sum, p) => sum + p.totalCost,
        0
      );
      const averageSpent =
        uniqueCustomers > 0 ? totalEarned / uniqueCustomers : 0;

      return {
        jobsCompleted: completedProjects.length,
        amountEarnedCents: Math.round(totalEarned * 100),
        numberOfCustomers: uniqueCustomers,
        pendingWork: pendingProjects.length,
        laborCostCents: Math.round(totalEarned * 0.4 * 100), // Estimate 40% labor cost
        taxesCents: Math.round(totalEarned * 0.08 * 100), // Estimate 8% tax
        averageAmountSpentByClientCents: Math.round(averageSpent * 100),
        profitCents: Math.round(totalEarned * 0.52 * 100), // Estimate 52% profit after costs
      };
    },
    []
  );

  const handleNewEstimate = () => {
    router.push("/estimates");
  };

  const summaryCards: MetricCard[] = [
    {
      title: "Jobs Completed",
      value: stats.jobsCompleted,
      icon: <WorkIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success.main",
      bgColor: "success.50",
      format: (value: number) => value.toString(),
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
    {
      title: "Amount Earned",
      value: stats.amountEarnedCents / 100,
      icon: <MoneyIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary.main",
      bgColor: "primary.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Labor Cost",
      value: stats.laborCostCents / 100,
      icon: <MoneyIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      color: "secondary.main",
      bgColor: "secondary.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Taxes Collected",
      value: stats.taxesCents / 100,
      icon: <MoneyIcon sx={{ fontSize: 40, color: "tertiary.main" }} />,
      color: "tertiary.main",
      bgColor: "tertiary.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Avg. Spent by Client",
      value: stats.averageAmountSpentByClientCents / 100,
      icon: <MoneyIcon sx={{ fontSize: 40, color: "dark.main" }} />,
      color: "dark.main",
      bgColor: "dark.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Profit",
      value: stats.profitCents / 100,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "green" }} />,
      color: "green",
      bgColor: "green.50",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  const getProjects = useCallback(async () => {
    try {
      const projectRes =
        await projectApi.listProjectsWithClientPropertyAndRooms();
      const projects = projectRes.items.map((project) => ({
        id: project.id,
        customerName: project.client.display_name,
        address: project.property.address_line1,
        city: project.property.city,
        state: project.property.state,
        totalCost:
          project.labor_cost_cents +
          project.material_cost_cents +
          project.tax_amount_cents,
        numberOfRooms: project.property.rooms.length,
        date: project.created_at,
        status: project.status,
        projectType: project.project_type,
      }));
      setAllProjects(projects);

      // Apply current filter
      const filteredProjects = filterProjectsByDate(projects, dateFilter);
      setWorkHistory(filteredProjects);
      setStats(calculateStatsFromProjects(filteredProjects));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects.");
    }
  }, [dateFilter, filterProjectsByDate, calculateStatsFromProjects]);

  const handleDateFilterChange = (newFilter: DateFilter) => {
    setDateFilter(newFilter);
    const filteredProjects = filterProjectsByDate(allProjects, newFilter);
    setWorkHistory(filteredProjects);
    setStats(calculateStatsFromProjects(filteredProjects));
  };

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <Box sx={{ py: 3 }}>
      <CustomerHeader
        headerName="Estimates Dashboard"
        headerDescription="Manage your painting projects and quotes"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Date Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Date</InputLabel>
            <Select
              value={dateFilter.type}
              label="Filter by Date"
              onChange={(e) => {
                const filterType = e.target.value as DateFilterType;
                let newFilter: DateFilter = { type: filterType };

                if (filterType === "custom-year") {
                  newFilter.year = new Date().getFullYear();
                } else if (filterType === "custom-month") {
                  newFilter.year = new Date().getFullYear();
                  newFilter.month = new Date().getMonth();
                }

                handleDateFilterChange(newFilter);
              }}
              startAdornment={
                <FilterListIcon sx={{ mr: 1, color: "action.active" }} />
              }
            >
              <MenuItem value="current-year">Current Year</MenuItem>
              <MenuItem value="current-month">Current Month</MenuItem>
              <MenuItem value="last-3-months">Last 3 Months</MenuItem>
              <MenuItem value="last-6-months">Last 6 Months</MenuItem>
              <MenuItem value="custom-year">Custom Year</MenuItem>
              <MenuItem value="custom-month">Custom Month</MenuItem>
            </Select>
          </FormControl>

          {/* Year Selector for Custom Year */}
          {dateFilter.type === "custom-year" && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={dateFilter.year || new Date().getFullYear()}
                label="Year"
                onChange={(e) => {
                  const newFilter = {
                    ...dateFilter,
                    year: Number(e.target.value),
                  };
                  handleDateFilterChange(newFilter);
                }}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          {/* Month and Year Selector for Custom Month */}
          {dateFilter.type === "custom-month" && (
            <>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={dateFilter.month ?? new Date().getMonth()}
                  label="Month"
                  onChange={(e) => {
                    const newFilter = {
                      ...dateFilter,
                      month: Number(e.target.value),
                    };
                    handleDateFilterChange(newFilter);
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i} value={i}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={dateFilter.year || new Date().getFullYear()}
                  label="Year"
                  onChange={(e) => {
                    const newFilter = {
                      ...dateFilter,
                      year: Number(e.target.value),
                    };
                    handleDateFilterChange(newFilter);
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={handleNewEstimate}
          >
            New Estimate
          </Button>
        </Stack>
      </CustomerHeader>
      <MetricCards summaryCards={summaryCards} />
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
                Recent projects and their current status ({workHistory.length}{" "}
                projects)
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Box>

          <ProjectTable
            workHistory={workHistory}
            onRefreshTable={getProjects}
          />

          <ProjectProgress
            jobsCompleted={stats.jobsCompleted}
            goalProjectCompleted={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
