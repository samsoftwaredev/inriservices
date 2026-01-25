"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { projectApi } from "@/services/projectApi";
import { Project, ProjectWithRelationsAndRooms } from "@/types";

interface ProjectSearchSelectorProps {
  value?: string; // Selected project ID
  onChange: (
    projectId: string,
    project: Project | ProjectWithRelationsAndRooms,
  ) => void;
  clientId?: string; // Optional: filter projects by client
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const ProjectSearchSelector: React.FC<ProjectSearchSelectorProps> = ({
  value,
  onChange,
  clientId,
  label = "Search Project",
  error = false,
  helperText,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ProjectWithRelationsAndRooms[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithRelationsAndRooms | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load selected project if value is provided
  useEffect(() => {
    const loadProject = async (projectId: string) => {
      try {
        const project = await projectApi.getProject(projectId);
        setSelectedProject(project);
      } catch (error) {
        console.error("Error loading project:", error);
      }
    };

    if (value && !selectedProject) {
      loadProject(value);
    }
  }, [value, selectedProject]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Search projects with debounce
  const searchProjects = async (query: string) => {
    // If clientId is provided, we can search even without query
    if (!query.trim() && !clientId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use listProjectsWithClientPropertyAndRooms for better data
      // But we need to filter by client_id manually since the API doesn't support it directly
      const result = await projectApi.listProjectsWithClientPropertyAndRooms({
        q: query || undefined,
        limit: clientId ? 50 : 10, // Get more if filtering by client
      });

      // Filter by clientId if provided
      const filteredItems = clientId
        ? result.items.filter((p) => p.client_id === clientId)
        : result.items;

      setProjects(filteredItems.slice(0, 10)); // Limit to 10 results
      setShowResults(true);
    } catch (error) {
      console.error("Error searching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      searchProjects(query);
    }, 300);
  };

  const handleProjectSelect = (project: ProjectWithRelationsAndRooms) => {
    setSelectedProject(project);
    setSearchQuery("");
    setProjects([]);
    setShowResults(false);
    onChange(project.id, project);
  };

  const handleClearSelection = () => {
    setSelectedProject(null);
    setSearchQuery("");
    setProjects([]);
    onChange("", {} as Project);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setProjects([]);
    setShowResults(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "on_hold":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {selectedProject ? (
        // Display selected project
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderColor: error ? "error.main" : "primary.main",
            backgroundColor: error ? "error.50" : "primary.50",
            borderWidth: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CheckCircleIcon
                  sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Selected Project
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
              >
                <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
                {selectedProject.name}
              </Typography>
              {selectedProject.client && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                >
                  <BusinessIcon sx={{ mr: 1, fontSize: 16 }} />
                  {selectedProject.client.display_name}
                </Typography>
              )}
              {selectedProject.start_date && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                >
                  <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                  {formatDate(selectedProject.start_date)}
                  {selectedProject.end_date &&
                    ` - ${formatDate(selectedProject.end_date)}`}
                </Typography>
              )}
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                <Chip
                  label={selectedProject.status || "unknown"}
                  size="small"
                  color={getStatusColor(selectedProject.status) as any}
                />
                {selectedProject.project_type && (
                  <Chip
                    label={selectedProject.project_type}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={handleClearSelection}
              disabled={disabled}
              sx={{ mt: -1, mr: -1 }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        // Search input
        <>
          <TextField
            fullWidth
            label={label}
            placeholder="Search by project name..."
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={disabled}
            error={error}
            helperText={helperText}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <CircularProgress size={20} />}
                  {searchQuery && !loading && (
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />

          {/* Search Results */}
          <Collapse in={showResults && projects.length > 0}>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                zIndex: 1300,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <List disablePadding>
                {projects.map((project) => (
                  <ListItem key={project.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleProjectSelect(project)}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "primary.50",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <WorkIcon
                              sx={{ fontSize: 18, color: "primary.main" }}
                            />
                            <Typography variant="body1" fontWeight={500}>
                              {project.name}
                            </Typography>
                            <Chip
                              label={project.status || "unknown"}
                              size="small"
                              color={getStatusColor(project.status) as any}
                              sx={{ ml: "auto" }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            {project.client && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                <BusinessIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                {project.client.display_name}
                              </Typography>
                            )}
                            {project.project_type && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                Type: {project.project_type}
                              </Typography>
                            )}
                            {project.start_date && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                <CalendarIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                {formatDate(project.start_date)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Collapse>

          {/* No Results */}
          {showResults && searchQuery && !loading && projects.length === 0 && (
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                p: 2,
                zIndex: 1300,
              }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                No projects found for "{searchQuery}"
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default ProjectSearchSelector;
