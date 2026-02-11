"use client";

import React from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import LegoBlockEstimationPage from "@/components/LegoBlockEstimationPage";

const Estimates = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <LegoBlockEstimationPage />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Estimates;
