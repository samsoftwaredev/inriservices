"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Person as PersonIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  BusinessCenter as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Room as RoomIcon,
  Straighten as StraightenIcon,
  Height as HeightIcon,
  Crop as CropIcon,
} from "@mui/icons-material";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import { useRouter } from "next/navigation";
import { projectApi } from "@/services/projectApi";
import {
  ClientTransformed,
  ProjectTransformed,
  PropertyRoomTransformed,
  PropertyTransformed,
} from "@/types";
import {
  allRoomPropertyTransformer,
  clientTransformer,
  projectTransformer,
  propertyTransformer,
} from "@/tools/transformers";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

type ProjectFullData = ProjectTransformed & {
  client: ClientTransformed;
  property: PropertyTransformed & { rooms: PropertyRoomTransformed[] };
};

const ProjectPage = ({ params }: Props) => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<null | ProjectFullData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  const onInit = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const projectData = await projectApi.getProject(id);
        const transformedProject: ProjectFullData = {
          ...projectTransformer(projectData),
          client: clientTransformer(projectData.client),
          property: {
            ...propertyTransformer(projectData.property),
            rooms: allRoomPropertyTransformer(projectData.property.rooms),
          },
        };
        setProject(transformedProject);
      } catch (error) {
        console.error("Error fetching project data:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (projectId) {
      onInit(projectId);
    }
  }, [projectId, onInit]);

  // Helper functions for formatting and calculations
  const formatCurrency = (cents: number) =>
    `$${(cents / 100).toLocaleString()}`;
  const formatPercentage = (bps: number) => `${(bps / 100).toFixed(2)}%`;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const calculateProjectProgress = () => {
    if (!project?.startDate || !project?.endDate) return 0;
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = Date.now();
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const calculateTotalArea = () => {
    if (!project?.property?.rooms) return 0;
    return project.property.rooms.reduce((total, room) => {
      return total + (room.floorAreaSqft || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!project) return 0;
    return (
      project.materialCostCents +
      project.laborCostCents +
      project.taxAmountCents
    );
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loading project details...
            </Typography>
            <LinearProgress />
          </Box>
        ) : !project ? (
          <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h4" color="error" gutterBottom>
              Project Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The requested project could not be found.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </Container>
        ) : (
          <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header Section */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                mb: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BusinessIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {project.name}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        {project.projectType.replace("_", " ").toUpperCase()}{" "}
                        PROJECT
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      label={project.status.replace("_", " ").toUpperCase()}
                      color={getStatusColor(project.status) as any}
                      sx={{ color: "white", fontWeight: "bold" }}
                    />
                    {project.startDate && (
                      <Chip
                        icon={<CalendarIcon />}
                        label={`Started: ${new Date(
                          project.startDate
                        ).toLocaleDateString()}`}
                        variant="outlined"
                        sx={{
                          color: "white",
                          borderColor: "rgba(255,255,255,0.5)",
                        }}
                      />
                    )}
                    <Chip
                      icon={<MoneyIcon />}
                      label={formatCurrency(calculateTotalCost())}
                      variant="outlined"
                      sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                        fontWeight: "bold",
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={{ xs: "center", md: "flex-end" }}
                  >
                    <IconButton
                      sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>

              {/* Progress Bar */}
              {project.startDate && project.endDate && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                    Project Progress: {calculateProjectProgress()}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProjectProgress()}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.3)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "rgba(255,255,255,0.8)",
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>

            {/* Key Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <MoneyIcon />
                      </Avatar>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Total Cost
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {formatCurrency(calculateTotalCost())}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "success.main" }}>
                        <RoomIcon />
                      </Avatar>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Total Rooms
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {project.property.rooms.length}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <CropIcon />
                      </Avatar>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Total Area
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {calculateTotalArea().toLocaleString()} sq ft
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "info.main" }}>
                        <ScheduleIcon />
                      </Avatar>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Est. Hours
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {project.laborHoursEstimated || "TBD"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tabbed Content */}
            <Paper elevation={1}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="Overview" />
                <Tab label="Client Details" />
                <Tab label="Property & Rooms" />
                <Tab label="Financial Breakdown" />
                <Tab label="Timeline" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Overview Tab */}
                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" gutterBottom>
                        Project Information
                      </Typography>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography color="text.secondary">
                            Project Type:
                          </Typography>
                          <Typography fontWeight="medium">
                            {project.projectType
                              .replace("_", " ")
                              .toUpperCase()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography color="text.secondary">
                            Status:
                          </Typography>
                          <Chip
                            label={project.status
                              .replace("_", " ")
                              .toUpperCase()}
                            color={getStatusColor(project.status) as any}
                            size="small"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography color="text.secondary">
                            Created:
                          </Typography>
                          <Typography>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography color="text.secondary">
                            Last Updated:
                          </Typography>
                          <Typography>
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>

                      {project.scopeNotes && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            <DescriptionIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Scope Notes
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, bgcolor: "grey.50" }}
                          >
                            <Typography variant="body2">
                              {project.scopeNotes}
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          fullWidth
                        >
                          Edit Project
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ShareIcon />}
                          fullWidth
                        >
                          Share with Client
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          fullWidth
                        >
                          Generate Report
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {/* Client Details Tab */}
                {activeTab === 1 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={3}
                            alignItems="center"
                            sx={{ mb: 3 }}
                          >
                            <Avatar
                              sx={{
                                width: 80,
                                height: 80,
                                bgcolor: "primary.main",
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" fontWeight="bold">
                                {project.client.displayName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {project.client.clientType
                                  .replace("_", " ")
                                  .toUpperCase()}{" "}
                                CLIENT
                              </Typography>
                              <Chip
                                label={project.client.status
                                  .replace("_", " ")
                                  .toUpperCase()}
                                color={
                                  project.client.status === "active"
                                    ? "success"
                                    : "default"
                                }
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Stack spacing={2}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <EmailIcon
                                    sx={{ mr: 2, color: "action.active" }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Email Address
                                    </Typography>
                                    <Typography variant="body1">
                                      {project.client.email || "Not provided"}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <PhoneIcon
                                    sx={{ mr: 2, color: "action.active" }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Phone Number
                                    </Typography>
                                    <Typography variant="body1">
                                      {project.client.phone || "Not provided"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <CalendarIcon
                                  sx={{ mr: 2, color: "action.active" }}
                                />
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Client Since
                                  </Typography>
                                  <Typography variant="body1">
                                    {new Date(
                                      project.client.createdAt
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          {project.client.notes && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle2" gutterBottom>
                                Client Notes
                              </Typography>
                              <Paper
                                variant="outlined"
                                sx={{ p: 2, bgcolor: "grey.50" }}
                              >
                                <Typography variant="body2">
                                  {project.client.notes}
                                </Typography>
                              </Paper>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        Client Actions
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          variant="outlined"
                          startIcon={<PhoneIcon />}
                          fullWidth
                        >
                          Call Client
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          fullWidth
                        >
                          Send Email
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PersonIcon />}
                          fullWidth
                        >
                          View Client Profile
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {/* Property & Rooms Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <HomeIcon sx={{ mr: 1 }} />
                              Property Information
                            </Typography>

                            <Stack spacing={2}>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Property Name
                                </Typography>
                                <Typography variant="h6">
                                  {project.property.name}
                                </Typography>
                              </Box>

                              <Box
                                sx={{ display: "flex", alignItems: "start" }}
                              >
                                <LocationIcon
                                  sx={{
                                    mr: 1,
                                    mt: 0.5,
                                    color: "action.active",
                                  }}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                  >
                                    Address
                                  </Typography>
                                  <Typography variant="body1">
                                    {project.property.addressLine1}
                                  </Typography>
                                  {project.property.addressLine2 && (
                                    <Typography variant="body1">
                                      {project.property.addressLine2}
                                    </Typography>
                                  )}
                                  <Typography variant="body1">
                                    {project.property.city},{" "}
                                    {project.property.state}{" "}
                                    {project.property.zip}
                                  </Typography>
                                  <Typography variant="body1">
                                    {project.property.country}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Property Type
                                </Typography>
                                <Chip
                                  label={project.property.propertyType
                                    .replace("_", " ")
                                    .toUpperCase()}
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Property Summary
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid size={6}>
                                <Box textAlign="center">
                                  <Typography
                                    variant="h4"
                                    color="primary.main"
                                    fontWeight="bold"
                                  >
                                    {project.property.rooms.length}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Total Rooms
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid size={6}>
                                <Box textAlign="center">
                                  <Typography
                                    variant="h4"
                                    color="success.main"
                                    fontWeight="bold"
                                  >
                                    {calculateTotalArea().toLocaleString()}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Sq Ft Total
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Rooms List */}
                    <Typography variant="h6" gutterBottom>
                      Room Details ({project.property.rooms.length} rooms)
                    </Typography>

                    <Grid container spacing={2}>
                      {project.property.rooms.map((room, index) => (
                        <Grid key={room.id} size={{ xs: 12, md: 6, lg: 4 }}>
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <RoomIcon sx={{ mr: 1 }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {room.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Level {room.level} •{" "}
                                    {room.floorAreaSqft || "N/A"} sq ft
                                  </Typography>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack spacing={2}>
                                <Grid container spacing={2}>
                                  <Grid size={6}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <CropIcon sx={{ mr: 1, fontSize: 16 }} />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          Floor Area
                                        </Typography>
                                        <Typography variant="body2">
                                          {room.floorAreaSqft
                                            ? `${room.floorAreaSqft} sq ft`
                                            : "N/A"}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  <Grid size={6}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <HeightIcon
                                        sx={{ mr: 1, fontSize: 16 }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          Ceiling Height
                                        </Typography>
                                        <Typography variant="body2">
                                          {room.ceilingHeightFt
                                            ? `${room.ceilingHeightFt} ft`
                                            : "N/A"}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>

                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Paint Services
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {room.paintWalls && (
                                      <Chip
                                        label="Walls"
                                        size="small"
                                        color="primary"
                                      />
                                    )}
                                    {room.paintCeiling && (
                                      <Chip
                                        label="Ceiling"
                                        size="small"
                                        color="primary"
                                      />
                                    )}
                                    {room.paintTrim && (
                                      <Chip
                                        label="Trim"
                                        size="small"
                                        color="primary"
                                      />
                                    )}
                                    {room.paintDoors && (
                                      <Chip
                                        label="Doors"
                                        size="small"
                                        color="primary"
                                      />
                                    )}
                                  </Stack>
                                </Box>

                                {room.description && (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Description
                                    </Typography>
                                    <Typography variant="body2">
                                      {room.description}
                                    </Typography>
                                  </Box>
                                )}

                                {(room.notesCustomer || room.notesInternal) && (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Notes
                                    </Typography>
                                    {room.notesCustomer && (
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
                                        <strong>Customer:</strong>{" "}
                                        {room.notesCustomer}
                                      </Typography>
                                    )}
                                    {room.notesInternal && (
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
                                        <strong>Internal:</strong>{" "}
                                        {room.notesInternal}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Financial Breakdown Tab */}
                {activeTab === 3 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Cost Breakdown
                          </Typography>

                          <Stack spacing={3}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                Material Costs
                              </Typography>
                              <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(project.materialCostCents)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                Labor Costs
                              </Typography>
                              <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(project.laborCostCents)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                Markup ({formatPercentage(project.markupBps)})
                              </Typography>
                              <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(
                                  ((project.materialCostCents +
                                    project.laborCostCents) *
                                    project.markupBps) /
                                    10000
                                )}
                              </Typography>
                            </Box>

                            <Divider />

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">Subtotal</Typography>
                              <Typography variant="h6">
                                {formatCurrency(
                                  project.materialCostCents +
                                    project.laborCostCents +
                                    ((project.materialCostCents +
                                      project.laborCostCents) *
                                      project.markupBps) /
                                      10000
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                Tax ({formatPercentage(project.taxRateBps)})
                              </Typography>
                              <Typography variant="h6">
                                {formatCurrency(project.taxAmountCents)}
                              </Typography>
                            </Box>

                            <Divider />

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                bgcolor: "primary.main",
                                color: "white",
                                p: 2,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                Total Project Cost
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {formatCurrency(calculateTotalCost())}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>

                      {project.invoiceTotalCents && (
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Invoice Information
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                Invoice Total
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="success.main"
                              >
                                {formatCurrency(project.invoiceTotalCents)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Financial Summary
                          </Typography>
                          <Stack spacing={2}>
                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Cost per Sq Ft
                              </Typography>
                              <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary.main"
                              >
                                $
                                {(
                                  calculateTotalCost() /
                                  100 /
                                  Math.max(calculateTotalArea(), 1)
                                ).toFixed(2)}
                              </Typography>
                            </Box>

                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Cost per Room
                              </Typography>
                              <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="success.main"
                              >
                                $
                                {(
                                  calculateTotalCost() /
                                  100 /
                                  Math.max(project.property.rooms.length, 1)
                                ).toFixed(2)}
                              </Typography>
                            </Box>

                            {project.laborHoursEstimated && (
                              <Box textAlign="center">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Cost per Hour
                                </Typography>
                                <Typography
                                  variant="h5"
                                  fontWeight="bold"
                                  color="warning.main"
                                >
                                  $
                                  {(
                                    calculateTotalCost() /
                                    100 /
                                    project.laborHoursEstimated
                                  ).toFixed(2)}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* Timeline Tab */}
                {activeTab === 4 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Project Timeline
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                <CalendarIcon
                                  sx={{ mr: 1, verticalAlign: "middle" }}
                                />
                                Key Dates
                              </Typography>

                              <Stack spacing={2}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography color="text.secondary">
                                    Project Created:
                                  </Typography>
                                  <Typography>
                                    {new Date(
                                      project.createdAt
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                {project.startDate && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography color="text.secondary">
                                      Start Date:
                                    </Typography>
                                    <Typography>
                                      {new Date(
                                        project.startDate
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}

                                {project.endDate && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography color="text.secondary">
                                      End Date:
                                    </Typography>
                                    <Typography>
                                      {new Date(
                                        project.endDate
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography color="text.secondary">
                                    Last Updated:
                                  </Typography>
                                  <Typography>
                                    {new Date(
                                      project.updatedAt
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>

                          {project.laborHoursEstimated && (
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  gutterBottom
                                >
                                  <ScheduleIcon
                                    sx={{ mr: 1, verticalAlign: "middle" }}
                                  />
                                  Labor Estimation
                                </Typography>

                                <Box textAlign="center">
                                  <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color="primary.main"
                                  >
                                    {project.laborHoursEstimated}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Estimated Hours
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        {project.startDate && project.endDate && (
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                Progress Tracking
                              </Typography>

                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Project Duration:{" "}
                                  {Math.ceil(
                                    (new Date(project.endDate).getTime() -
                                      new Date(project.startDate).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateProjectProgress()}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {calculateProjectProgress()}% Complete
                                </Typography>
                              </Box>

                              <Stack spacing={2}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Days Remaining:
                                  </Typography>
                                  <Typography variant="h6">
                                    {Math.max(
                                      0,
                                      Math.ceil(
                                        (new Date(project.endDate).getTime() -
                                          Date.now()) /
                                          (1000 * 60 * 60 * 24)
                                      )
                                    )}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Container>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ProjectPage;
