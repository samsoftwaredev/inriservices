"use client";

import React from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <h1>Project Id</h1>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
