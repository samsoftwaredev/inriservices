"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import ClientForm from "../ProInteriorEstimate/ClientForm";
import { ClientFormData } from "../SearchClient/SearchClient.model";
import { Close as CloseIcon } from "@mui/icons-material";

interface Props {
  isOpen: boolean;
  client?: ClientFormData;
  isEditMode?: boolean;
  onSubmit: (data: ClientFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const NewClientDialog = ({
  isOpen,
  client,
  onSubmit,
  onClose,
  isEditMode = false,
  isLoading = false,
}: Props) => {
  const defaultValues: ClientFormData = {
    id: client?.id || "",
    fullName: client?.fullName || "",
    email: client?.email || "",
    phone: client?.phone || "",
    contact: client?.contact || "",
    addressId: client?.addressId || "",
    address: client?.address || "",
    address2: client?.address2 || "",
    city: client?.city || "",
    state: client?.state || "",
    zipCode: client?.zipCode || "",
    measurementUnit: client?.measurementUnit || "ft",
    floorPlan: client?.floorPlan || 1,
    numberOfProjects: client?.numberOfProjects || 0,
    totalRevenue: client?.totalRevenue || 0,
    lastProjectDate: client?.lastProjectDate || "",
    status: client?.status || "active",
    notes: client?.notes || "",
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditMode ? "Edit Client" : "New Client"}
        {/* closeButton */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ClientForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          form="client-form"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isEditMode ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewClientDialog;
