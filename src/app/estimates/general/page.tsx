"use client";

import React from "react";

import { GeneralEstimate, ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout";
import { ProjectCostProvider } from "@/context";
import { QualifyingQuestions } from "@/components/QualifyingQuestions";

const GeneralEstimatePage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProjectCostProvider>
          <QualifyingQuestions />
          <GeneralEstimate />
        </ProjectCostProvider>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default GeneralEstimatePage;
