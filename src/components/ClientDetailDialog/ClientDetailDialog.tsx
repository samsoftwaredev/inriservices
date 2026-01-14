"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ClientProfile } from "../ClientProfile";
import { ClientFullData, ClientStatus } from "@/types";

interface Props {
  viewDetailsOpen: boolean;
  handleCloseDetails: () => void;
  handleOpenEditForm: () => void;
  client: ClientFullData;
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
          {client && getInitials(client.displayName)}
        </Avatar>
        <Box>
          <Typography variant="h6">{client?.displayName}</Typography>
          <Chip
            label={client?.status}
            size="small"
            color={getStatusColor(client?.status)}
            variant="filled"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <ClientProfile client={client} />
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
