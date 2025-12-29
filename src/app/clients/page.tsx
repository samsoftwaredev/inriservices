"use client";

import React from "react";

import Clients from "@/components/Clients";
import AppLayout from "@/components/AppLayout/AppLayout";
import { ProtectedRoute } from "@/components";

const ClientsPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Clients />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ClientsPage;
