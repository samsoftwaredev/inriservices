import { ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout";
import { DocumentSigningDashboard } from "@/components/DocuSign";
import React from "react";

const Contracts = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DocumentSigningDashboard />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Contracts;
