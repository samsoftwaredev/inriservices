"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import CreateInvoice from "@/components/CreateInvoice";

const NewInvoicePage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CreateInvoice />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default NewInvoicePage;
