"use client";

import React from "react";

import ClientsPage from "@/components/ClientsPage";
import AppLayout from "@/components/AppLayout/AppLayout";
import { ProtectedRoute } from "@/components";

const Clients = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ClientsPage />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Clients;
