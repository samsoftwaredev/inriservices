"use client";

import React from "react";
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
import CreateReceipt from "@/components/CreateReceipt";

const NewReceiptPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to receipts dashboard after successful creation
    router.push("/receipts");
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
                Create New Receipt
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Record a new payment receipt for tracking and accounting
              </Typography>
            </Box>
          </Stack>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <CreateReceipt
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

export default NewReceiptPage;
