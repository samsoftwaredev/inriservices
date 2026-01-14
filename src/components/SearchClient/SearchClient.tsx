"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { clientApi, propertyApi } from "@/services";
import ClientCard from "../ClientCard";
import { useClient } from "@/context/ClientContext";
import ClientDetailDialog from "../ClientDetailDialog";
import NewClientDialog from "../NewClientDialog";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";
import { ClientFormData } from "./SearchClient.model";
import { ClientFullData } from "@/types";

interface Props {
  onViewClientProfile: (clientId: string) => void;
}

const SearchClient = ({ onViewClientProfile }: Props) => {
  const {
    currentClient,
    handleSelectClient,
    allClients: clients,
  } = useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    clientId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.properties[0].city
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.properties[0].state
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const onClientClick = (client: ClientFullData) => {
    onViewClientProfile(client.id);
    handleSelectClient(client.id);
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    handleCloseEditForm();
  };

  const handleCloseEditForm = () => {
    setIsEditingClient(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditForm = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setIsEditingClient(() => {
        onClientClick(client);
        return true;
      });
    }
  };

  const handleViewDetails = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setViewDetailsOpen(() => {
        onClientClick(client);
        return true;
      });
    }
    handleMenuClose();
  };

  const onSaveEdits: SubmitHandler<ClientFormData> = async (data) => {
    try {
      if (!currentClient) return;
      setIsUpdating(true);
      // Update client info
      await clientApi.updateClient(currentClient.id, {
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
      });
      // Update property info - assuming one property per client for simplicity
      const property = await propertyApi.getProperty(currentClient.id);
      await propertyApi.updateProperty(property.id, {
        address_line1: data.address,
        address_line2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
      });

      setIsEditingClient(false);
      toast.success("Client updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
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
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
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
            direction: "row",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? (
              <>
                Found {filteredClients.length} client
                {filteredClients.length !== 1 ? "s" : ""} matching "{searchTerm}
                "
              </>
            ) : (
              <>Showing {clients.length} total clients</>
            )}
          </Typography>
        </Box>
      </Box>

      {/* Clients Grid */}
      <Grid container spacing={3}>
        {filteredClients.length === 0 && (
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
            </Box>
          </Grid>
        )}
      </Grid>

      <Box sx={{ height: 1, bgcolor: "divider" }} />

      <Grid container spacing={2} sx={{ pb: 3 }}>
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            anchorEl={anchorEl}
            handleMenuClick={handleMenuClick}
            onClick={onClientClick}
            handleMenuClose={handleMenuClose}
            handleViewDetails={handleViewDetails}
            handleOpenEditForm={handleOpenEditForm}
          />
        ))}
      </Grid>

      {/* Edit Client Dialog */}
      {currentClient && (
        <NewClientDialog
          isOpen={isEditingClient}
          onClose={handleCloseEditForm}
          isEditMode={true}
          isLoading={isUpdating}
          onSubmit={onSaveEdits}
          client={currentClient}
        />
      )}

      {/* View Client Data */}
      {currentClient && (
        <ClientDetailDialog
          viewDetailsOpen={viewDetailsOpen}
          handleCloseDetails={handleCloseDetails}
          handleOpenEditForm={handleOpenEditForm}
          client={currentClient}
        />
      )}
    </>
  );
};

export default SearchClient;
