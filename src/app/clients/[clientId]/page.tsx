"use client";

import React, { useEffect, useCallback, useState } from "react";

import AppLayout from "@/components/AppLayout/AppLayout";
import { ProtectedRoute } from "@/components";
import { ClientProfile } from "@/components/ClientProfile";
import { useRouter } from "next/navigation";
import { clientApi } from "@/services";
import { ClientFullData } from "@/types";
import {
  allProjectTransformer,
  allPropertyTransformer,
  clientTransformer,
  transformedClientFullData,
} from "@/tools/transformers";

interface Props {
  params: Promise<{
    clientId: string;
  }>;
}

const ClientIdPage = ({ params }: Props) => {
  const router = useRouter();
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<null | ClientFullData>(null);

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
        setClient(transformedClientFullData(clientData));
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
