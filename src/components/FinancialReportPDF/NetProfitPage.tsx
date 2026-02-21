import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatCurrency } from "./utils";
import type { FinancialSummary, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface NetProfitPageProps {
  summary: FinancialSummary;
  period: ReportPeriod;
  company: CompanyInfo;
  pageNumber: number;
  totalPages: number;
}

export const NetProfitPage: React.FC<NetProfitPageProps> = ({
  summary,
  period,
  company,
  pageNumber,
  totalPages,
}) => {
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader company={company} period={period} />

      <Text style={styles.sectionTitle}>Net Profit Details</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={[styles.summaryValue, { color: "#28a745" }]}>
            {formatCurrency(summary.totalRevenue)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cost of Goods Sold (COGS)</Text>
          <Text style={[styles.summaryValue, { color: "#ffc107" }]}>
            ({formatCurrency(Math.abs(summary.totalCOGS))})
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gross Profit</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalRevenue + summary.totalCOGS)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Operating Expenses</Text>
          <Text style={[styles.summaryValue, { color: "#dc3545" }]}>
            ({formatCurrency(Math.abs(summary.totalOperatingExpenses))})
          </Text>
        </View>

        <View style={styles.summaryRowHighlight}>
          <Text style={styles.summaryLabel}>Net Profit (Loss)</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: summary.netProfit >= 0 ? "#28a745" : "#dc3545" },
            ]}
          >
            {formatCurrency(summary.netProfit)}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>
          Calculation:
        </Text>
        <Text style={styles.infoText}>
          Net Profit = Revenue + COGS + Operating Expenses
        </Text>
        <Text style={styles.infoText}>
          (Note: COGS and Operating Expenses are recorded as negative values)
        </Text>
      </View>

      <View style={styles.definitions}>
        <Text style={styles.definitionsTitle}>Definitions:</Text>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Revenue: </Text>
            Income from business operations (sales, services, etc.)
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>COGS: </Text>
            Direct costs of materials and labor for goods/services sold
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Operating Expenses: </Text>
            Business costs not directly tied to production (rent, utilities,
            insurance, etc.)
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Net Profit: </Text>
            Final profit after all expenses are deducted from revenue
          </Text>
        </View>
      </View>

      <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  );
};
