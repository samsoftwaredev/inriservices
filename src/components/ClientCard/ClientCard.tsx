"use client";

import React from "react";
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
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { ClientFormData } from "../SearchClient/SearchClient.model";
import { useClient } from "@/context/ClientContext";
import { ClientFullData, ClientStatus } from "@/types";

interface Props {
  client: ClientFullData;
  onClick?: (client: ClientFullData) => void;
  handleMenuClose: () => void;
  handleViewDetails: () => void;
  handleOpenEditForm: () => void;
  anchorEl: HTMLElement | null;
  handleMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    clientId: string,
  ) => void;
}

const ClientCard = ({
  client,
  onClick,
  anchorEl,
  handleMenuClose,
  handleViewDetails,
  handleOpenEditForm,
  handleMenuClick,
}: Props) => {
  const { currentClient } = useClient();
  const isSelected = currentClient?.id === client.id;

  const onClientSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(client);
    }
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
    <>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }} mb={2} key={client.id}>
        {isSelected && (
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 1,
              py: 0.5,
              fontSize: 12,
              fontWeight: "bold",
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          >
            Selected
          </Box>
        )}
        <Card
          sx={{
            height: "100%",
            position: "relative",
            borderWidth: isSelected ? 2 : 1,
            borderStyle: "solid",
            borderColor: isSelected ? "primary.main" : "divider",
            boxShadow: isSelected ? 4 : "0px 1px 3px rgba(0,0,0,0.2)",
            transition: "0.3s",
            cursor: "pointer",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
              transition: "all 0.3s ease",
            },
          }}
        >
          <CardContent
            sx={{
              pb: 2,
            }}
          >
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
                {getInitials(client.displayName)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {client.displayName}
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
              {client.properties[0].addressLine1}, {client.properties[0].city},{" "}
              {client.properties[0].state} {client.properties[0].zip}
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
                      {/* {client.numberOfProjects} */}0
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
                      {/* ${client.totalRevenue.toLocaleString()} */}0
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Revenue
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Last Project Date */}
            {client.properties[0].projects.length > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Last Project:{" "}
                  {new Date(
                    client.properties[0].projects[0].createdAt,
                  ).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 3 }}
              onClick={onClientSelect}
            >
              Select Client
            </Button>
          </CardContent>
        </Card>
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
      </Menu>
    </>
  );
};

export default ClientCard;
