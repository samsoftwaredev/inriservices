"use client";

import React, { use } from "react";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import CreateInvoice from "@/components/CreateInvoice";

interface InvoicePageProps {
  params: Promise<{
    invoiceId: string;
  }>;
}

const InvoicePage = ({ params }: InvoicePageProps) => {
  const { invoiceId } = use(params);
  return (
    <ProtectedRoute>
      <AppLayout>
        <CreateInvoice invoiceId={invoiceId} />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default InvoicePage;
