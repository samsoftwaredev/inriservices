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
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { clientApi } from "@/services";
import { ClientInfo } from "./SearchClient.model";
import ClientCard from "../ClientCard";

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<ClientInfo[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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

  const onClientClick = (client: ClientInfo) => {
    // Handle client click action
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
        <Typography variant="caption" color="text.secondary">
          Total Revenue: $
          {filteredClients
            .reduce((sum, client) => sum + client.totalRevenue, 0)
            .toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ height: 1, bgcolor: "divider" }} />

      <Grid container spacing={2} sx={{ py: 3 }}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} onClick={onClientClick} />
        ))}
      </Grid>
    </>
  );
};

export default ClientsPage;
