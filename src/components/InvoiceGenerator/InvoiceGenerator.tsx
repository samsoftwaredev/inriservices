"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { Button } from "@mui/material";
import { Download, Receipt } from "@mui/icons-material";

// Define types for invoice data
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
}

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
const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>InriPaintWall</Text>
          <Text style={styles.companyDetails}>
            Expert Painting & Drywall Services{"\n"}
            Garland, Texas{"\n"}
            Phone: (469) 123-4567{"\n"}
            Email: contact@inripaintwall.com
          </Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
          <Text style={styles.invoiceNumber}>Date: {data.date}</Text>
          <Text style={styles.invoiceNumber}>Due: {data.dueDate}</Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.customerSection}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.customerInfo}>
          {data.customer.name}
          {"\n"}
          {data.customer.address}
          {"\n"}
          {data.customer.city}, {data.customer.state} {data.customer.zipCode}
          {"\n"}
          {data.customer.email}
        </Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.description]}>
            Description
          </Text>
          <Text style={[styles.tableCell, styles.quantity]}>Qty</Text>
          <Text style={[styles.tableCell, styles.rate]}>Rate</Text>
          <Text style={[styles.tableCell, styles.amount]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {data.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.description]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, styles.quantity]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.rate]}>
              ${item.rate.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Tax ({(data.taxRate * 100).toFixed(1)}%):</Text>
          <Text>${data.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text>Total:</Text>
          <Text>${data.total.toFixed(2)}</Text>
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
          Thank you for your business! Payment is due within 30 days of invoice
          date.
        </Text>
      </View>
    </Page>
  </Document>
);

// Invoice Generator Component
interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
  buttonText?: string;
  fileName?: string;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  invoiceData,
  buttonText = "Download Invoice",
  fileName,
  variant = "contained",
  size = "medium",
  fullWidth = false,
}) => {
  const defaultFileName = `invoice-${
    invoiceData.invoiceNumber
  }-${invoiceData.date.replace(/\//g, "-")}.pdf`;
  const pdfFileName = fileName || defaultFileName;

  return (
    <PDFDownloadLink
      document={<InvoicePDF data={invoiceData} />}
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
            minWidth: 150,
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

export default InvoiceGenerator;
export type { InvoiceData, InvoiceItem, Customer };
