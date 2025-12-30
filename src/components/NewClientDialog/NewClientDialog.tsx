"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ClientForm from "../ProInteriorEstimate/ClientForm";
import {
  ClientFormData,
  ClientInitData,
} from "../ProInteriorEstimate/ClientForm/ClientForm.model";

interface Props {
  isOpen: boolean;
  client?: ClientInitData;
  isEditMode?: boolean;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onClose: () => void;
}

const NewClientDialog = ({
  isOpen,
  client,
  onSubmit,
  onClose,
  isEditMode = false,
}: Props) => {
  const defaultValues: ClientInitData = {
    id: client?.id || "",
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    contact: client?.contact || "",
    address: client?.address || "",
    address2: client?.address2 || "",
    city: client?.city || "",
    state: client?.state || "",
    zipCode: client?.zipCode || "",
    measurementUnit: client?.measurementUnit || "ft",
    floorPlan: client?.floorPlan || 1,
  };
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? "Edit Client" : "New Client"}</DialogTitle>
      <DialogContent>
        <ClientForm
          isLoading={false}
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
        >
          {isEditMode ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewClientDialog;
