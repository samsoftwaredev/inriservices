"use client";

import React from "react";

import EstimatesPage from "@/components/EstimatesPage/EstimatesPage";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";

const Estimates = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <EstimatesPage />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Estimates;
