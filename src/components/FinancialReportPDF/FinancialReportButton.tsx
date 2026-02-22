"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@mui/material";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";
import { FinancialReportPDF } from "./FinancialReportPDF";
import type {
  FinancialReportData,
  ReportTransaction,
  CompanyInfo,
  ReportPeriod,
  PreparedInfo,
} from "./types";
import type {
  FinancialTransaction,
  Accounts,
  FinancialDocument,
} from "@/types";

interface FinancialReportButtonProps {
  transactions: {
    tx: FinancialTransaction;
    docs: FinancialDocument[];
    id: string;
  }[];
  accounts: Map<string, Accounts>;
  company: CompanyInfo;
  period: ReportPeriod;
  prepared?: Partial<PreparedInfo>;
}

const transformTransactionData = (
  transactions: {
    tx: FinancialTransaction;
    docs: FinancialDocument[];
    id: string;
  }[],
  accounts: Map<string, Accounts>,
): ReportTransaction[] => {
  return transactions.map((item) => {
    const account = accounts.get(item.tx.account_id);

    return {
      id: item.tx.id,
      date: item.tx.transaction_date,
      amount: item.tx.amount_cents,
      currency: "USD",
      description: item.tx.description || "",
      memo: item.tx.memo || undefined,
      vendor: item.tx.vendor_id ? "Vendor Name" : undefined,
      category: account?.name,
      type: account?.type || "expense",
      account: account?.code || undefined,
      payment_method: undefined,
      external_id: item.tx.external_id || undefined,
      reference_number: item.tx.reference_number || undefined,
      notes: undefined,
      tags: undefined,
      has_receipt: !!item.tx.receipt_id,
      receipt_url: undefined,
      attachment_name: item.tx.receipt_id ? "Receipt" : undefined,
    };
  });
};

export const FinancialReportButton = ({
  transactions,
  accounts,
  company,
  period,
  prepared,
}: FinancialReportButtonProps) => {
  const reportData: FinancialReportData = {
    company,
    period,
    prepared: {
      generatedDate: new Date().toISOString(),
      preparedBy: company.name,
      ...prepared,
    },
    transactions: transformTransactionData(transactions, accounts),
  };

  return (
    <PDFDownloadLink
      document={<FinancialReportPDF data={reportData} />}
      fileName={`financial-report-${period.year}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outlined" startIcon={<PdfIcon />} disabled={loading}>
          {loading ? "Generating PDF..." : "Download Financial Report"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default FinancialReportButton;
