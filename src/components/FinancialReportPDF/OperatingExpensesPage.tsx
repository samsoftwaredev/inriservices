import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatCurrency } from "./utils";
import type { CategoryBreakdown, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface OperatingExpensesPageProps {
  expenses: CategoryBreakdown[];
  period: ReportPeriod;
  company: CompanyInfo;
  pageNumber: number;
  totalPages: number;
}

export const OperatingExpensesPage: React.FC<OperatingExpensesPageProps> = ({
  expenses,
  period,
  company,
  pageNumber,
  totalPages,
}) => {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.total, 0);

  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader company={company} period={period} />

      <Text style={styles.sectionTitle}>Operating Expenses Breakdown</Text>

      {expenses.length === 0 ? (
        <Text style={{ fontSize: 10, color: "#666" }}>
          No operating expenses for this period.
        </Text>
      ) : (
        <>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Category</Text>
              <Text style={[styles.tableCell, styles.textCenter]}>
                Transactions
              </Text>
              <Text style={[styles.tableCell, styles.textRight]}>Amount</Text>
              <Text style={[styles.tableCell, styles.textRight]}>
                % of Total
              </Text>
            </View>

            {expenses.map((item, index) => (
              <View
                key={index}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={[styles.categoryName, { flex: 2 }]}>
                  {item.category}
                </Text>
                <Text style={[styles.categoryCount, styles.textCenter]}>
                  {item.count}
                </Text>
                <Text style={[styles.categoryValue, styles.textRight]}>
                  {formatCurrency(item.total)}
                </Text>
                <Text style={[styles.categoryPercent, styles.textRight]}>
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
            ))}

            <View style={styles.summaryRowHighlight}>
              <Text style={[styles.summaryLabel, { flex: 2 }]}>
                Total Operating Expenses:
              </Text>
              <Text style={styles.summaryLabel}></Text>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {formatCurrency(totalExpenses)} |
              </Text>
              <Text style={[styles.summaryValue, styles.textRight]}>
                100.0%
              </Text>
            </View>
          </View>
        </>
      )}

      <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  );
};
