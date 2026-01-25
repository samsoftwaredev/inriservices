"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import CustomerHeader from "../CustomerHeader";
import { SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context";
import { clientApi, propertyApi } from "@/services";
import { toast } from "react-toastify";
import NewClientDialog from "../NewClientDialog";
import SearchClient from "../SearchClient";
import ClientDetailDialog from "../ClientDetailDialog";
import { useClient } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import { ClientStatus } from "@/types";

interface ClientFormData {
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
}

const ClientsPage = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const { currentClient, handleSelectClient, allClients } = useClient();
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const handleNewClient = () => {
    router.push("/clients/new");
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    handleCloseEditForm();
  };

  const handleOpenEditForm = () => {
    setIsEditingClient(true);
    handleSelectClient(currentClient?.id!);
  };

  const handleCloseEditForm = () => {
    setIsEditingClient(false);
  };

  const onSaveEdits: SubmitHandler<ClientFormData> = async (data) => {
    try {
      if (!currentClient) return;
      setIsUpdating(true);
      // Update client info
      await clientApi.updateClient(currentClient.id, {
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
      });
      // Update property info - assuming one property per client for simplicity
      const property = await propertyApi.getProperty(currentClient.id);
      await propertyApi.updateProperty(property.id, {
        address_line1: data.address,
        address_line2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
      });
      setIsEditingClient(false);
      toast.success("Client updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewClientProfile = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  return (
    <Box sx={{ py: 3 }}>
      <CustomerHeader
        headerName="Clients Management"
        headerDescription="Manage your clients and track their project history"
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={handleNewClient}
        >
          Add Client
        </Button>
      </CustomerHeader>

      <SearchClient onClientSelected={handleViewClientProfile} />

      {/* Edit Client Dialog */}
      {currentClient && (
        <NewClientDialog
          isOpen={isEditingClient}
          onClose={handleCloseEditForm}
          isEditMode={true}
          isLoading={isUpdating}
          onSubmit={onSaveEdits}
          client={currentClient}
        />
      )}

      {/* View Client Data */}
      {currentClient && (
        <ClientDetailDialog
          viewDetailsOpen={viewDetailsOpen}
          handleCloseDetails={handleCloseDetails}
          handleOpenEditForm={handleOpenEditForm}
          client={currentClient}
        />
      )}
    </Box>
  );
};

export default ClientsPage;
