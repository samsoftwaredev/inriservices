"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
  TablePagination,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ClientTransformed, PropertyTransformed } from "@/types";
import { format } from "date-fns";

interface ClientWithProperty extends ClientTransformed {
  properties: PropertyTransformed[];
}

interface Props {
  clients: ClientWithProperty[];
  onViewClient: (clientId: string) => void;
  onEditClient: (clientId: string) => void;
}

const getStatusColor = (
  status: string,
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (status) {
    case "active":
      return "success";
    case "lead":
      return "info";
    case "inactive":
      return "default";
    case "archived":
      return "error";
    default:
      return "default";
  }
};

const ClientsTable = ({ clients, onViewClient, onEditClient }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter((client) => {
      const name = client.displayName?.toLowerCase() || "";
      const email = client.email?.toLowerCase() || "";
      const phone = client.phone?.toLowerCase() || "";
      const address = client.properties[0]?.addressLine1?.toLowerCase() || "";
      const city = client.properties[0]?.city?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        city.includes(query)
      );
    });
  }, [clients, searchQuery]);

  // Paginate filtered clients
  const paginatedClients = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search clients by name, email, phone, address, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                  aria-label="clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2, px: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedClients.length} of {filteredClients.length} clients
          {searchQuery && ` (filtered from ${clients.length} total)`}
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="clients table">
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery
                      ? "No clients found matching your search"
                      : "No clients available"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client) => (
                <TableRow
                  key={client.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() => onViewClient(client.id)}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getInitials(client.displayName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {client.displayName}
                        </Typography>
                        {client.notes && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {client.notes}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{client.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{client.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    {client.properties && client.properties.length > 0 ? (
                      <Box>
                        <Typography variant="body2">
                          {client.properties[0].addressLine1}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {client.properties[0].city},{" "}
                          {client.properties[0].state}{" "}
                          {client.properties[0].zip}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No address
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      size="small"
                      color={getStatusColor(client.status)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {client.clientType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(client.createdAt), "MMM dd, yyyy")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-end",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewClient(client.id)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Client">
                        <IconButton
                          size="small"
                          onClick={() => onEditClient(client.id)}
                          color="secondary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ClientsTable;
