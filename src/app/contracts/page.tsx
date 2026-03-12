"use client";

import { ProtectedRoute, PageHeader } from "@/components";
import AppLayout from "@/components/AppLayout";
import { DocumentSigningDashboard } from "@/components/DocuSign";
import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

const Contracts = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <AppLayout>
        <PageHeader
          title="Contracts"
          subtitle="Manage your contracts and agreements"
          actions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/contracts/new")}
            >
              New Contract
            </Button>
          }
        />
        <DocumentSigningDashboard />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Contracts;
