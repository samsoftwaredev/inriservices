"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import CustomerHeader from "../CustomerHeader";
import ClientForm from "../ProInteriorEstimate/ClientForm";
import { SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context";
import { clientApi, ClientStatus, propertyApi } from "@/services";
import { toast } from "react-toastify";
import NewClientDialog from "../NewClientDialog";
import SearchClient from "../SearchClient";
import ClientDetailDialog from "../ClientDetailDialog";
import { useClient } from "@/context/ClientContext";
import { useRouter } from "next/navigation";

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
  const { currentClient, setCurrentClient } = useClient();
  const [isCreatingNewClient, setIsCreatingNewClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [createNewClient, setCreateNewClient] = useState(false);

  const handleOpenClientForm = () => {
    setCreateNewClient(true);
  };

  const handleCloseClientForm = () => {
    setCreateNewClient(false);
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    handleCloseEditForm();
  };

  const handleOpenEditForm = () => {
    setCurrentClient(() => {
      setIsEditingClient(true);
      return {
        id: currentClient!.id,
        fullName: currentClient!.fullName,
        email: currentClient!.email,
        phone: currentClient!.phone,
        status: currentClient!.status,
        contact: "",
        buildings: [
          {
            id: currentClient?.buildings![0].id || "",
            address: currentClient?.buildings![0].address || "",
            address2: currentClient?.buildings![0].address2 || "",
            city: currentClient?.buildings![0].city || "",
            state: currentClient?.buildings![0].state || "",
            zipCode: currentClient?.buildings![0].zipCode || "",
            measurementUnit: "ft",
            floorPlan: 0,
            rooms: [],
          },
        ],
      };
    });
  };

  const handleCloseEditForm = () => {
    setIsEditingClient(false);
  };

  const getClients = async () => {
    const clientRes = await clientApi.listClientsWithAddresses();
    const clientList: ClientFormData[] = clientRes.items.map((client) => {
      const property =
        client.properties.length > 0 ? client.properties[0] : null;
      return {
        id: client.id,
        fullName: client.display_name,
        email: client.primary_email || "",
        phone: client.primary_phone || "",
        address: property?.address_line1 || "",
        address2: property?.address_line2 || "",
        city: property?.city || "",
        state: property?.state || "",
        zipCode: property?.zip || "",
        numberOfProjects: 0,
        totalRevenue: 0,
        lastProjectDate: "",
        status: client.status,
        notes: client.notes || "",
      };
    });
  };

  useEffect(() => {
    getClients();
  }, []);

  const onCreateNewClient: SubmitHandler<ClientFormData> = async (data) => {
    try {
      setIsCreatingNewClient(true);
      const newClient = await clientApi.createClient({
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
        status: "lead",
        notes: "",
        client_type: "person",
        company_id: userData?.companyId || "",
      });
      await propertyApi.createProperty({
        client_id: newClient.id, // Associate with the created client if needed
        address_line1: data.address,
        address_line2: data.address2 || "",
        name: `${data.fullName}'s Property`,
        property_type: "residential",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        country: "USA",
        company_id: userData?.companyId || "",
      });
      getClients();
      handleCloseClientForm();
      toast.success("Client created successfully");
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setIsCreatingNewClient(false);
    }
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
      getClients();
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
          onClick={handleOpenClientForm}
        >
          Add Client
        </Button>
      </CustomerHeader>

      {createNewClient && (
        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
            <ClientForm
              isLoading={isCreatingNewClient}
              onSubmit={onCreateNewClient}
            />
            <Box
              sx={{ mt: 4 }}
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <Button onClick={handleCloseClientForm}>Close</Button>
              <Button
                disabled={isCreatingNewClient}
                type="submit"
                form="client-form"
                variant="contained"
                loading={isCreatingNewClient}
              >
                Create New Client
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <SearchClient onViewClientProfile={handleViewClientProfile} />

      {/* Edit Client Dialog */}
      {currentClient && (
        <NewClientDialog
          isOpen={isEditingClient}
          onClose={handleCloseEditForm}
          isEditMode={true}
          isLoading={isUpdating}
          onSubmit={onSaveEdits}
          client={{
            id: currentClient.id,
            fullName: currentClient.fullName,
            email: currentClient.email,
            phone: currentClient.phone,
            contact: "",
            addressId: currentClient.buildings[0].id,
            address: currentClient.buildings[0].address,
            address2: currentClient.buildings[0].address2,
            city: currentClient.buildings[0].city,
            state: currentClient.buildings[0].state,
            zipCode: currentClient.buildings[0].zipCode,
            measurementUnit: "ft",
            floorPlan: 1,
            numberOfProjects: 0,
            totalRevenue: 0,
            lastProjectDate: "",
            status: currentClient.status,
            notes: "",
          }}
        />
      )}

      {/* View Client Data */}
      {currentClient && (
        <ClientDetailDialog
          viewDetailsOpen={viewDetailsOpen}
          handleCloseDetails={handleCloseDetails}
          handleOpenEditForm={handleOpenEditForm}
          client={{
            id: currentClient.id,
            fullName: currentClient.fullName,
            email: currentClient.email,
            phone: currentClient.phone,
            addressId: currentClient.buildings[0].id,
            address: currentClient.buildings[0].address,
            address2: currentClient.buildings[0].address2,
            city: currentClient.buildings[0].city,
            state: currentClient.buildings[0].state,
            zipCode: currentClient.buildings[0].zipCode,
            numberOfProjects: 0,
            totalRevenue: 0,
            lastProjectDate: "",
            status: currentClient.status,
            notes: "",
          }}
        />
      )}
    </Box>
  );
};

export default ClientsPage;
