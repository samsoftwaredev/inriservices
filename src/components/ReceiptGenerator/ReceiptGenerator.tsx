"use client";

import React, { useEffect, useRef } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@mui/material";
import { Download, Receipt } from "@mui/icons-material";
import {
  companyEmail,
  companyFullAddress,
  companyName,
  companyPhoneFormatted,
  companySlogan,
} from "@/constants";
import { ReceiptDisplayData } from "@/types";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2 solid #333333",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 10,
    color: "#666666",
    lineHeight: 1.4,
  },
  invoiceInfo: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 5,
  },
  customerSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1 solid #cccccc",
  },
  customerInfo: {
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.4,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    borderBottom: "1 solid #cccccc",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    fontSize: 11,
    borderBottom: "1 solid #eeeeee",
    minHeight: 30,
  },
  tableCell: {
    flex: 1,
    paddingRight: 5,
  },
  description: {
    flex: 3,
  },
  quantity: {
    flex: 1,
    textAlign: "center",
  },
  rate: {
    flex: 1.5,
    textAlign: "right",
  },
  amount: {
    flex: 1.5,
    textAlign: "right",
  },
  totalsSection: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    padding: 5,
    fontSize: 11,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    padding: 8,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    marginTop: 5,
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  notesText: {
    fontSize: 10,
    color: "#666666",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
    borderTop: "1 solid #cccccc",
    paddingTop: 10,
  },
});

// PDF Document Component
const ReceiptPDF: React.FC<{ data: ReceiptDisplayData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{companyName}</Text>
          <Text style={styles.companyDetails}>
            {companySlogan}
            {"\n"}
            {companyFullAddress} {"\n"}
            Phone: {companyPhoneFormatted}
            {"\n"}
            Email: {companyEmail}
          </Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>RECEIPT</Text>
          <Text style={styles.invoiceNumber}>#{data.receiptNumber}</Text>
          <Text style={styles.invoiceNumber}>Date: {data.date}</Text>
          <Text style={styles.invoiceNumber}>Status: {data.status}</Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.customerSection}>
        <Text style={styles.sectionTitle}>Received From:</Text>
        <Text style={styles.customerInfo}>
          {data.customerName}
          {data.customerEmail && `\n${data.customerEmail}`}
          {data.customerAddress && `\n${data.customerAddress}`}
        </Text>
      </View>

      {/* Payment Details */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.description]}>
            Description
          </Text>
          <Text style={[styles.tableCell, styles.amount]}>Amount</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.description]}>
            {data.projectDescription || "Payment Received"}
          </Text>
          <Text style={[styles.tableCell, styles.amount]}>
            ${(data.amount / 100).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text>Payment Method:</Text>
          <Text>{data.paymentMethod}</Text>
        </View>
        {data.referenceNumber && (
          <View style={styles.totalRow}>
            <Text>Reference #:</Text>
            <Text>{data.referenceNumber}</Text>
          </View>
        )}
        <View style={styles.grandTotal}>
          <Text>Total Received:</Text>
          <Text>${(data.amount / 100).toFixed(2)}</Text>
        </View>
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{data.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          Thank you for your payment! This receipt serves as proof of payment.
        </Text>
      </View>
    </Page>
  </Document>
);

// Receipt Generator Component
interface ReceiptGeneratorProps {
  receiptData: ReceiptDisplayData;
  buttonText?: string;
  fileName?: string;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({
  receiptData,
  buttonText = "Download Receipt",
  fileName,
  variant = "contained",
  size = "medium",
  fullWidth = false,
}) => {
  const defaultFileName = `receipt-${
    receiptData.receiptNumber
  }-${receiptData.date.replace(/\//g, "-")}.pdf`;
  const pdfFileName = fileName || defaultFileName;

  // prevent PDF error by updating key on receiptData change
  const count = useRef(0);
  useEffect(() => {
    count.current++;
  }, [receiptData]);

  return (
    <PDFDownloadLink
      key={count.current}
      document={<ReceiptPDF data={receiptData} />}
      fileName={pdfFileName}
      style={{ textDecoration: "none" }}
    >
      {({ blob, url, loading, error }) => (
        <Button
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          startIcon={loading ? <Receipt /> : <Download />}
          disabled={loading}
          sx={{
            width: { md: 250, xs: "100%" },
            "&:hover": {
              transform: "translateY(-1px)",
            },
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {loading ? "Generating PDF..." : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default ReceiptGenerator;

/* Usage Example:
import ReceiptGenerator, { transformReceiptForPDF } from '@/components/ReceiptGenerator';

const receiptData = transformReceiptForPDF(
  receiptFromDB,
  'John Doe',
  'john@example.com', 
  '123 Main St, City, State',
  'Kitchen painting project'
);

<ReceiptGenerator 
  receiptData={receiptData}
  buttonText="Download Receipt"
  fileName="my-receipt.pdf"
/>
*/
