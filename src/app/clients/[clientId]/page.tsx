"use client";

import React, { useEffect, useCallback } from "react";

import AppLayout from "@/components/AppLayout/AppLayout";
import { ProtectedRoute } from "@/components";
import { ClientProfile } from "@/components/ClientProfile";
import { useRouter } from "next/navigation";
import { clientApi } from "@/services";
import { ClientProfileType } from "@/components/ClientProfile/ClientProfile";

interface Props {
  params: Promise<{
    clientId: string;
  }>;
}

const ClientIdPage = ({ params }: Props) => {
  const router = useRouter();
  const [clientId, setClientId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [client, setClient] = React.useState<null | ClientProfileType>(null);

  // Resolve params first
  useEffect(() => {
    params.then(({ clientId }) => {
      setClientId(clientId);
    });
  }, [params]);

  const onInit = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const clientData = await clientApi.getClient(id);
        const transformedClient: ClientProfileType = {
          id: clientData.id,
          fullName: clientData.display_name,
          email: clientData.normalized_email || "",
          phone: clientData.normalized_phone || "",
          addressId: clientData.properties[0]?.id || "",
          address: clientData.properties[0]?.address_line1 || "",
          address2: clientData.properties[0]?.address_line2 || "",
          city: clientData.properties[0]?.city || "",
          state: clientData.properties[0]?.state || "",
          zipCode: clientData.properties[0]?.zip || "",
          numberOfProjects: clientData.properties[0]?.projects.length || 0,
          totalRevenue: 0,
          lastProjectDate: "",
          status: "active",
          notes: "",
        };
        setClient(transformedClient);
      } catch (error) {
        console.error("Error fetching client data:", error);
        router.push("/clients");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (clientId) {
      onInit(clientId);
    }
  }, [clientId, onInit]);

  return (
    <ProtectedRoute>
      <AppLayout>
        {isLoading || !client || !clientId ? (
          <div>
            <h1>Loading Client...</h1>
          </div>
        ) : (
          <ClientProfile client={client} />
        )}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ClientIdPage;
