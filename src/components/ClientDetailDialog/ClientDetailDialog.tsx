"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ClientStatus } from "@/services";

interface Props {
  viewDetailsOpen: boolean;
  handleCloseDetails: () => void;
  handleOpenEditForm: () => void;
  client: {
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
  };
}
const ClientDetailDialog = ({
  viewDetailsOpen,
  handleCloseDetails,
  handleOpenEditForm,
  client,
}: Props) => {
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

  return (
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
          {client && getInitials(client.fullName)}
        </Avatar>
        <Box>
          <Typography variant="h6">{client?.fullName}</Typography>
          <Chip
            label={client?.status}
            size="small"
            color={getStatusColor(client?.status)}
            variant="filled"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {client && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{client.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{client.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {client.address} {client.address2}
                  <br />
                  {client.city}, {client.state} {client.zipCode}
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
                  {client.numberOfProjects}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="body1">
                  ${client.totalRevenue.toLocaleString()}
                </Typography>
              </Box>
              {client.lastProjectDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Project
                  </Typography>
                  <Typography variant="body1">
                    {new Date(client.lastProjectDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            {client.notes && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Notes
                </Typography>
                <Typography variant="body1">{client.notes}</Typography>
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
  );
};

export default ClientDetailDialog;
