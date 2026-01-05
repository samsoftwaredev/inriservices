"use client";

import React from "react";

import { GeneralEstimate, ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout";
import { ProjectCostProvider } from "@/context";

const GeneralEstimatePage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProjectCostProvider>
          <GeneralEstimate />
        </ProjectCostProvider>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default GeneralEstimatePage;
