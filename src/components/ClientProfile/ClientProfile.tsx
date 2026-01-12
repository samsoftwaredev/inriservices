"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export type ClientProfileType = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressId: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfProjects: number;
  totalRevenue: number;
  lastProjectDate: string;
  status: string;
  notes?: string;
};

interface ClientProfileProps {
  client: ClientProfileType;
}

const ClientProfile = ({ client }: ClientProfileProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}
    >
      <Box sx={{ flex: 1 }}>
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
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Project Statistics
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Number of Projects
          </Typography>
          <Typography variant="body1">{client.numberOfProjects}</Typography>
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
      </Box>
      {client.notes && (
        <Box sx={{ width: "100%", mt: { xs: 2, md: 0 } }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Notes
          </Typography>
          <Typography variant="body1">{client.notes}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ClientProfile;
