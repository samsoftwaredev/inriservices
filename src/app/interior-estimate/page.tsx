"use client";

import React from "react";

import { ProInteriorEstimate, ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout";

const InteriorEstimate = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProInteriorEstimate />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default InteriorEstimate;
