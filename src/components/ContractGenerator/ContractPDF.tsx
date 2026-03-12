"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData } from "./types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    paddingBottom: 60,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#222222",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#444444",
  },
  divider: {
    borderBottom: "1 solid #cccccc",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 4,
    color: "#1a1a1a",
  },
  paragraph: {
    marginBottom: 6,
    fontSize: 11,
    lineHeight: 1.6,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontSize: 11,
    color: "#444444",
  },
  value: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  signatureSection: {
    marginTop: 30,
  },
  signatureLine: {
    borderBottom: "1 solid #000000",
    width: 250,
    marginTop: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#666666",
  },
  signatureName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#888888",
    borderTop: "1 solid #cccccc",
    paddingTop: 8,
  },
  indented: {
    paddingLeft: 12,
    marginBottom: 4,
  },
});

const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value: string): string => {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (value: string): string => {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

interface ContractPDFProps {
  data: ContractFormData;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ data }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>INRI Paint &amp; Wall LLC</Text>
      <Text style={styles.subtitle}>Contract Agreement</Text>

      <View style={styles.divider} />

      {/* Intro */}
      <Text style={styles.paragraph}>
        This Painting Contract Agreement (&quot;Agreement&quot;) is entered into
        on <Text style={styles.bold}>{formatDate(data.agreementDate)}</Text> by
        and between{" "}
        <Text style={styles.bold}>
          INRI Paint &amp; Wall LLC (&quot;Contractor&quot;)
        </Text>
        , located in Dallas, TX, and{" "}
        <Text style={styles.bold}>{data.clientName} (&quot;Client&quot;)</Text>{" "}
        residing at <Text style={styles.bold}>{data.clientAddress}</Text>.
      </Text>

      <View style={styles.divider} />

      {/* 1. Contact Information */}
      <Text style={styles.sectionTitle}>1. Contact Information</Text>

      <Text style={[styles.paragraph, styles.bold]}>Contractor:</Text>
      <View style={styles.indented}>
        <View style={styles.row}>
          <Text style={styles.label}>Company:</Text>
          <Text style={styles.value}>INRI Paint &amp; Wall LLC</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            5900 Balcones Drive, STE 100, Austin, TX 78731
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>214-400-1397</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>samuel@inripaintwall.com</Text>
        </View>
      </View>

      <Text style={[styles.paragraph, styles.bold]}>Client:</Text>
      <View style={styles.indented}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.clientName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.clientAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.clientPhone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.clientEmail}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2. Scope of Work */}
      <Text style={styles.sectionTitle}>2. Scope of Work</Text>
      <Text style={styles.paragraph}>
        Contractor agrees to provide painting and/or drywall services at the
        address provided by the Client.
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Type of project:</Text>
        <Text style={styles.value}>{data.typeOfProject}</Text>
      </View>
      <Text style={[styles.paragraph, { marginTop: 6 }]}>
        Customer&apos;s Details:
      </Text>
      <Text style={[styles.paragraph, styles.bold, styles.indented]}>
        {data.customerDetails}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Areas/Rooms:</Text>
        <Text style={styles.value}>{data.areasRooms}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Prep Work:</Text>
        <Text style={styles.value}>{data.prepWork}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Number of coats:</Text>
        <Text style={styles.value}>{data.numberOfCoats}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Paint brand/type:</Text>
        <Text style={styles.value}>{data.paintBrand}</Text>
      </View>
      <Text style={[styles.paragraph, { marginTop: 6 }]}>Exclusions:</Text>
      <Text style={[styles.paragraph, styles.bold, styles.indented]}>
        {data.exclusions}
      </Text>
      <Text style={styles.paragraph}>
        Photos may be taken before and after for clarity and project tracking.
      </Text>

      <View style={styles.divider} />

      {/* 3. Project Timeline */}
      <Text style={styles.sectionTitle}>3. Project Timeline</Text>
      <Text style={styles.paragraph}>
        Work is to begin on{" "}
        <Text style={styles.bold}>{formatDate(data.startDate)}</Text> and is
        estimated to be completed by{" "}
        <Text style={styles.bold}>{formatDate(data.completionDate)}</Text>,
        excluding weather delays or material backorders.
      </Text>
      <Text style={styles.paragraph}>
        Work hours will be from{" "}
        <Text style={styles.bold}>{formatTime(data.workStartTime)}</Text> to{" "}
        <Text style={styles.bold}>{formatTime(data.workEndTime)}</Text>.
      </Text>

      <View style={styles.divider} />

      {/* 4. Payment Terms */}
      <Text style={styles.sectionTitle}>4. Payment Terms</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Total Cost:</Text>
        <Text style={styles.value}>{formatCurrency(data.totalCost)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Deposit:</Text>
        <Text style={styles.value}>
          {formatCurrency(data.depositAmount)} due before project start.
        </Text>
      </View>
      <Text style={styles.paragraph}>
        The remaining balance is due upon completion and client approval.
      </Text>
      <Text style={styles.paragraph}>
        Accepted Payment Methods: Zelle, Cash, Credit Card, Debit Card.
      </Text>

      <View style={styles.divider} />

      {/* 5. Warranty & Satisfaction Guarantee */}
      <Text style={styles.sectionTitle}>
        5. Warranty &amp; Satisfaction Guarantee
      </Text>
      <Text style={styles.paragraph}>
        INRI Paint &amp; Wall LLC stands behind the quality of our craftsmanship
        and is committed to your satisfaction.
      </Text>
      <Text style={styles.paragraph}>
        We offer a{" "}
        <Text style={styles.bold}>{data.warrantyMonths} month(s)</Text> limited
        warranty on workmanship.
      </Text>
      <Text style={styles.paragraph}>
        If any defects in workmanship are found within the warranty period, we
        will return to correct the issue at no additional cost to the Client.
      </Text>
      <Text style={styles.paragraph}>
        This warranty does not cover damage caused by the Client, normal wear
        and tear, moisture, settling, or improper surface preparation done by
        others.
      </Text>

      <View style={styles.divider} />

      {/* 6. Client Responsibilities */}
      <Text style={styles.sectionTitle}>6. Client Responsibilities</Text>
      <Text style={styles.paragraph}>
        The Client agrees to provide access to the work areas during scheduled
        work hours. Furniture, personal items, and fragile objects should be
        moved away from work areas prior to the start date. INRI Paint &amp;
        Wall LLC is not responsible for items left in work areas.
      </Text>

      <View style={styles.divider} />

      {/* 7. Change Orders */}
      <Text style={styles.sectionTitle}>7. Change Orders</Text>
      <Text style={styles.paragraph}>
        Any changes to the scope of work after this Agreement is signed must be
        agreed upon in writing by both parties. Additional work may result in
        additional charges and extended timelines.
      </Text>

      <View style={styles.divider} />

      {/* 8. Cancellation Policy */}
      <Text style={styles.sectionTitle}>8. Cancellation Policy</Text>
      <Text style={styles.paragraph}>
        Either party may cancel this Agreement with written notice. If the
        Client cancels after work has begun, the Client is responsible for
        payment of all work completed to date. The deposit is non-refundable
        once materials have been purchased or work has commenced.
      </Text>

      <View style={styles.divider} />

      {/* 9. Liability */}
      <Text style={styles.sectionTitle}>9. Liability</Text>
      <Text style={styles.paragraph}>
        INRI Paint &amp; Wall LLC carries general liability insurance. The
        Contractor is not responsible for pre-existing conditions including but
        not limited to: mold, rot, structural damage, or surfaces not part of
        the agreed scope.
      </Text>

      <View style={styles.divider} />

      {/* 10. Dispute Resolution */}
      <Text style={styles.sectionTitle}>10. Dispute Resolution</Text>
      <Text style={styles.paragraph}>
        In the event of a dispute, both parties agree to attempt resolution
        through direct communication. If a resolution cannot be reached, both
        parties agree to seek mediation before pursuing legal action. This
        Agreement is governed by the laws of the State of Texas.
      </Text>

      <View style={styles.divider} />

      {/* 11. Entire Agreement */}
      <Text style={styles.sectionTitle}>11. Entire Agreement</Text>
      <Text style={styles.paragraph}>
        This document constitutes the entire agreement between the parties and
        supersedes all prior discussions, negotiations, and agreements. Any
        amendments must be made in writing and signed by both parties.
      </Text>

      <View style={styles.divider} />

      {/* 12. Acceptance & Signatures */}
      <Text style={styles.sectionTitle}>12. Acceptance &amp; Signatures</Text>
      <Text style={styles.paragraph}>
        By signing below, both parties agree to the terms and conditions
        outlined in this Agreement.
      </Text>

      <View style={styles.signatureSection}>
        <Text style={styles.paragraph}>Client Signature &amp; Date:</Text>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureName}>{data.clientSignatureName}</Text>
        <Text style={styles.signatureLabel}>Date: ___________________</Text>
      </View>

      <View style={[styles.signatureSection, { marginTop: 20 }]}>
        <Text style={styles.paragraph}>Contractor Signature &amp; Date:</Text>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureName}>INRI Paint &amp; Wall LLC</Text>
        <Text style={styles.signatureLabel}>{data.contractorName}</Text>
        <Text style={styles.signatureLabel}>Date: ___________________</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          INRI Paint &amp; Wall LLC | 5900 Balcones Drive, STE 100, Austin, TX
          78731 | 214-400-1397 | samuel@inripaintwall.com
        </Text>
      </View>
    </Page>
  </Document>
);

export default ContractPDF;
