"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import ClientForm from "@/components/ProInteriorEstimate/ClientForm";
import { SubmitHandler } from "react-hook-form";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";
import { clientApi, propertyApi } from "@/services";
import { useAuth } from "@/context";
import { ClientWithRelations } from "@/services/clientApi";
import { toast } from "react-toastify";

interface EditClientPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

const EditClientPage = ({ params }: EditClientPageProps) => {
  const { clientId } = use(params);
  const router = useRouter();
  const { userData } = useAuth();
  const [client, setClient] = useState<ClientWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      try {
        setIsLoadingData(true);
        const clientData = await clientApi.getClient(clientId);
        setClient(clientData);
      } catch (err) {
        console.error("Error loading client:", err);
        setError("Failed to load client data");
        toast.error("Failed to load client data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (clientId) {
      loadClient();
    }
  }, [clientId]);

  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    if (!client || !userData?.companyId) {
      setError("Client or company information is missing");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Update the client
      await clientApi.updateClient(client.id, {
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
        status: data.status,
        notes: data.notes || "",
      });

      // Update the property (assuming the first property)
      if (client.properties && client.properties.length > 0) {
        const property = client.properties[0];
        await propertyApi.updateProperty(property.id, {
          address_line1: data.address,
          address_line2: data.address2 || "",
          name: `${data.fullName}'s Property`,
          city: data.city,
          state: data.state,
          zip: data.zipCode,
        });
      } else {
        // Create a new property if none exists
        await propertyApi.createProperty({
          client_id: client.id,
          address_line1: data.address,
          address_line2: data.address2 || "",
          name: `${data.fullName}'s Property`,
          property_type: "residential",
          city: data.city,
          state: data.state,
          zip: data.zipCode,
          country: "USA",
          company_id: userData.companyId,
        });
      }

      toast.success("Client updated successfully!");
      router.push(`/clients/${client.id}`);
    } catch (err) {
      console.error("Error updating client:", err);
      setError(
        "Failed to update client. Please check your data and try again."
      );
      toast.error("Failed to update client");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error && !client) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/clients")}
              variant="outlined"
            >
              Back to Clients
            </Button>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const defaultValues: ClientFormData = {
    id: client?.id || "",
    fullName: client?.display_name || "",
    email: client?.primary_email || "",
    phone: client?.primary_phone || "",
    addressId: client?.properties?.[0]?.id || "",
    address: client?.properties?.[0]?.address_line1 || "",
    address2: client?.properties?.[0]?.address_line2 || "",
    contact: "",
    city: client?.properties?.[0]?.city || "",
    state: client?.properties?.[0]?.state || "",
    zipCode: client?.properties?.[0]?.zip || "",
    numberOfProjects: client?.properties?.[0]?.projects?.length || 0,
    floorPlan: 1,
    measurementUnit: "ft",
    totalRevenue: 0,
    lastProjectDate: "",
    status: client?.status || "active",
    notes: client?.notes || "",
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              variant="outlined"
            >
              Back
            </Button>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <EditIcon sx={{ mr: 2, fontSize: 40 }} />
                Edit Client
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Update client information and property details
              </Typography>
            </Box>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Card>
            <CardContent sx={{ p: 4 }}>
              <ClientForm
                isLoading={isLoading}
                onSubmit={onSubmit}
                defaultValues={defaultValues}
              />

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  onClick={() => router.back()}
                  disabled={isLoading}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="client-form"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Client"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default EditClientPage;
