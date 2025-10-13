"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  AddCircleOutline,
  Search as SearchIcon,
  Clear as ClearIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import CustomerHeader from "../CustomerHeader";

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfProjects: number;
  totalRevenue: number;
  lastProjectDate: string;
  status: "active" | "inactive" | "potential";
  notes?: string;
}

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Sample clients data
  const clients: Client[] = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john.doe@email.com",
      phone: "(123) 456-7890",
      address: "123 Main St",
      city: "Garland",
      state: "TX",
      zipCode: "75040",
      numberOfProjects: 3,
      totalRevenue: 8500,
      lastProjectDate: "2024-10-01",
      status: "active",
      notes: "Prefers eco-friendly paint options",
    },
    {
      id: "2",
      fullName: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "(555) 123-4567",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "TX",
      zipCode: "67890",
      numberOfProjects: 2,
      totalRevenue: 5800,
      lastProjectDate: "2024-09-15",
      status: "active",
      notes: "Interested in premium finishes",
    },
    {
      id: "3",
      fullName: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "(333) 555-7777",
      address: "789 Pine Street",
      city: "Riverside",
      state: "FL",
      zipCode: "54321",
      numberOfProjects: 1,
      totalRevenue: 2900,
      lastProjectDate: "2024-08-20",
      status: "inactive",
      notes: "Last project: exterior painting",
    },
    {
      id: "4",
      fullName: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "(444) 888-9999",
      address: "321 Elm Drive",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      numberOfProjects: 4,
      totalRevenue: 12300,
      lastProjectDate: "2024-10-10",
      status: "active",
      notes: "VIP client - interior specialist",
    },
    {
      id: "5",
      fullName: "David Martinez",
      email: "david.martinez@email.com",
      phone: "(666) 777-8888",
      address: "654 Cedar Lane",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      numberOfProjects: 0,
      totalRevenue: 0,
      lastProjectDate: "",
      status: "potential",
      notes: "Potential client - follow up needed",
    },
  ];

  const handleAddClient = () => {
    console.log("Add Client button clicked");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    clientId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClientId(null);
  };

  const handleViewDetails = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setSelectedClient(client);
      setViewDetailsOpen(true);
    }
    handleMenuClose();
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    setSelectedClient(null);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "potential":
        return "warning";
      default:
        return "default";
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ py: 3 }}>
      <CustomerHeader
        headerName="Clients Management"
        headerDescription="Manage your clients and track their project history"
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={handleAddClient}
        >
          Add Client
        </Button>
      </CustomerHeader>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search clients by name, email, phone, or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Search Results Info */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {searchTerm ? (
            <>
              Found {filteredClients.length} client
              {filteredClients.length !== 1 ? "s" : ""} matching "{searchTerm}"
            </>
          ) : (
            <>Showing {clients.length} total clients</>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Revenue: $
          {clients
            .reduce((sum, client) => sum + client.totalRevenue, 0)
            .toLocaleString()}
        </Typography>
      </Box>

      {/* Clients Grid */}
      <Grid container spacing={3}>
        {filteredClients.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PersonIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? "No clients found" : "No clients yet"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? "Try different keywords or clear the search to see all clients."
                  : "Start by adding your first client to track projects and revenue."}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={handleAddClient}
                >
                  Add Your First Client
                </Button>
              )}
            </Box>
          </Grid>
        ) : (
          filteredClients.map((client) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={client.id}>
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  {/* Header with Avatar and Menu */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(client.fullName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {client.fullName}
                      </Typography>
                      <Chip
                        label={client.status}
                        size="small"
                        color={getStatusColor(client.status) as any}
                        variant="filled"
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, client.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  {/* Contact Information */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon
                        sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {client.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon
                        sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {client.phone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Address */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {client.address}, {client.city}, {client.state}{" "}
                    {client.zipCode}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Statistics */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                          }}
                        >
                          <WorkIcon
                            sx={{
                              fontSize: 16,
                              color: "primary.main",
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="primary.main"
                            fontWeight="bold"
                          >
                            {client.numberOfProjects}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Projects
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            color="success.main"
                            fontWeight="bold"
                          >
                            ${client.totalRevenue.toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Revenue
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Last Project Date */}
                  {client.lastProjectDate && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography variant="caption" color="text.secondary">
                        Last Project:{" "}
                        {new Date(client.lastProjectDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Client
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HistoryIcon sx={{ mr: 1, fontSize: 18 }} />
          Project History
        </MenuItem>
      </Menu>

      {/* Client Details Dialog */}
      <Dialog
        open={viewDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              mr: 2,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {selectedClient && getInitials(selectedClient.fullName)}
          </Avatar>
          <Box>
            <Typography variant="h6">{selectedClient?.fullName}</Typography>
            <Chip
              label={selectedClient?.status}
              size="small"
              color={getStatusColor(selectedClient?.status || "") as any}
              variant="filled"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Contact Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedClient.email}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedClient.phone}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {selectedClient.address}
                    <br />
                    {selectedClient.city}, {selectedClient.state}{" "}
                    {selectedClient.zipCode}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Project Statistics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Number of Projects
                  </Typography>
                  <Typography variant="body1">
                    {selectedClient.numberOfProjects}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="body1">
                    ${selectedClient.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                {selectedClient.lastProjectDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Project
                    </Typography>
                    <Typography variant="body1">
                      {new Date(
                        selectedClient.lastProjectDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Grid>
              {selectedClient.notes && (
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedClient.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button variant="contained" color="primary">
            Edit Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;
