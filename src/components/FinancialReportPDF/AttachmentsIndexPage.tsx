import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatCurrency, formatDate, truncateText } from "./utils";
import type { ReportTransaction, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface AttachmentsIndexPageProps {
  transactions: ReportTransaction[];
  period: ReportPeriod;
  company: CompanyInfo;
  startPage: number;
  totalPages: number;
}

const ATTACHMENTS_PER_PAGE = 30;

export const AttachmentsIndexPages = ({
  transactions,
  period,
  company,
  startPage,
  totalPages,
}: AttachmentsIndexPageProps) => {
  const pages: React.ReactElement[] = [];
  const totalAttPages = Math.ceil(transactions.length / ATTACHMENTS_PER_PAGE);

  if (transactions.length === 0) {
    return (
      <Page size="LETTER" style={styles.page}>
        <PageHeader company={company} period={period} />
        <Text style={styles.sectionTitle}>Attachments Index</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            No attachments available for this period.
          </Text>
        </View>
        <PageFooter pageNumber={startPage} totalPages={totalPages} />
      </Page>
    );
  }

  for (let pageIndex = 0; pageIndex < totalAttPages; pageIndex++) {
    const start = pageIndex * ATTACHMENTS_PER_PAGE;
    const end = Math.min(start + ATTACHMENTS_PER_PAGE, transactions.length);
    const pageTransactions = transactions.slice(start, end);

    pages.push(
      <Page key={`att-page-${pageIndex}`} size="LETTER" style={styles.page}>
        <PageHeader company={company} period={period} />

        {pageIndex === 0 && (
          <>
            <Text style={styles.sectionTitle}>Attachments Index</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Total transactions with attachments: {transactions.length}
              </Text>
            </View>
          </>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellSmall}>Date</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
            <Text style={styles.tableCellMedium}>Vendor</Text>
            <Text style={styles.tableCellMedium}>Category</Text>
            <Text style={[styles.tableCellMedium, styles.textRight]}>
              Amount
            </Text>
            <Text style={styles.tableCellMedium}>Ref/ID</Text>
          </View>

          {pageTransactions.map((tx, index) => {
            const amount = tx.amount / 100;

            return (
              <View
                key={tx.id}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={styles.tableCellSmall}>{formatDate(tx.date)}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {truncateText(tx.description || "—", 30)}
                  {tx.attachment_name && (
                    <Text style={{ fontSize: 7, color: "#666" }}>
                      {"\n"}📎 {truncateText(tx.attachment_name, 30)}
                    </Text>
                  )}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {truncateText(tx.vendor || "—", 15)}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {truncateText(tx.category || "Uncategorized", 15)}
                </Text>
                <Text
                  style={[
                    styles.tableCellMedium,
                    styles.textRight,
                    { color: amount < 0 ? "#dc3545" : "#28a745" },
                  ]}
                >
                  {formatCurrency(amount)}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {truncateText(
                    tx.reference_number ||
                      tx.external_id ||
                      tx.id.substring(0, 8),
                    12,
                  )}
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
