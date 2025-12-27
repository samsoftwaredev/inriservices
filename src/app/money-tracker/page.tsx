"use client";

import React from "react";

import AppLayout from "@/components/AppLayout";
import { ExpenseTrackerApp } from "@/components/ExpenseTrackerApp";
import { ProtectedRoute } from "@/components";

const InteriorEstimate = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ExpenseTrackerApp />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default InteriorEstimate;
