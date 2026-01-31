"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import AppLayout from "@/components/AppLayout";
import { PageHeader, ProtectedRoute } from "@/components";
import ClientForm from "@/components/ProInteriorEstimate/ClientForm";
import { SubmitHandler } from "react-hook-form";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";
import { clientApi, propertyApi } from "@/services";
import { useAuth } from "@/context";
import { toast } from "react-toastify";

const NewClientPage = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    if (!userData?.companyId) {
      setError("Company information is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create the client
      const newClient = await clientApi.createClient({
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
        status: data.status || "active",
        notes: data.notes || "",
        client_type: "person",
        company_id: userData.companyId,
      });

      // Create the property
      await propertyApi.createProperty({
        client_id: newClient.id,
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

      toast.success("Client created successfully!");
      router.push(`/clients/${newClient.id}`);
    } catch (err) {
      console.error("Error creating client:", err);
      setError(
        "Failed to create client. Please check your data and try again.",
      );
      toast.error("Failed to create client");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultValues: ClientFormData = {
    id: "",
    fullName: "",
    email: "",
    phone: "",
    addressId: "",
    address: "",
    address2: "",
    contact: "",
    city: "",
    state: "",
    zipCode: "",
    numberOfProjects: 0,
    floorPlan: 1,
    measurementUnit: "ft",
    totalRevenue: 0,
    lastProjectDate: "",
    status: "active",
    notes: "",
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <PageHeader
          title="Create New Client"
          subtitle="Fill in the client details to create a new client profile"
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
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
                {isLoading ? "Creating..." : "Create Client"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default NewClientPage;
