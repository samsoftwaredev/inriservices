"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { clientApi } from "@/services/clientApi";
import { Client } from "@/types";
import { formatPhoneNumber } from "@/tools";

interface ClientSearchSelectorProps {
  value?: string; // Selected client ID
  onChange: (clientId: string, client: Client) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const ClientSearchSelector: React.FC<ClientSearchSelectorProps> = ({
  value,
  onChange,
  label = "Search Client",
  error = false,
  helperText,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load selected client if value is provided
  useEffect(() => {
    const loadClient = async (clientId: string) => {
      try {
        const client = await clientApi.getClient(clientId);
        setSelectedClient(client as Client);
      } catch (error) {
        console.error("Error loading client:", error);
      }
    };

    if (value && !selectedClient) {
      loadClient(value);
    }
  }, [value, selectedClient]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Search clients with debounce
  const searchClients = async (query: string) => {
    if (!query.trim()) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await clientApi.listClients({
        q: query,
        limit: 10,
      });
      setClients(result.items);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching clients:", error);
      setClients([]);
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
      searchClients(query);
    }, 300);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchQuery("");
    setClients([]);
    setShowResults(false);
    onChange(client.id, client);
  };

  const handleClearSelection = () => {
    setSelectedClient(null);
    setSearchQuery("");
    setClients([]);
    onChange("", {} as Client);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setClients([]);
    setShowResults(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {selectedClient ? (
        // Display selected client
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
                  Selected Client
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
              >
                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                {selectedClient.display_name}
              </Typography>
              {selectedClient.primary_email && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                >
                  <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                  {selectedClient.primary_email}
                </Typography>
              )}
              {selectedClient.primary_phone && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                  {formatPhoneNumber(selectedClient.primary_phone)}
                </Typography>
              )}
              <Chip
                label={selectedClient.status || "active"}
                size="small"
                color={
                  selectedClient.status === "active" ? "success" : "default"
                }
                sx={{ mt: 1 }}
              />
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
            placeholder="Search by name, email, or phone..."
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
          <Collapse in={showResults && clients.length > 0}>
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
                {clients.map((client) => (
                  <ListItem key={client.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleClientSelect(client)}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "primary.50",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PersonIcon
                              sx={{
                                mr: 1,
                                fontSize: 18,
                                color: "primary.main",
                              }}
                            />
                            <Typography variant="body1" fontWeight={500}>
                              {client.display_name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            {client.primary_email && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                <EmailIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                {client.primary_email}
                              </Typography>
                            )}
                            {client.primary_phone && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                <PhoneIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                {client.primary_phone}
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
          {showResults && searchQuery && !loading && clients.length === 0 && (
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
                No clients found for "{searchQuery}"
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default ClientSearchSelector;
