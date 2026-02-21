import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { ReportPeriod, CompanyInfo } from "./types";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

interface CPANotesPageProps {
  period: ReportPeriod;
  company: CompanyInfo;
  pageNumber: number;
  totalPages: number;
}

export const CPANotesPage = ({
  period,
  company,
  pageNumber,
  totalPages,
}: CPANotesPageProps) => {
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader company={company} period={period} />

      <Text style={styles.sectionTitle}>CPA Notes & Questions</Text>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>Review Notes - For CPA Use Only</Text>

        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <View key={i} style={styles.notesLine}>
            <Text style={{ fontSize: 8, color: "#999" }}>{i}.</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 8 }}>
          Questions or Clarifications Needed:
        </Text>
        <Text style={styles.infoText}>
          Please note any discrepancies, missing documentation, or items
          requiring additional information for tax filing purposes.
        </Text>
      </View>

      <View style={styles.definitions}>
        <Text style={styles.definitionsTitle}>Key Definitions:</Text>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Operating Expenses: </Text>
            Business costs not directly tied to production of goods or services
            (e.g., rent, utilities, insurance, administrative costs).
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Owner Contributions: </Text>
            Capital invested by the business owner into the company. These are
            not taxable income.
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Owner Draws: </Text>
            Money withdrawn from the business by the owner. Not deductible as
            business expenses.
          </Text>
        </View>
        <View style={styles.definitionItem}>
          <Text>
            <Text style={styles.definitionTerm}>Net Profit: </Text>
            Total revenue minus all expenses (including COGS). This represents
            taxable business income.
          </Text>
        </View>
      </View>

      <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  );
};
