import React from "react";
import { Document } from "@react-pdf/renderer";
import { CoverPage } from "./CoverPage";
import { FinancialSummaryPage } from "./FinancialSummaryPage";
import { OwnerActivityPage } from "./OwnerActivityPage";
import { OperatingExpensesPage } from "./OperatingExpensesPage";
import { NetProfitPage } from "./NetProfitPage";
import { TransactionsTablePages } from "./TransactionsTablePage";
import { AttachmentsIndexPages } from "./AttachmentsIndexPage";
import { CPANotesPage } from "./CPANotesPage";
import {
  calculateFinancialSummary,
  getOperatingExpensesBreakdown,
  getOwnerActivityBreakdown,
  getTransactionsWithReceipts,
} from "./utils";
import type { FinancialReportData } from "./types";

interface FinancialReportPDFProps {
  data: FinancialReportData;
}

export const FinancialReportPDF: React.FC<FinancialReportPDFProps> = ({
  data,
}) => {
  const { company, period, prepared, transactions } = data;

  const summary = calculateFinancialSummary(transactions);
  const expensesBreakdown = getOperatingExpensesBreakdown(transactions);
  const { contributions, draws } = getOwnerActivityBreakdown(transactions);
  const transactionsWithReceipts = getTransactionsWithReceipts(transactions);

  const TRANSACTIONS_PER_PAGE = 25;
  const ATTACHMENTS_PER_PAGE = 30;

  const transactionPages = Math.ceil(
    transactions.length / TRANSACTIONS_PER_PAGE,
  );
  const attachmentPages =
    transactionsWithReceipts.length > 0
      ? Math.ceil(transactionsWithReceipts.length / ATTACHMENTS_PER_PAGE)
      : 1;

  const totalPages = 1 + 1 + 1 + 1 + 1 + transactionPages + attachmentPages + 1;

  let currentPage = 1;

  return (
    <Document>
      <CoverPage company={company} period={period} prepared={prepared} />

      <FinancialSummaryPage
        summary={summary}
        period={period}
        company={company}
        pageNumber={++currentPage}
        totalPages={totalPages}
      />

      <OwnerActivityPage
        contributions={contributions}
        draws={draws}
        period={period}
        company={company}
        pageNumber={++currentPage}
        totalPages={totalPages}
      />

      <OperatingExpensesPage
        expenses={expensesBreakdown}
        period={period}
        company={company}
        pageNumber={++currentPage}
        totalPages={totalPages}
      />

      <NetProfitPage
        summary={summary}
        period={period}
        company={company}
        pageNumber={++currentPage}
        totalPages={totalPages}
      />

      <TransactionsTablePages
        transactions={transactions}
        period={period}
        company={company}
        startPage={++currentPage}
        totalPages={totalPages}
      />

      <AttachmentsIndexPages
        transactions={transactionsWithReceipts}
        period={period}
        company={company}
        startPage={currentPage + transactionPages}
        totalPages={totalPages}
      />

      <CPANotesPage
        period={period}
        company={company}
        pageNumber={totalPages}
        totalPages={totalPages}
      />
    </Document>
  );
};

export default FinancialReportPDF;
