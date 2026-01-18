"use client";

import React from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import ReceiptDashboard from "@/components/ReceiptDashboard";

const ReceiptPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ReceiptDashboard />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ReceiptPage;
