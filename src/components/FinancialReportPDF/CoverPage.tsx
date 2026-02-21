import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatDateLong } from "./utils";
import type { CompanyInfo, ReportPeriod, PreparedInfo } from "./types";

interface CoverPageProps {
  company: CompanyInfo;
  period: ReportPeriod;
  prepared: PreparedInfo;
}

export const CoverPage = ({ company, period, prepared }: CoverPageProps) => {
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverTitle}>Financial Report</Text>
        <Text style={styles.coverSubtitle}>{company.name}</Text>

        <View style={styles.coverInfo}>
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Tax Year:</Text>
            <Text style={styles.coverValue}>{period.year}</Text>
          </View>

          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Reporting Period:</Text>
            <Text style={styles.coverValue}>
              {formatDateLong(period.startDate)} →{" "}
              {formatDateLong(period.endDate)}
            </Text>
          </View>

          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Report Generated:</Text>
            <Text style={styles.coverValue}>
              {formatDateLong(prepared.generatedDate)}
            </Text>
          </View>

          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Currency:</Text>
            <Text style={styles.coverValue}>USD</Text>
          </View>

          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Accounting Method:</Text>
            <Text style={styles.coverValue}>
              {period.accountingMethod || "Cash"}
            </Text>
          </View>

          {prepared.preparedFor && (
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverLabel}>Prepared For:</Text>
              <Text style={styles.coverValue}>{prepared.preparedFor}</Text>
            </View>
          )}

          <View style={styles.coverInfoRow}>
            <Text style={styles.coverLabel}>Prepared By:</Text>
            <Text style={styles.coverValue}>
              {prepared.preparedBy || company.name}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
