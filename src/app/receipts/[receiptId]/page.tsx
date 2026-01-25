"use client";

import React, { useCallback, useEffect, useState } from "react";

import AppLayout from "@/components/AppLayout";
import {
  NewClientDialog,
  ProtectedRoute,
  SearchClientDialog,
  Spinner,
} from "@/components";
import Receipt from "@/components/Receipt";
import { useRouter } from "next/navigation";
import { receiptApi } from "@/services/receiptApi";
import { transformSingleReceipt } from "@/tools/transformers";
import { ReceiptTransformed } from "@/types";
import { useClient } from "@/context/ClientContext";
import {
  companyEmail,
  companyName,
  companyStreetAddress,
  companyAddressLocality,
  companyPhoneFormatted,
} from "@/constants/company";
import RequireClient from "@/components/RequireClient";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";
import { useAuth } from "@/context";

interface Props {
  params: Promise<{
    receiptId: string;
  }>;
}

const ReceiptPage = ({ params }: Props) => {
  const router = useRouter();
  const { userData } = useAuth();
  const { currentClient, handleCreateNewClient, handleSelectClient } =
    useClient();
  const [rId, setRId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receipt, setReceipt] = useState<null | ReceiptTransformed>(null);
  const [isOpenSearchClientDialog, setIsOpenSearchClientDialog] =
    useState(false);
  const [isOpenNewClientDialog, setIsOpenNewClientDialog] = useState(false);

  // Resolve params first
  useEffect(() => {
    params.then(({ receiptId }) => {
      setRId(receiptId);
    });
  }, [params]);

  const onInit = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const receiptData = await receiptApi.getReceipt(id);
        setReceipt(() => {
          handleSelectClient(receiptData.client_id);
          return transformSingleReceipt(receiptData);
        });
      } catch (error) {
        console.error("Error fetching receipt data:", error);
        router.push("/receipts");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const onSubmitNewClient = async (data: ClientFormData) => {
    handleCreateNewClient(data, userData!.companyId);
  };

  const onCloseSearchClientDialog = () => {
    setIsOpenSearchClientDialog(false);
  };

  const onCloseNewClientDialog = () => {
    setIsOpenNewClientDialog(false);
  };

  useEffect(() => {
    if (rId) {
      onInit(rId);
    }
  }, [rId, onInit]);

  if (isLoading || !receipt || !rId) return <Spinner />;

  if (!currentClient) {
    router.push("/receipts");
    return null;
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <Receipt
          receiptId={rId}
          receipt={receipt}
          onEdit={() => {}}
          onVoid={() => {}}
          onRefund={() => {}}
          client={currentClient}
        />
      </AppLayout>

      <NewClientDialog
        onClose={onCloseNewClientDialog}
        isOpen={isOpenNewClientDialog}
        onSubmit={onSubmitNewClient}
      />

      <SearchClientDialog
        isOpen={isOpenSearchClientDialog}
        onClose={onCloseSearchClientDialog}
      />
    </ProtectedRoute>
  );
};

export default ReceiptPage;
