"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
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
                <ReceiptIcon sx={{ mr: 2, fontSize: 40 }} />
                Edit Receipt
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Update receipt information and payment details
              </Typography>
            </Box>
          </Stack>

          <Card>
            <CardContent sx={{ p: 4 }}>
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
