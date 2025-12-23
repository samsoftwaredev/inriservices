"use client";

import React from "react";

import DashboardPage from "@/components/DashboardPage";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
