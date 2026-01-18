"use client";

import React, { useCallback, useEffect, useState } from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import Receipt from "@/components/Receipt";
import { useRouter } from "next/navigation";
import { receiptApi } from "@/services/receiptApi";
import { transformSingleReceipt } from "@/tools/transformers";
import { ReceiptTransformed } from "@/types";

interface Props {
  params: Promise<{
    receiptId: string;
  }>;
}

const ReceiptPage = ({ params }: Props) => {
  const router = useRouter();
  const [rId, setRId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receipt, setReceipt] = useState<null | ReceiptTransformed>(null);

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
        setReceipt(transformSingleReceipt(receiptData));
      } catch (error) {
        console.error("Error fetching receipt data:", error);
        router.push("/receipts");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (rId) {
      onInit(rId);
    }
  }, [rId, onInit]);

  return (
    <ProtectedRoute>
      <AppLayout>
        {isLoading || !receipt || !rId ? (
          <div>
            <h1>Loading Receipt...</h1>
          </div>
        ) : (
          <Receipt
            receiptId={rId}
            receipt={receipt}
            onEdit={() => {}}
            onVoid={() => {}}
            onRefund={() => {}}
          />
        )}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ReceiptPage;
