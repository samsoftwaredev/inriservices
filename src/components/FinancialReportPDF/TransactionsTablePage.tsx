import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import {
  formatCurrency,
  formatDate,
  truncateText,
  getTransactionTypeLabel,
} from "./utils";
import type { ReportTransaction, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface TransactionsTablePageProps {
  transactions: ReportTransaction[];
  period: ReportPeriod;
  company: CompanyInfo;
  startPage: number;
  totalPages: number;
}

const TRANSACTIONS_PER_PAGE = 19; // Adjusted for header/footer space on each page

export const TransactionsTablePages = ({
  transactions,
  period,
  company,
  startPage,
  totalPages,
}: TransactionsTablePageProps) => {
  const pages: React.ReactElement[] = [];
  const totalTxPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);

  for (let pageIndex = 0; pageIndex < totalTxPages; pageIndex++) {
    const start = pageIndex * TRANSACTIONS_PER_PAGE;
    const end = Math.min(start + TRANSACTIONS_PER_PAGE, transactions.length);
    const pageTransactions = transactions.slice(start, end);

    pages.push(
      <Page key={`tx-page-${pageIndex}`} size="LETTER" style={styles.page}>
        <PageHeader company={company} period={period} />

        {pageIndex === 0 && (
          <Text style={styles.sectionTitle}>Full Transaction Ledger</Text>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellSmall}>Date</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
            <Text style={styles.tableCellMedium}>Vendor</Text>
            <Text style={styles.tableCellMedium}>Category</Text>
            <Text style={styles.tableCellSmall}>Type</Text>
            <Text style={[styles.tableCellMedium, styles.textRight]}>
              Amount
            </Text>
            <Text style={styles.tableCellSmall}>Receipt</Text>
          </View>

          {pageTransactions.map((tx, index) => {
            const amount = tx.amount / 100;
            const displayAmount = formatCurrency(amount);

            return (
              <View
                key={tx.id}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={styles.tableCellSmall}>{formatDate(tx.date)}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {truncateText(tx.description || "—", 35)}
                  {tx.memo && (
                    <Text style={{ fontSize: 8, color: "#666" }}>
                      {"\n"}
                      {truncateText(tx.memo, 35)}
                    </Text>
                  )}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {truncateText(tx.vendor || "—", 15)}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {truncateText(tx.category || "Uncategorized", 15)}
                </Text>
                <Text style={styles.tableCellSmall}>
                  {getTransactionTypeLabel(tx.type).substring(0, 8)}
                </Text>
                <Text
                  style={[
                    styles.tableCellMedium,
                    styles.textRight,
                    { color: amount < 0 ? "#dc3545" : "#28a745" },
                  ]}
                >
                  {displayAmount}
                </Text>
                <Text style={[styles.tableCellSmall, styles.textCenter]}>
                  {tx.has_receipt ? "Yes" : "No"}
                </Text>
              </View>
            );
          })}
        </View>

        <PageFooter
          pageNumber={startPage + pageIndex}
          totalPages={totalPages}
        />
      </Page>,
    );
  }

  return <>{pages}</>;
};
