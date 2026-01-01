"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { ClientStatus } from "@/services";
import { ClientInfo } from "../SearchClient/SearchClient.model";

interface Props {
  client: ClientInfo;
  onClick?: (client: ClientInfo) => void;
}

const ClientCard = ({ client, onClick }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    clientId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

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
        onClick={() => onClick && onClick(client)}
      >
        <CardContent sx={{ pb: 2 }}>
          {/* Header with Avatar and Menu */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {client.address}, {client.city}, {client.state} {client.zipCode}
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
  );
};

export default ClientCard;
