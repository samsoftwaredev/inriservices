"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import { ContractForm } from "@/components/ContractGenerator";

const NewContractPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ContractForm />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default NewContractPage;
