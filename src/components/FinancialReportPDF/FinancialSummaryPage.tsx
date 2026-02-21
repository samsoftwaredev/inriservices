import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatCurrency, formatDateLong } from "./utils";
import type { FinancialSummary, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface FinancialSummaryPageProps {
  summary: FinancialSummary;
  period: ReportPeriod;
  company: CompanyInfo;
  pageNumber: number;
  totalPages: number;
}

export const FinancialSummaryPage: React.FC<FinancialSummaryPageProps> = ({
  summary,
  period,
  company,
  pageNumber,
  totalPages,
}) => {
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader company={company} period={period} />

      <Text style={styles.sectionTitle}>Financial Summary</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={[styles.summaryValue, { color: "#28a745" }]}>
            {formatCurrency(summary.totalRevenue)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Operating Expenses</Text>
          <Text style={[styles.summaryValue, { color: "#dc3545" }]}>
            {formatCurrency(Math.abs(summary.totalOperatingExpenses))}
          </Text>
        </View>

        <View style={styles.summaryRowHighlight}>
          <Text style={styles.summaryLabel}>Net Profit</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: summary.netProfit >= 0 ? "#28a745" : "#dc3545" },
            ]}
          >
            {formatCurrency(summary.netProfit)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Owner Contributions</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(summary.ownerContributions)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Owner Draws</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(Math.abs(summary.ownerDraws))}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Transaction Count:</Text>
          <Text style={styles.summaryValue}>{summary.transactionCount}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date Range Covered:</Text>
          <Text style={styles.summaryValue}>
            {formatDateLong(period.startDate)} →{" "}
            {formatDateLong(period.endDate)}
          </Text>
        </View>

        {summary.uncategorizedTotal > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Uncategorized Total:</Text>
            <Text style={[styles.summaryValue, { color: "#ffc107" }]}>
              {formatCurrency(summary.uncategorizedTotal)}
            </Text>
          </View>
        )}
      </View>

      {summary.uncategorizedTotal > 0 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ⚠ Warning: {formatCurrency(summary.uncategorizedTotal)} in
            uncategorized transactions. Please review and categorize.
          </Text>
        </View>
      )}

      <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  );
};
