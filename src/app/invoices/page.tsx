"use client";

import React from "react";

import Invoices from "@/components/Invoices/Invoices";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";

const InvoicePage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Invoices />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default InvoicePage;
