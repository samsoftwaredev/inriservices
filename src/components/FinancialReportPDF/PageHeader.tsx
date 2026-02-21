import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatDate } from "./utils";
import type { CompanyInfo, ReportPeriod } from "./types";

interface PageHeaderProps {
  company: CompanyInfo;
  period: ReportPeriod;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ company, period }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{company.name}</Text>
      <Text style={styles.headerText}>
        {formatDate(period.startDate)} - {formatDate(period.endDate)}
      </Text>
    </View>
  );
};
