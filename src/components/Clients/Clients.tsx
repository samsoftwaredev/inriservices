"use client";

import React, { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
import {
  AddCircleOutline,
  Search as SearchIcon,
  Clear as ClearIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import CustomerHeader from "../CustomerHeader";
import ClientForm from "../ProInteriorEstimate/ClientForm";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { ClientFormData } from "../ProInteriorEstimate/ClientForm/ClientForm.model";
import { useAuth } from "@/context";
import { clientApi, ClientStatus, propertyApi } from "@/services";
import { toast } from "react-toastify";

interface ClientInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfProjects: number;
  totalRevenue: number;
  lastProjectDate: string;
  status: ClientStatus;
  notes?: string;
}

const ClientsPage = () => {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingNewClient, setIsCreatingNewClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [createNewClient, setCreateNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [clients, setClients] = useState<ClientInfo[]>([]);

  const handleOpenClientForm = () => {
    setCreateNewClient(true);
  };

  const handleCloseClientForm = () => {
    setCreateNewClient(false);
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
  };

  const handleViewDetails = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setViewDetailsOpen(() => {
        setSelectedClient(client);
        return true;
      });
    }
    handleMenuClose();
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    handleMenuClose();
    handleCloseEditForm();
    setSelectedClient(null);
  };

  const handleOpenEditForm = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setSelectedClient(() => {
        handleMenuClose();
        setIsEditingClient(true);
        return client;
      });
    }
  };

  const handleCloseEditForm = () => {
    handleMenuClose();
    setIsEditingClient(false);
  };

  const getClients = async () => {
    const clientRes = await clientApi.listClientsWithAddresses();
    const clientList: ClientInfo[] = clientRes.items.map((client) => {
      const property =
        client.properties.length > 0 ? client.properties[0] : null;
      return {
        id: client.id,
        fullName: client.display_name,
        email: client.primary_email || "",
        phone: client.primary_phone || "",
        address: property?.address_line1 || "",
        address2: property?.address_line2 || "",
        city: property?.city || "",
        state: property?.state || "",
        zipCode: property?.zip || "",
        numberOfProjects: 0,
        totalRevenue: 0,
        lastProjectDate: "",
        status: client.status,
        notes: client.notes || "",
      };
    });
    setClients(clientList);
  };

  useEffect(() => {
    getClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status?: ClientStatus) => {
    switch (status) {
      case "lead":
        return "success";
      case "active":
        return "default";
      case "inactive":
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

  const onCreateNewClient: SubmitHandler<ClientFormData> = async (data) => {
    try {
      setIsCreatingNewClient(true);
      const newClient = await clientApi.createClient({
        display_name: data.customerName,
        primary_email: data.customerEmail,
        primary_phone: data.customerPhone,
        status: "lead",
        notes: "",
        client_type: "person",
        company_id: userData?.company_id || "",
      });
      debugger;
      await propertyApi.createProperty({
        client_id: newClient.id, // Associate with the created client if needed
        address_line1: data.address,
        address_line2: data.address2 || "",
        name: `${data.customerName}'s Property`,
        property_type: "residential",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        country: "USA",
        company_id: userData?.company_id || "",
      });
      getClients();
      handleCloseClientForm();
      toast.success("Client created successfully");
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setIsCreatingNewClient(false);
    }
  };

  const onError: SubmitErrorHandler<ClientFormData> = (errors) => {
    console.log(errors);
  };

  const onSaveEdits: SubmitHandler<ClientFormData> = async (data) => {
    try {
      if (!selectedClient) return;
      // Update client info
      await clientApi.updateClient(selectedClient.id, {
        display_name: data.customerName,
        primary_email: data.customerEmail,
        primary_phone: data.customerPhone,
      });
      // Update property info - assuming one property per client for simplicity
      const property = await propertyApi.getProperty(selectedClient.id);
      await propertyApi.updateProperty(property.id, {
        address_line1: data.address,
        address_line2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
      });
      getClients();
      setIsEditingClient(false);
      toast.success("Client updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    }
  };

  const onErrorEditing: SubmitErrorHandler<ClientFormData> = (errors) => {
    console.log(errors);
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
          onClick={handleOpenClientForm}
        >
          Add Client
        </Button>
      </CustomerHeader>

      {createNewClient && (
        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
            <ClientForm
              isLoading={isCreatingNewClient}
              onSubmit={onCreateNewClient}
              onError={onError}
            />
            <Box
              sx={{ mt: 4 }}
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <Button onClick={handleCloseClientForm}>Close</Button>
              <Button
                disabled={isCreatingNewClient}
                type="submit"
                form="client-form"
                variant="contained"
                loading={isCreatingNewClient}
              >
                Create New Client
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

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
                  onClick={handleOpenClientForm}
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
        <MenuItem onClick={handleOpenEditForm}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Client
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HistoryIcon sx={{ mr: 1, fontSize: 18 }} />
          Project History
        </MenuItem>
      </Menu>

      {/* Edit Client Dialog */}
      {selectedClient && (
        <Dialog
          open={isEditingClient}
          onClose={handleCloseEditForm}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Client</DialogTitle>
          <DialogContent>
            <ClientForm
              isLoading={false}
              onSubmit={onSaveEdits}
              onError={onErrorEditing}
              defaultValues={{
                id: selectedClient.id,
                name: selectedClient.fullName,
                email: selectedClient.email,
                phone: selectedClient.phone,
                contact: "",
                address: selectedClient.address,
                address2: selectedClient.address2,
                city: selectedClient.city,
                state: selectedClient.state,
                zipCode: selectedClient.zipCode,
                measurementUnit: "ft",
                floorPlan: 1,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditingClient(false)}>Cancel</Button>
            <Button
              type="submit"
              form="client-form"
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

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
              color={getStatusColor(selectedClient?.status)}
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
          <Button
            onClick={handleOpenEditForm}
            variant="contained"
            color="primary"
          >
            Edit Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;
