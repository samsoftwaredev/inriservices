"use client";

import React from "react";

import { GeneralEstimate, ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout";

const GeneralEstimatePage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <GeneralEstimate />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default GeneralEstimatePage;
