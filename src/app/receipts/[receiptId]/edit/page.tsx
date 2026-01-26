"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, CardContent } from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute, PageHeader } from "@/components";
import EditReceipt from "@/components/EditReceipt";

interface EditReceiptPageProps {
  params: Promise<{
    receiptId: string;
  }>;
}

const EditReceiptPage = ({ params }: EditReceiptPageProps) => {
  const { receiptId } = use(params);
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/receipts/${receiptId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1000, mx: "auto" }}>
          {/* Header */}
          <PageHeader
            title="Edit Receipt"
            subtitle="Update receipt information and payment details"
            icon={<ReceiptIcon />}
            onBack={() => router.back()}
          />

          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <EditReceipt
                receiptId={receiptId}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default EditReceiptPage;
