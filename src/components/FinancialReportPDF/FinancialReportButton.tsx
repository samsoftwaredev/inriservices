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
import type { FinancialTransaction, Accounts } from "@/types";

interface FinancialReportButtonProps {
  transactions: FinancialTransaction[];
  accounts: Map<string, Accounts>;
  company: CompanyInfo;
  period: ReportPeriod;
  prepared?: Partial<PreparedInfo>;
}

const transformTransactionData = (
  transactions: FinancialTransaction[],
  accounts: Map<string, Accounts>,
): ReportTransaction[] => {
  return transactions.map((tx) => {
    const account = accounts.get(tx.account_id);

    return {
      id: tx.id,
      date: tx.transaction_date,
      amount: tx.amount_cents,
      currency: "USD",
      description: tx.description || "",
      memo: tx.memo || undefined,
      vendor: tx.vendor_id ? "Vendor Name" : undefined,
      category: account?.name,
      type: account?.type || "expense",
      account: account?.code || undefined,
      payment_method: undefined,
      external_id: tx.external_id || undefined,
      reference_number: tx.reference_number || undefined,
      notes: undefined,
      tags: undefined,
      has_receipt: !!tx.receipt_id,
      receipt_url: undefined,
      attachment_name: tx.receipt_id ? "Receipt" : undefined,
    };
  });
};

export const FinancialReportButton: React.FC<FinancialReportButtonProps> = ({
  transactions,
  accounts,
  company,
  period,
  prepared,
}) => {
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
