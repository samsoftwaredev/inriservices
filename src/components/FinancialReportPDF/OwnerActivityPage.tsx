import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatCurrency } from "./utils";
import type { CategoryBreakdown, ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface OwnerActivityPageProps {
  contributions: CategoryBreakdown[];
  draws: CategoryBreakdown[];
  period: ReportPeriod;
  company: CompanyInfo;
  pageNumber: number;
  totalPages: number;
}

export const OwnerActivityPage: React.FC<OwnerActivityPageProps> = ({
  contributions,
  draws,
  period,
  company,
  pageNumber,
  totalPages,
}) => {
  const totalContributions = contributions.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  const totalDraws = draws.reduce((sum, item) => sum + item.total, 0);

  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader company={company} period={period} />

      <Text style={styles.sectionTitle}>Owner Activity Breakdown</Text>

      <View style={styles.categoryBreakdown}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
          Owner Contributions
        </Text>

        {contributions.length === 0 ? (
          <Text style={{ fontSize: 10, color: "#666", marginBottom: 15 }}>
            No owner contributions for this period.
          </Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Category</Text>
              <Text style={[styles.tableCell, styles.textCenter]}>Count</Text>
              <Text style={[styles.tableCell, styles.textRight]}>Amount</Text>
            </View>
            {contributions.map((item, index) => (
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
              </View>
            ))}
            <View style={styles.summaryRowHighlight}>
              <Text style={[styles.summaryLabel, { flex: 2 }]}>
                Total Contributions:
              </Text>
              <Text style={styles.summaryLabel}></Text>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {formatCurrency(totalContributions)}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.categoryBreakdown}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 10,
            marginTop: 20,
          }}
        >
          Owner Draws
        </Text>

        {draws.length === 0 ? (
          <Text style={{ fontSize: 10, color: "#666", marginBottom: 15 }}>
            No owner draws for this period.
          </Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Category</Text>
              <Text style={[styles.tableCell, styles.textCenter]}>Count</Text>
              <Text style={[styles.tableCell, styles.textRight]}>Amount</Text>
            </View>
            {draws.map((item, index) => (
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
              </View>
            ))}
            <View style={styles.summaryRowHighlight}>
              <Text style={[styles.summaryLabel, { flex: 2 }]}>
                Total Draws:
              </Text>
              <Text style={styles.summaryLabel}></Text>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {formatCurrency(totalDraws)}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: "bold" }}>Note: </Text>
          Explain any large or unusual owner activity. Owner contributions
          represent capital invested into the business. Owner draws represent
          distributions taken from business equity.
        </Text>
      </View>

      <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  );
};
